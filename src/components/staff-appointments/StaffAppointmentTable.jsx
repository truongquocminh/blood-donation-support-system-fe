import React, { useState, useEffect } from 'react';
import {
  Eye, UserCheck, Calendar, Clock,
  CheckCircle, XCircle, AlertTriangle, User, Droplets, X
} from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { getUserById } from '../../services/userService';
import { formatVietnamTime } from '../../utils/formatters';
import { createBloodDonationInfo } from '../../services/bloodDonationInformationService';
import { updateAppointmentStatus } from '../../services/appointmentService';
import toast from 'react-hot-toast';

const StaffAppointmentTable = ({
  appointments,
  loading,
  onStatusUpdate,
  onViewDetails,
  onHealthCheck,
  onRefresh
}) => {
  const [userCache, setUserCache] = useState({}); 
  const [loadingUsers, setLoadingUsers] = useState(new Set());
  const [showBloodDonationModal, setShowBloodDonationModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [bloodDonationData, setBloodDonationData] = useState({
    actualBloodVolume: '',
    bloodTypeId: null
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUserInfo = async (userId) => {
    if (userCache[userId]) {
      return userCache[userId];
    }

    if (loadingUsers.has(userId)) {
      return null;
    }

    try {
      setLoadingUsers(prev => new Set([...prev, userId]));
      
      const userData = await getUserById(userId);
      
      setUserCache(prev => ({
        ...prev,
        [userId]: userData.data.data
      }));
      
      return userData.data.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      setUserCache(prev => ({
        ...prev,
        [userId]: { error: true, fullName: 'Không tìm thấy', email: '' }
      }));
      return null;
    } finally {
      setLoadingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      const userIds = [...new Set(appointments.map(apt => apt.userId))];
      
      const promises = userIds
        .filter(userId => !userCache[userId])
        .map(userId => fetchUserInfo(userId));
      
      await Promise.all(promises);
    };

    if (appointments.length > 0) {
      fetchAllUsers();
    }
  }, [appointments]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      [APPOINTMENT_STATUS.PENDING]: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Chờ xác nhận'
      },
      [APPOINTMENT_STATUS.SCHEDULED]: {
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Đã lên lịch'
      },
      [APPOINTMENT_STATUS.MEDICAL_COMPLETED]: {
        icon: UserCheck,
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Đã kiểm tra y tế'
      },
      [APPOINTMENT_STATUS.COMPLETED]: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Hoàn thành'
      },
      [APPOINTMENT_STATUS.CANCELLED]: {
        icon: XCircle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Đã hủy'
      }
    };

    const config = statusConfig[status] || statusConfig[APPOINTMENT_STATUS.PENDING];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const handleOpenBloodDonationModal = (appointment) => {
    setSelectedAppointment(appointment);
    setBloodDonationData({
      actualBloodVolume: '',
      bloodTypeId: null
    });
    setShowBloodDonationModal(true);
  };

  const handleCloseBloodDonationModal = () => {
    setShowBloodDonationModal(false);
    setSelectedAppointment(null);
    setBloodDonationData({
      actualBloodVolume: '',
      bloodTypeId: null
    });
  };

  const handleSubmitBloodDonation = async (e) => {
    e.preventDefault();
    
    if (!bloodDonationData.actualBloodVolume || parseFloat(bloodDonationData.actualBloodVolume) <= 0) {
      toast.error('Vui lòng nhập thể tích máu hợp lệ');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        appointmentId: selectedAppointment.appointmentId,
        bloodTypeId: bloodDonationData.bloodTypeId,
        actualBloodVolume: parseFloat(bloodDonationData.actualBloodVolume)
      };

      await createBloodDonationInfo(payload);
      await updateAppointmentStatus(selectedAppointment.appointmentId, APPOINTMENT_STATUS.COMPLETED);

      toast.success('Thêm thông tin hiến máu thành công!');
      handleCloseBloodDonationModal();
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating blood donation info:', error);
      toast.error('Có lỗi xảy ra khi thêm thông tin hiến máu');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusActions = (appointment) => {
    const actions = [];

    switch (appointment.status) {
      case APPOINTMENT_STATUS.PENDING:
        actions.push(
          <button
            key="schedule"
            onClick={() => onStatusUpdate(appointment.userId, appointment.appointmentDate, appointment.appointmentId, APPOINTMENT_STATUS.SCHEDULED)}
            className="text-green-600 hover:text-green-800 text-sm font-medium px-2 py-1 hover:bg-green-50 rounded"
          >
            Xác nhận
          </button>
        );
        actions.push(
          <button
            key="cancel"
            onClick={() => onStatusUpdate(appointment.userId, appointment.appointmentDate, appointment.appointmentId, APPOINTMENT_STATUS.CANCELLED)}
            className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 hover:bg-red-50 rounded"
          >
            Từ chối
          </button>
        );
        break;

      case APPOINTMENT_STATUS.SCHEDULED:
        actions.push(
          <button
            key="health-check"
            onClick={() => onHealthCheck(appointment)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 hover:bg-blue-50 rounded"
          >
            Kiểm tra sức khỏe
          </button>
        );
        break;

      case APPOINTMENT_STATUS.MEDICAL_COMPLETED:
        actions.push(
          <button
            key="blood-donation"
            onClick={() => handleOpenBloodDonationModal(appointment)}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium px-2 py-1 hover:bg-purple-50 rounded flex items-center space-x-1"
          >
            <Droplets className="w-3 h-3" />
            <span>Thêm thông tin hiến máu</span>
          </button>
        );
        break;

      default:
        break;
    }

    return actions;
  };

  const isPastDue = (appointmentDate, status) => {
    return new Date(appointmentDate) < new Date() &&
      [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(status);
  };

  const isToday = (appointmentDate) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    return appointment.toDateString() === today.toDateString();
  };

  const isTomorrow = (appointmentDate) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointment = new Date(appointmentDate);
    return appointment.toDateString() === tomorrow.toDateString();
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const now = new Date();
    const aDate = new Date(a.appointmentDate);
    const bDate = new Date(b.appointmentDate);

    const isOverdue = (date, status) =>
      date < now && [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(status);

    const getPriority = (status) => {
      switch (status) {
        case APPOINTMENT_STATUS.PENDING:
          return 1;
        case APPOINTMENT_STATUS.SCHEDULED:
          return 2;
        case APPOINTMENT_STATUS.MEDICAL_COMPLETED:
          return 3;
        case APPOINTMENT_STATUS.COMPLETED:
          return 4;
        case APPOINTMENT_STATUS.CANCELLED:
          return 5;
        default:
          return 6;
      }
    };

    const aOverdue = isOverdue(aDate, a.status);
    const bOverdue = isOverdue(bDate, b.status);

    if (aOverdue !== bOverdue) {
      return aOverdue ? 1 : -1;
    }

    const aPriority = getPriority(a.status);
    const bPriority = getPriority(b.status);
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    const aDiff = Math.abs(aDate - now);
    const bDiff = Math.abs(bDate - now);
    return aDiff - bDiff;
  });

  const UserInfo = ({ userId }) => {
    const user = userCache[userId];
    const isLoading = loadingUsers.has(userId);

    if (isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-500">Đang tải...</span>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm text-gray-500">ID: {userId}</div>
            <div className="text-xs text-gray-400">Chưa tải được thông tin</div>
          </div>
        </div>
      );
    }

    if (user.error) {
      return (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-red-400" />
          <div>
            <div className="text-sm text-red-500">ID: {userId}</div>
            <div className="text-xs text-red-400">Không tìm thấy thông tin</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <User className="w-4 h-4 text-gray-400" />
        <div>
          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách lịch hẹn ({appointments.length})
          </h3>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch hẹn nào</h3>
            <p className="text-gray-500">Chưa có lịch hẹn nào phù hợp với bộ lọc</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Lịch hẹn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian hẹn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAppointments.map((appointment) => (
                  <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{appointment.appointmentId}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <UserInfo userId={appointment.userId} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className={`text-sm ${isToday(appointment.appointmentDate) ? 'font-medium text-blue-600' :
                            isTomorrow(appointment.appointmentDate) ? 'font-medium text-green-600' : 'text-gray-900'
                            }`}>
                            {formatVietnamTime(appointment.appointmentDate)}
                            {isToday(appointment.appointmentDate) && (
                              <span className="ml-1 text-blue-500">(Hôm nay)</span>
                            )}
                            {isTomorrow(appointment.appointmentDate) && (
                              <span className="ml-1 text-green-500">(Ngày mai)</span>
                            )}
                          </div>
                          
                          {isPastDue(appointment.appointmentDate, appointment.status) && (
                            <div className="text-xs text-red-500 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Quá hạn
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewDetails(appointment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col space-y-1">
                          {getStatusActions(appointment).map((action, index) => (
                            <div key={index}>{action}</div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showBloodDonationModal && selectedAppointment && (
        <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Droplets className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thông tin hiến máu
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lịch hẹn #{selectedAppointment.appointmentId}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseBloodDonationModal}
                disabled={submitting}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBloodDonation} className="p-6 space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Droplets className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-purple-700">
                    <p className="font-medium mb-1">Thông tin hiến máu:</p>
                    <p>Nhập thể tích máu thực tế đã hiến (ml).</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thể tích máu thực tế (ml) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="250"
                  max="650"
                  step="50"
                  value={bloodDonationData.actualBloodVolume}
                  onChange={(e) => setBloodDonationData(prev => ({
                    ...prev,
                    actualBloodVolume: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="VD: 500"
                  disabled={submitting}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Thể tích máu thực tế đã thu được (250-650ml)
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseBloodDonationModal}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu và hoàn thành'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffAppointmentTable;
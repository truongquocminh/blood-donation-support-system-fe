import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { getUserById } from '../../services/userService';

const AppointmentDetailsModal = ({ 
  isOpen, 
  onClose, 
  appointment, 
}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!appointment?.userId) return;

      setLoadingUser(true);
      setUserError(false);
      
      try {
        const userData = await getUserById(appointment.userId);
        setUserInfo(userData.data.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUserError(true);
      } finally {
        setLoadingUser(false);
      }
    };

    if (isOpen && appointment) {
      fetchUserInfo();
    }
  }, [appointment, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setUserInfo(null);
      setLoadingUser(false);
      setUserError(false);
    }
  }, [isOpen]);

  if (!isOpen || !appointment) return null;

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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {config.label}
      </span>
    );
  };

  const UserInfoDisplay = () => {
    if (loadingUser) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-500">Đang tải thông tin người dùng...</span>
        </div>
      );
    }

    if (userError || !userInfo) {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-500">Không thể tải thông tin người dùng</span>
          </div>
          <p className="text-sm text-gray-600">ID: {appointment.userId}</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900">{userInfo.fullName}</span>
        </div>
        <div className="text-sm text-gray-600">{userInfo.email}</div>
        <div className="text-xs text-gray-500">ID: {appointment.userId}</div>
        {userInfo.role && (
          <div className="text-xs text-gray-500">
            Vai trò: <span className="font-medium">{userInfo.role}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết lịch hẹn
              </h3>
              <p className="text-sm text-gray-600">
                Lịch hẹn #{appointment.appointmentId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin người dùng */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin người dùng</h4>
            <UserInfoDisplay />
          </div>

          {/* Thông tin lịch hẹn */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin lịch hẹn</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">ID Lịch hẹn:</span>
                  <p className="text-sm font-medium text-gray-900">#{appointment.appointmentId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ngày hẹn:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Giờ hẹn:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ngày trong tuần:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', {
                      weekday: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trạng thái hiện tại */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Trạng thái hiện tại</h4>
            <div className="flex items-center space-x-2">
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          {/* Thông tin thời gian */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin thời gian</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian lịch hẹn:</span>
                <span className="font-medium">
                  {new Date(appointment.appointmentDate).toLocaleString('vi-VN')}
                </span>
              </div>
              
              {/* Kiểm tra xem có phải hôm nay không */}
              {new Date(appointment.appointmentDate).toDateString() === new Date().toDateString() && (
                <div className="flex justify-between text-blue-600">
                  <span>Lịch hẹn hôm nay:</span>
                  <span className="font-medium">Cần được ưu tiên xử lý</span>
                </div>
              )}
              
              {/* Kiểm tra quá hạn */}
              {new Date(appointment.appointmentDate) < new Date() && 
               [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(appointment.status) && (
                <div className="flex justify-between text-red-600">
                  <span>Trạng thái:</span>
                  <span className="font-medium flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Quá hạn
                  </span>
                </div>
              )}
              
              {appointment.status === APPOINTMENT_STATUS.COMPLETED && (
                <div className="flex justify-between text-green-600">
                  <span>Trạng thái:</span>
                  <span className="font-medium">Đã hoàn thành thành công</span>
                </div>
              )}
              
              {appointment.status === APPOINTMENT_STATUS.CANCELLED && (
                <div className="flex justify-between text-red-600">
                  <span>Trạng thái:</span>
                  <span className="font-medium">Đã bị hủy</span>
                </div>
              )}
            </div>
          </div>

          {/* Ghi chú */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Thông tin chi tiết:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Thông tin người dùng được tải từ API riêng biệt</li>
                  <li>Kết quả kiểm tra sức khỏe sẽ được hiển thị sau khi hoàn thành</li>
                  <li>Có thể cập nhật trạng thái lịch hẹn từ bảng danh sách</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
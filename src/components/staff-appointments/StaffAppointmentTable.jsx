import React from 'react';
import {
  Eye, UserCheck, Calendar, Clock,
  CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants';

const StaffAppointmentTable = ({
  appointments,
  loading,
  onStatusUpdate,
  onViewDetails,
  onHealthCheck
}) => {

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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getStatusActions = (appointment) => {
    const actions = [];

    switch (appointment.status) {
      case APPOINTMENT_STATUS.PENDING:
        actions.push(
          <button
            key="schedule"
            onClick={() => onStatusUpdate(appointment.appointmentId, APPOINTMENT_STATUS.SCHEDULED)}
            className="text-green-600 hover:text-green-800 text-sm font-medium px-2 py-1 hover:bg-green-50 rounded"
          >
            Xác nhận
          </button>
        );
        actions.push(
          <button
            key="cancel"
            onClick={() => onStatusUpdate(appointment.appointmentId, APPOINTMENT_STATUS.CANCELLED)}
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

    const aCancelled = a.status === APPOINTMENT_STATUS.CANCELLED;
    const bCancelled = b.status === APPOINTMENT_STATUS.CANCELLED;

    if (aCancelled && !bCancelled) return 1;
    if (!aCancelled && bCancelled) return -1;

    const aDiff = Math.abs(aDate - now);
    const bDiff = Math.abs(bDate - now);

    return aDiff - bDiff;
  });


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
                  ID Người dùng
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
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.userId}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className={`text-sm ${isToday(appointment.appointmentDate) ? 'font-medium text-blue-600' :
                          isTomorrow(appointment.appointmentDate) ? 'font-medium text-green-600' : 'text-gray-900'
                          }`}>
                          {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}
                          {isToday(appointment.appointmentDate) && (
                            <span className="ml-1 text-blue-500">(Hôm nay)</span>
                          )}
                          {isTomorrow(appointment.appointmentDate) && (
                            <span className="ml-1 text-green-500">(Ngày mai)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(appointment.appointmentDate).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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
  );
};

export default StaffAppointmentTable;
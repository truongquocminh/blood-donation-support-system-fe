import React from 'react';
import { X, Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants';

const AppointmentDetailsModal = ({ isOpen, onClose, appointment }) => {
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
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin lịch hẹn</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">ID Lịch hẹn:</span>
                  <p className="text-sm font-medium text-gray-900">#{appointment.appointmentId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">ID Người dùng:</span>
                  <p className="text-sm font-medium text-gray-900">{appointment.userId}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Ngày hẹn:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Giờ hẹn:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Trạng thái hiện tại</h4>
            <div className="flex items-center space-x-2">
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin thời gian</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày tạo lịch hẹn:</span>
                <span className="font-medium">
                  {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              
              {appointment.status === APPOINTMENT_STATUS.COMPLETED && (
                <div className="flex justify-between text-green-600">
                  <span>Ngày hoàn thành:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
              
              {appointment.status === APPOINTMENT_STATUS.CANCELLED && (
                <div className="flex justify-between text-red-600">
                  <span>Ngày hủy:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Lưu ý:</p>
                <p>
                  Đây là thông tin cơ bản từ API. Chi tiết về người dùng và thông tin kiểm tra sức khỏe 
                  cần được tải từ các API riêng biệt khi cần thiết.
                </p>
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
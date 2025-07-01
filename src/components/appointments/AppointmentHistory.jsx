import React from 'react';
import { Calendar, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants'; 

const AppointmentHistory = ({ appointments, onCancel }) => {
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

  const canCancel = (appointment) => {
    return [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(appointment.status) && 
           new Date(appointment.appointmentDate) > new Date();
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Lịch sử lịch hẹn ({appointments.length})
        </h3>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch hẹn nào</h3>
          <p className="text-gray-500">Hãy đặt lịch hẹn hiến máu đầu tiên của bạn!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <div key={appointment.appointmentId} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        Lịch hẹn #{appointment.appointmentId}
                      </span>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className={isToday(appointment.appointmentDate) ? 'font-medium text-blue-600' : ''}>
                        {new Date(appointment.appointmentDate).toLocaleString('vi-VN')}
                        {isToday(appointment.appointmentDate) && (
                          <span className="ml-1 text-blue-500">(Hôm nay)</span>
                        )}
                      </span>
                      {isPastDue(appointment.appointmentDate, appointment.status) && (
                        <div className="text-red-500 text-xs">Quá hạn</div>
                      )}
                    </div>
                  </div>

                  {appointment.status === APPOINTMENT_STATUS.PENDING && (
                    <div className="flex items-center space-x-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                      <Clock className="w-4 h-4" />
                      <span>Lịch hẹn đang chờ xác nhận từ nhân viên y tế</span>
                    </div>
                  )}

                  {appointment.status === APPOINTMENT_STATUS.SCHEDULED && (
                    <div className="flex items-center space-x-2 text-sm text-blue-700 bg-blue-50 p-2 rounded">
                      <CheckCircle className="w-4 h-4" />
                      <span>Lịch hẹn đã được xác nhận. Vui lòng đến đúng giờ hẹn.</span>
                    </div>
                  )}

                  {appointment.status === APPOINTMENT_STATUS.COMPLETED && (
                    <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Cảm ơn bạn đã hiến máu! Hoàn thành lúc: {' '}
                        {new Date(appointment.appointmentDate).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  )}

                  {appointment.status === APPOINTMENT_STATUS.CANCELLED && (
                    <div className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      <XCircle className="w-4 h-4" />
                      <span>Lịch hẹn đã bị hủy</span>
                    </div>
                  )}
                </div>

                {canCancel(appointment) && (
                  <div className="ml-4">
                    <button
                      onClick={() => onCancel(appointment.appointmentId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hủy lịch hẹn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
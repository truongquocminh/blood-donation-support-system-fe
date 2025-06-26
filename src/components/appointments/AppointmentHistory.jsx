import React from 'react';
import { 
  MapPin, Calendar, X, Clock, User,
  CheckCircle, XCircle, AlertCircle, UserCheck, Heart
} from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants'; 

const AppointmentHistory = ({ 
  appointments, 
  bloodTypes, 
  bloodComponents, 
  onCancel 
}) => {
  const getBloodTypeName = (typeId) => {
    const type = bloodTypes.find(t => t.bloodTypeId === typeId);
    return type ? type.typeName : 'N/A';
  };

  const getComponentName = (componentId) => {
    const component = bloodComponents.find(c => c.componentId === componentId);
    return component ? component.componentName : 'N/A';
  };

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
            <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        Lịch hẹn #{appointment.id}
                      </span>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
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
                    
                    {appointment.bloodType && appointment.bloodComponent && (
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {getBloodTypeName(appointment.bloodType)} - {getComponentName(appointment.bloodComponent)}
                        </span>
                        {appointment.volumeMl && (
                          <span className="text-xs text-gray-500">({appointment.volumeMl}ml)</span>
                        )}
                      </div>
                    )}
                  </div>

                  {appointment.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{appointment.notes}</p>
                    </div>
                  )}

                  {appointment.healthCheck && (
                    <div className={`p-4 rounded-lg border mb-4 ${
                      appointment.healthCheck.isEligible 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <UserCheck className={`w-5 h-5 mt-0.5 ${
                          appointment.healthCheck.isEligible ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium mb-2 ${
                            appointment.healthCheck.isEligible ? 'text-green-800' : 'text-red-800'
                          }`}>
                            Kết quả kiểm tra sức khỏe
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                            <div>
                              <span className="text-gray-600">Mạch: </span>
                              <span className="font-medium">{appointment.healthCheck.pulse} bpm</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Huyết áp: </span>
                              <span className="font-medium">{appointment.healthCheck.bloodPressure}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Nhóm máu xác nhận: </span>
                              <span className="font-medium">{getBloodTypeName(appointment.healthCheck.bloodTypeId)}</span>
                            </div>
                          </div>

                          <p className={`text-sm ${
                            appointment.healthCheck.isEligible ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {appointment.healthCheck.resultSummary}
                          </p>

                          {!appointment.healthCheck.isEligible && appointment.healthCheck.ineligibleReason && (
                            <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                              <strong>Lý do không đủ điều kiện:</strong> {appointment.healthCheck.ineligibleReason}
                            </div>
                          )}

                          <div className="mt-2 text-xs text-gray-500">
                            Kiểm tra bởi: {appointment.healthCheck.staffName} - {' '}
                            {new Date(appointment.healthCheck.checkedAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {appointment.status === APPOINTMENT_STATUS.PENDING && (
                    <div className="flex items-center space-x-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                      <Clock className="w-4 h-4" />
                      <span>Lịch hẹn đang chờ xác nhận từ nhân viên y tế</span>
                    </div>
                  )}

                  {appointment.status === APPOINTMENT_STATUS.SCHEDULED && !appointment.healthCheck && (
                    <div className="flex items-center space-x-2 text-sm text-blue-700 bg-blue-50 p-2 rounded">
                      <UserCheck className="w-4 h-4" />
                      <span>Vui lòng đến đúng giờ để kiểm tra sức khỏe trước khi hiến máu</span>
                    </div>
                  )}

                  {appointment.status === APPOINTMENT_STATUS.COMPLETED && (
                    <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                      <Heart className="w-4 h-4" fill="currentColor" />
                      <span>
                        Cảm ơn bạn đã hiến máu! Hoàn thành lúc: {' '}
                        {new Date(appointment.completedAt || appointment.appointmentDate).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>

                {canCancel(appointment) && (
                  <div className="ml-4">
                    <button
                      onClick={() => onCancel(appointment.id)}
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

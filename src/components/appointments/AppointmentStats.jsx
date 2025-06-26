import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants'; 

const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '100')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const AppointmentStats = ({ appointments }) => {
  const totalAppointments = appointments.length;
  
  const pendingAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.PENDING).length;
  
  const scheduledAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.SCHEDULED).length;
  
  const completedAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length;

  const nextAppointment = appointments
    .filter(a => [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(a.status))
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0];

  const getNextAppointmentText = () => {
    if (!nextAppointment) return 'Không có';
    
    const appointmentDate = new Date(nextAppointment.appointmentDate);
    const today = new Date();
    const diffDays = Math.ceil((appointmentDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    if (diffDays > 0) return `${diffDays} ngày nữa`;
    return 'Đã quá hạn';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Tổng lịch hẹn"
        value={totalAppointments}
        icon={Calendar}
        color="text-blue-600"
        subtitle="Tất cả"
      />
      
      <StatsCard
        title="Chờ xác nhận"
        value={pendingAppointments}
        icon={Clock}
        color="text-yellow-600"
        subtitle="Đang chờ duyệt"
      />
      
      <StatsCard
        title="Đã lên lịch"
        value={scheduledAppointments}
        icon={CheckCircle}
        color="text-green-600"
        subtitle="Sẵn sàng"
      />
      
      <StatsCard
        title="Lịch hẹn tiếp theo"
        value={getNextAppointmentText()}
        icon={Calendar}
        color="text-purple-600"
        subtitle={nextAppointment ? new Date(nextAppointment.appointmentDate).toLocaleDateString('vi-VN') : ''}
      />
    </div>
  );
};

export default AppointmentStats;
import React from 'react';
import { Calendar, Clock, CheckCircle, Users, UserCheck, AlertTriangle } from 'lucide-react';
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

const StaffAppointmentStats = ({ appointments }) => {
  const totalAppointments = appointments.length;
  
  const pendingAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.PENDING).length;
  
  const scheduledAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.SCHEDULED).length;
  
  const completedAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length;

  const todayAppointments = appointments.filter(a => {
    const today = new Date();
    const appointmentDate = new Date(a.appointmentDate);
    return appointmentDate.toDateString() === today.toDateString();
  }).length;

  const needHealthCheck = appointments.filter(a => 
    [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(a.status) && 
    !a.healthCheck
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
        subtitle="Cần duyệt"
      />
      
      <StatsCard
        title="Đã lên lịch"
        value={scheduledAppointments}
        icon={CheckCircle}
        color="text-green-600"
        subtitle="Sẵn sàng"
      />
      
      <StatsCard
        title="Hoàn thành"
        value={completedAppointments}
        icon={CheckCircle}
        color="text-green-600"
        subtitle="Đã hiến máu"
      />
      
      <StatsCard
        title="Hôm nay"
        value={todayAppointments}
        icon={Users}
        color="text-purple-600"
        subtitle="Lịch hẹn"
      />
      
      <StatsCard
        title="Cần kiểm tra"
        value={needHealthCheck}
        icon={UserCheck}
        color="text-orange-600"
        subtitle="Sức khỏe"
      />
    </div>
  );
};

export default StaffAppointmentStats;
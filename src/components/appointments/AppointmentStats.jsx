import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { formatVietnamTime } from '../../utils/formatters'; 

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
  const getVietnamTime = () => {
    return new Date(new Date().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh"
    }));
  };

  const totalAppointments = appointments.length;
  
  const pendingAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.PENDING).length;
  
  const scheduledAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.SCHEDULED).length;
  
  const completedAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length;

  const cancelledAppointments = appointments.filter(a => a.status === APPOINTMENT_STATUS.CANCELLED).length;

  // Lấy lịch hẹn tiếp theo theo giờ Việt Nam
  const nextAppointment = appointments
    .filter(a => {
      if (![APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(a.status)) {
        return false;
      }
      
      const appointmentDate = new Date(a.appointmentDate);
      const vietnamNow = getVietnamTime();
      return appointmentDate >= vietnamNow;
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0];

  const getNextAppointmentText = () => {
    if (!nextAppointment) return 'Không có';
    
    const appointmentDate = new Date(nextAppointment.appointmentDate);
    const vietnamNow = getVietnamTime();
    
    // Reset time to start of day for day comparison
    const appointmentDay = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
    const today = new Date(vietnamNow.getFullYear(), vietnamNow.getMonth(), vietnamNow.getDate());
    
    const diffTime = appointmentDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    if (diffDays > 1) return `${diffDays} ngày nữa`;
    return 'Đã quá hạn';
  };

  const getNextAppointmentSubtitle = () => {
    if (!nextAppointment) return '';
    
    try {
      // Sử dụng formatVietnamTime nếu có sẵn, nếu không thì fallback
      if (typeof formatVietnamTime === 'function') {
        return `${formatVietnamTime(nextAppointment.appointmentDate, 'dddd, DD/MM/YYYY HH:mm')}`;
      } else {
        // Fallback: format theo giờ Việt Nam
        const vietnamDate = new Date(nextAppointment.appointmentDate).toLocaleString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
          weekday: 'long',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        return vietnamDate;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date(nextAppointment.appointmentDate).toLocaleDateString('vi-VN');
    }
  };

  // Tính số lịch hẹn quá hạn (đã qua thời gian nhưng vẫn ở trạng thái PENDING/SCHEDULED)
  const overdueAppointments = appointments.filter(a => {
    if (![APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.SCHEDULED].includes(a.status)) {
      return false;
    }
    
    const appointmentDate = new Date(a.appointmentDate);
    const vietnamNow = getVietnamTime();
    return appointmentDate < vietnamNow;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
        title="Đã hoàn thành"
        value={completedAppointments}
        icon={CheckCircle}
        color="text-emerald-600"
        subtitle="Thành công"
      />
      
      <StatsCard
        title="Lịch hẹn tiếp theo"
        value={getNextAppointmentText()}
        icon={Calendar}
        color="text-purple-600"
        subtitle={getNextAppointmentSubtitle()}
      />

      {/* {overdueAppointments > 0 && (
        <div className="md:col-span-2 lg:col-span-1">
          <StatsCard
            title="Quá hạn"
            value={overdueAppointments}
            icon={XCircle}
            color="text-red-600"
            subtitle="Cần xử lý"
          />
        </div>
      )} */}
    </div>
  );
};

export default AppointmentStats;
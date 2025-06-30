import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
  <div 
    className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
      onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-300' : ''
    }`}
    onClick={onClick}
  >
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

const UserReminderStats = ({ reminders, onFilterChange }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const totalReminders = reminders.length;
  
  const upcomingReminders = reminders.filter(reminder => {
    if (reminder.sent) return false;
    
    const reminderDate = new Date(reminder.nextDate);
    reminderDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).length;
  
  const todayReminders = reminders.filter(reminder => {
    const reminderDate = new Date(reminder.nextDate);
    reminderDate.setHours(0, 0, 0, 0);
    
    return reminderDate.getTime() === today.getTime();
  }).length;
  
  const receivedReminders = reminders.filter(reminder => reminder.sent).length;

  const urgentCount = reminders.filter(reminder => {
    if (reminder.sent) return false;
    
    const reminderDate = new Date(reminder.nextDate);
    reminderDate.setHours(0, 0, 0, 0);
    
    return reminderDate <= today;
  }).length;

  const handleStatsClick = (filterType) => {
    if (onFilterChange) {
      switch (filterType) {
        case 'upcoming':
          onFilterChange('upcoming');
          break;
        case 'today':
          onFilterChange('today');
          break;
        case 'received':
          onFilterChange('received');
          break;
        default:
          onFilterChange('');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Tổng nhắc nhở"
        value={totalReminders}
        icon={Calendar}
        color="text-blue-600"
        subtitle="Tất cả nhắc nhở"
        onClick={() => handleStatsClick('')}
      />
      
      <StatsCard
        title="Sắp tới"
        value={upcomingReminders}
        icon={Clock}
        color="text-orange-600"
        subtitle="Trong 7 ngày tới"
        onClick={() => handleStatsClick('upcoming')}
      />
      
      <StatsCard
        title={urgentCount > 0 ? "Cần chú ý" : "Hôm nay"}
        value={urgentCount > 0 ? urgentCount : todayReminders}
        icon={AlertCircle}
        color={urgentCount > 0 ? "text-red-600" : "text-purple-600"}
        subtitle={urgentCount > 0 ? "Hôm nay & quá hạn" : "Nhắc nhở hôm nay"}
        onClick={() => handleStatsClick('today')}
      />
      
      <StatsCard
        title="Đã nhận"
        value={receivedReminders}
        icon={CheckCircle}
        color="text-green-600"
        subtitle="Đã xem qua"
        onClick={() => handleStatsClick('received')}
      />
    </div>
  );
};

export default UserReminderStats;
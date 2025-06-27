import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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

const UserReminderStats = ({ reminders }) => {
  const today = new Date();
  
  const totalReminders = reminders.length;
  
  const upcomingReminders = reminders.filter(reminder => {
    const reminderDate = new Date(reminder.nextDate);
    const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0 && !reminder.sent;
  }).length;
  
  const todayReminders = reminders.filter(reminder => {
    const reminderDate = new Date(reminder.nextDate);
    return reminderDate.toDateString() === today.toDateString();
  }).length;
  
  const receivedReminders = reminders.filter(reminder => reminder.sent).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Tổng nhắc nhở"
        value={totalReminders}
        icon={Calendar}
        color="text-blue-600"
        subtitle="Tất cả nhắc nhở"
      />
      
      <StatsCard
        title="Sắp tới"
        value={upcomingReminders}
        icon={Clock}
        color="text-orange-600"
        subtitle="Trong 7 ngày tới"
      />
      
      <StatsCard
        title="Hôm nay"
        value={todayReminders}
        icon={AlertCircle}
        color="text-purple-600"
        subtitle="Cần chú ý"
      />
      
      <StatsCard
        title="Đã nhận"
        value={receivedReminders}
        icon={CheckCircle}
        color="text-green-600"
        subtitle="Đã xem qua"
      />
    </div>
  );
};

export default UserReminderStats;
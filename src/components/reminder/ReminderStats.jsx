// import React from 'react';
// import { Bell, CheckCircle, Clock, Users } from 'lucide-react';

// const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
//   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//         <p className={`text-2xl font-bold ${color}`}>{value}</p>
//         {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//       </div>
//       <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '100')}`}>
//         <Icon className={`w-6 h-6 ${color}`} />
//       </div>
//     </div>
//   </div>
// );

// const ReminderStats = ({ reminders }) => {
//   const totalReminders = reminders.length;
  
//   const sentReminders = reminders.filter(reminder => reminder.sent).length;
  
//   const pendingReminders = reminders.filter(reminder => !reminder.sent).length;
  
//   const todayReminders = reminders.filter(reminder => {
//     const today = new Date();
//     const reminderDate = new Date(reminder.nextDate);
//     return reminderDate.toDateString() === today.toDateString();
//   }).length;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       <StatsCard
//         title="Tổng nhắc nhở"
//         value={totalReminders}
//         icon={Bell}
//         color="text-blue-600"
//         subtitle="Tất cả nhắc nhở"
//       />
      
//       <StatsCard
//         title="Đã gửi"
//         value={sentReminders}
//         icon={CheckCircle}
//         color="text-green-600"
//         subtitle="Nhắc nhở đã gửi"
//       />
      
//       <StatsCard
//         title="Chờ gửi"
//         value={pendingReminders}
//         icon={Clock}
//         color="text-yellow-600"
//         subtitle="Nhắc nhở chưa gửi"
//       />
      
//       <StatsCard
//         title="Hôm nay"
//         value={todayReminders}
//         icon={Users}
//         color="text-purple-600"
//         subtitle="Nhắc nhở hôm nay"
//       />
//     </div>
//   );
// };

// export default ReminderStats;
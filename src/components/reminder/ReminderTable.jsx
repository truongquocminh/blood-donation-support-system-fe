// import React from 'react';
// import { Edit, Trash2, Bell, CheckCircle, Clock, User, MessageSquare } from 'lucide-react';
// import { REMINDER_TYPE_LABELS, REMINDER_TYPE_COLORS } from '../../utils/constants';

// const ReminderTable = ({ 
//   reminders, 
//   onEdit, 
//   onDelete,
//   searchTerm,
//   filterType,
//   filterStatus
// }) => {
//   const getReminderTypeBadge = (type) => {
//     const colorClass = REMINDER_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800';
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
//         <Bell className="w-3 h-3 mr-1" />
//         {REMINDER_TYPE_LABELS[type] || type}
//       </span>
//     );
//   };

//   const getStatusBadge = (reminder) => {
//     const today = new Date();
//     const reminderDate = new Date(reminder.nextDate);
//     const isToday = reminderDate.toDateString() === today.toDateString();
    
//     if (reminder.sent) {
//       return (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//           <CheckCircle className="w-3 h-3 mr-1" />
//           Đã gửi
//         </span>
//       );
//     }
    
//     if (isToday) {
//       return (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//           <Clock className="w-3 h-3 mr-1" />
//           Hôm nay
//         </span>
//       );
//     }
    
//     return (
//       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//         <Clock className="w-3 h-3 mr-1" />
//         Chờ gửi
//       </span>
//     );
//   };

//   const isUpcoming = (nextDate) => {
//     const today = new Date();
//     const reminderDate = new Date(nextDate);
//     const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
//     return diffDays <= 3 && diffDays >= 0;
//   };

//   const filteredReminders = reminders.filter(reminder => {
//     const matchesSearch = searchTerm === '' || 
//       reminder.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       reminder.userId.toString().includes(searchTerm.toLowerCase());
    
//     const matchesType = filterType === '' || reminder.reminderType === filterType;
    
//     let matchesStatus = true;
//     if (filterStatus === 'sent') {
//       matchesStatus = reminder.sent;
//     } else if (filterStatus === 'pending') {
//       matchesStatus = !reminder.sent;
//     } else if (filterStatus === 'today') {
//       const today = new Date();
//       const reminderDate = new Date(reminder.nextDate);
//       matchesStatus = reminderDate.toDateString() === today.toDateString();
//     }
    
//     return matchesSearch && matchesType && matchesStatus;
//   });

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h3 className="text-lg font-medium text-gray-900">
//           Danh sách nhắc nhở ({filteredReminders.length})
//         </h3>
//       </div>
      
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 ID
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Người dùng
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Loại nhắc nhở
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Tin nhắn
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Ngày nhắc nhở
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Trạng thái
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Thao tác
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredReminders.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
//                   <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                   <p className="text-lg font-medium mb-2">Không tìm thấy nhắc nhở</p>
//                   <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
//                 </td>
//               </tr>
//             ) : (
//               filteredReminders.map((reminder) => (
//                 <tr key={reminder.reminderId} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     #{reminder.reminderId}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       <User className="w-3 h-3 mr-1" />
//                       {reminder.userId}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {getReminderTypeBadge(reminder.reminderType)}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
//                     <div className="flex items-start">
//                       <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
//                       <span className="truncate" title={reminder.message}>
//                         {reminder.message}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <div className={`${isUpcoming(reminder.nextDate) && !reminder.sent ? 'text-purple-600 font-medium' : ''}`}>
//                       {new Date(reminder.nextDate).toLocaleDateString('vi-VN')}
//                       {isUpcoming(reminder.nextDate) && !reminder.sent && (
//                         <div className="text-xs text-purple-500">Sắp tới</div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {getStatusBadge(reminder)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex items-center justify-end space-x-2">
//                       <button
//                         onClick={() => onEdit(reminder)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="Chỉnh sửa"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => onDelete(reminder.reminderId)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         title="Xóa"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ReminderTable;
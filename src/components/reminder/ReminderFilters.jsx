// import React from 'react';
// import { Search, Filter, Calendar, Plus } from 'lucide-react';
// import { REMINDER_TYPE, REMINDER_TYPE_LABELS } from '../../utils/constants';

// const ReminderFilters = ({
//   searchTerm,
//   setSearchTerm,
//   filterType,
//   setFilterType,
//   filterStatus,
//   setFilterStatus,
//   onCreateNew
// }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         <div className="flex flex-col sm:flex-row gap-4 flex-1">
//           {/* Search */}
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Tìm kiếm theo tin nhắn, mã người dùng..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Filter by Type */}
//           <div className="relative">
//             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
//             >
//               <option value="">Tất cả loại</option>
//               {Object.entries(REMINDER_TYPE).map(([key, value]) => (
//                 <option key={key} value={value}>
//                   {REMINDER_TYPE_LABELS[value]}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Filter by Status */}
//           <div className="relative">
//             <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
//             >
//               <option value="">Tất cả trạng thái</option>
//               <option value="sent">Đã gửi</option>
//               <option value="pending">Chờ gửi</option>
//               <option value="today">Hôm nay</option>
//             </select>
//           </div>
//         </div>

//         {/* Create Button */}
//         <button
//           onClick={onCreateNew}
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Tạo nhắc nhở mới
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ReminderFilters;
import React from 'react';
import { Edit, Trash2, Bell, CheckCircle, Clock, User, MessageSquare, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { REMINDER_TYPE_LABELS, REMINDER_TYPE_COLORS } from '../../utils/constants';

const SkeletonRow = () => (
  <tr className="hover:bg-gray-50">
    {[...Array(7)].map((_, index) => (
      <td key={index} className="px-6 py-4 whitespace-nowrap">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </td>
    ))}
  </tr>
);

const Pagination = ({ pagination, onPageChange, onPageSizeChange }) => {
  const { number: currentPage, totalPages, totalElements, size } = pagination;
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(0, currentPage - 2);
      const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">
          Hiển thị <span className="font-medium">{currentPage * size + 1}</span> đến{' '}
          <span className="font-medium">
            {Math.min((currentPage + 1) * size, totalElements)}
          </span>{' '}
          trong tổng số <span className="font-medium">{totalElements}</span> kết quả
        </div>
        
        <select
          value={size}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 text-sm rounded ${
              currentPage === pageNum
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {pageNum + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ReminderTable = ({ 
  reminders, 
  onEdit, 
  onDelete,
  onViewDetail,
  searchTerm,
  filterType,
  filterStatus,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange
}) => {
  const getReminderTypeBadge = (type) => {
    const colorClass = REMINDER_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        <Bell className="w-3 h-3 mr-1" />
        {REMINDER_TYPE_LABELS[type] || type}
      </span>
    );
  };

  const getStatusBadge = (reminder) => {
    const today = new Date();
    const reminderDate = new Date(reminder.nextDate);
    const isToday = reminderDate.toDateString() === today.toDateString();
    
    if (reminder.sent) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã gửi
        </span>
      );
    }
    
    if (isToday) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Clock className="w-3 h-3 mr-1" />
          Hôm nay
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Chờ gửi
      </span>
    );
  };

  const isUpcoming = (nextDate) => {
    const today = new Date();
    const reminderDate = new Date(nextDate);
    const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Danh sách nhắc nhở ({pagination?.totalElements || 0})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại nhắc nhở
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tin nhắn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày nhắc nhở
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              [...Array(5)].map((_, index) => <SkeletonRow key={index} />)
            ) : reminders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Không tìm thấy nhắc nhở</p>
                  <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </td>
              </tr>
            ) : (
              reminders.map((reminder) => (
                <tr key={reminder.reminderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{reminder.reminderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <User className="w-3 h-3 mr-1" />
                      {reminder.userId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getReminderTypeBadge(reminder.reminderType)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="flex items-start">
                      <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate" title={reminder.message}>
                        {reminder.message}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className={`${isUpcoming(reminder.nextDate) && !reminder.sent ? 'text-purple-600 font-medium' : ''}`}>
                      {new Date(reminder.nextDate).toLocaleDateString('vi-VN')}
                      {isUpcoming(reminder.nextDate) && !reminder.sent && (
                        <div className="text-xs text-purple-500">Sắp tới</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(reminder)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetail(reminder.reminderId)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(reminder)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(reminder.reminderId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && <Pagination 
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />}
    </div>
  );
};

export default ReminderTable;
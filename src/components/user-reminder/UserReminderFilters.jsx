import React from 'react';
import { Search, Filter, Calendar, Bell, X } from 'lucide-react';
import { REMINDER_TYPE, REMINDER_TYPE_LABELS } from '../../utils/constants';

const UserReminderFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  totalCount
}) => {
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
  };

  const hasActiveFilters = searchTerm || filterType || filterStatus;

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp tới (7 ngày)';
      case 'today':
        return 'Hôm nay';
      case 'received':
        return 'Đã nhận';
      case 'pending':
        return 'Chưa nhận';
      default:
        return 'Tất cả';
    }
  };

  const getTypeLabel = (type) => {
    return REMINDER_TYPE_LABELS[type] || 'Tất cả loại';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Nhắc nhở của tôi
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {totalCount}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm trong tin nhắn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
            >
              <option value="">Tất cả loại</option>
              {Object.entries(REMINDER_TYPE).map(([key, value]) => (
                <option key={key} value={value}>
                  {REMINDER_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
            >
              <option value="">Tất cả</option>
              <option value="upcoming">Sắp tới</option>
              <option value="today">Hôm nay</option>
              <option value="received">Đã nhận</option>
              <option value="pending">Chưa nhận</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Xóa tất cả bộ lọc"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
            
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Tìm kiếm: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filterType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Loại: {getTypeLabel(filterType)}
                <button
                  onClick={() => setFilterType('')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filterStatus && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Trạng thái: {getStatusLabel(filterStatus)}
                <button
                  onClick={() => setFilterStatus('')}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReminderFilters;
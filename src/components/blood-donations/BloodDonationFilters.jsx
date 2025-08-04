import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const BloodDonationFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  showFilters, 
  onToggleFilters,
  searchTerm,
  onSearchChange,
  onSearch
}) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const volumeRanges = [
    { label: 'Tất cả', value: '' },
    { label: '250-349ml', value: '250-349' },
    { label: '350-499ml', value: '350-499' },
    { label: '500ml+', value: '500+' }
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người hiến, ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleFilters}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>
          
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm máu
              </label>
              <select
                value={filters.bloodType || ''}
                onChange={(e) => onFilterChange('bloodType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tất cả nhóm máu</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thể tích máu
              </label>
              <select
                value={filters.volumeRange || ''}
                onChange={(e) => onFilterChange('volumeRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                {volumeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.fromDate || ''}
                onChange={(e) => onFilterChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.toDate || ''}
                onChange={(e) => onFilterChange('toDate', e.target.value)}
                min={filters.fromDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Xóa bộ lọc</span>
            </button>

            {(filters.bloodType || filters.volumeRange || filters.fromDate || filters.toDate) && (
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
                
                {filters.bloodType && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Nhóm máu: {filters.bloodType}
                    <button
                      onClick={() => onFilterChange('bloodType', '')}
                      className="ml-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.volumeRange && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Thể tích: {volumeRanges.find(r => r.value === filters.volumeRange)?.label}
                    <button
                      onClick={() => onFilterChange('volumeRange', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.fromDate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Từ: {new Date(filters.fromDate).toLocaleDateString('vi-VN')}
                    <button
                      onClick={() => onFilterChange('fromDate', '')}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.toDate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Đến: {new Date(filters.toDate).toLocaleDateString('vi-VN')}
                    <button
                      onClick={() => onFilterChange('toDate', '')}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BloodDonationFilters;
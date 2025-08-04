import React, { useState, useEffect } from 'react';
import { Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import BloodDonationStats from '../../components/blood-donations/BloodDonationStats';
import BloodDonationTable from '../../components/blood-donations/BloodDonationTable';
import BloodDonationFilters from '../../components/blood-donations/BloodDonationFilters';
import BloodDonationEditModal from '../../components/blood-donations/BloodDonationEditModal';
import BloodDonationDetailsModal from '../../components/blood-donations/BloodDonationDetailsModal';
import { getAllBloodDonationInfo, deleteBloodDonationInfo } from '../../services/bloodDonationInformationService';

const BloodDonation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [filters, setFilters] = useState({
    bloodType: '',
    volumeRange: '',
    fromDate: '',
    toDate: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10
  });

  useEffect(() => {
    loadBloodDonations();
  }, [pagination.currentPage]);

  const loadBloodDonations = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      const response = await getAllBloodDonationInfo(page, pagination.pageSize);
      
      if (response.status === 200) {
        const { content, totalPages, totalItems, currentPage } = response.data.data;
        setDonations(content);
        setPagination(prev => ({
          ...prev,
          currentPage,
          totalPages,
          totalItems
        }));
      } else {
        toast.error('Không thể tải danh sách hiến máu');
      }
    } catch (error) {
      console.error('Error loading blood donations:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách hiến máu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 0 }));
    loadBloodDonations(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      bloodType: '',
      volumeRange: '',
      fromDate: '',
      toDate: ''
    });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setShowDetailsModal(true);
  };

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    loadBloodDonations();
    setShowEditModal(false);
    setSelectedDonation(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedDonation(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDonation(null);
  };

  const getFilteredDonations = () => {
    return donations.filter(donation => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!donation.userName.toLowerCase().includes(searchLower) && 
            !donation.bloodDonationInformationId.toString().includes(searchLower) &&
            !donation.userId.toString().includes(searchLower) &&
            !donation.appointmentId.toString().includes(searchLower)) {
          return false;
        }
      }

      if (filters.bloodType && donation.bloodTypeName !== filters.bloodType) {
        return false;
      }

      if (filters.volumeRange) {
        const volume = donation.actualBloodVolume;
        if (filters.volumeRange === '250-349' && (volume < 250 || volume > 349)) return false;
        if (filters.volumeRange === '350-499' && (volume < 350 || volume > 499)) return false;
        if (filters.volumeRange === '500+' && volume < 500) return false;
      }

      if (filters.fromDate) {
        const donationDate = new Date(donation.createdAt);
        const fromDate = new Date(filters.fromDate);
        fromDate.setHours(0, 0, 0, 0);
        if (donationDate < fromDate) return false;
      }

      if (filters.toDate) {
        const donationDate = new Date(donation.createdAt);
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        if (donationDate > toDate) return false;
      }

      return true;
    });
  };

  const filteredDonations = getFilteredDonations();

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý hiến máu</h1>
            <p className="text-gray-600">Theo dõi và quản lý thông tin hiến máu từ các thành viên</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Droplets className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Quản lý hiến máu hiệu quả! 🩸
              </h3>
              <p className="text-gray-600">
                Theo dõi toàn bộ thông tin hiến máu, thống kê và quản lý dữ liệu một cách khoa học.
              </p>
            </div>
          </div>
        </div>

        <BloodDonationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
        />

        <BloodDonationStats donations={filteredDonations} />

        <BloodDonationTable
          donations={filteredDonations}
          loading={loading}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">{pagination.currentPage * pagination.pageSize + 1}</span>
                  {' '}-{' '}
                  <span className="font-medium">
                    {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalItems)}
                  </span>
                  {' '}trong{' '}
                  <span className="font-medium">{pagination.totalItems}</span>
                  {' '}kết quả
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="sr-only">Trang trước</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) => {
                    const pageNumber = pagination.currentPage < 3 ? index : pagination.currentPage - 2 + index;
                    if (pageNumber >= pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors ${
                          pageNumber === pagination.currentPage
                            ? 'z-10 bg-red-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  })}
                  
                  {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 3 && (
                    <>
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                        ...
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.totalPages - 1)}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors"
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages - 1}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="sr-only">Trang sau</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {filteredDonations.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Droplets className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || Object.values(filters).some(f => f) ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu hiến máu'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc' 
                : 'Chưa có thông tin hiến máu nào được ghi nhận'
              }
            </p>
          </div>
        )}
      </div>

      <BloodDonationEditModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        donation={selectedDonation}
        onSuccess={handleEditSuccess}
      />

      <BloodDonationDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        donation={selectedDonation}
      />
    </>
  );
};

export default BloodDonation;
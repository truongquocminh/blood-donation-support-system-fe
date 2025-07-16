import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Calendar, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import DonorStats from '../../components/donors/DonorStats';
import DonorTable from '../../components/donors/DonorTable';
import DonationDetailsModal from '../../components/donors/DonationDetailsModal';
import { getBloodDonations, updateBloodDonationStatus } from '../../services/bloodDonationService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { getUserHealthChecks } from '../../services/healthCheckService';
import { getUserById } from '../../services/userService';
import { BLOOD_DONATION_STATUS, REMINDER_TYPE } from '../../utils/constants';
import { getDefaultMessage } from '../../utils/helpers';
import { createReminder } from '../../services/reminderService';

const DONATION_STATUSES = {
  PENDING: 'Chờ xác nhận',
  APPROVED: 'Đã phê duyệt',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REJECTED: 'Bị từ chối'
};

const Donors = () => {
  const [donations, setDonations] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [healthChecks, setHealthChecks] = useState({});

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadDonations();
    loadBloodTypes();
  }, [currentPage]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const response = await getBloodDonations(currentPage, pageSize);

      if (response.status === 200) {
        const donationsData = response.data.data.content;
        setDonations(donationsData);
        setTotalElements(response.data.data.page.totalElements);
        setTotalPages(response.data.data.page.totalPages);

        const userIds = [...new Set(donationsData.map(d => d.user))];
        await Promise.all([
          loadUsersData(userIds),
          loadHealthChecksForUsers(userIds)
        ]);
      } else {
        toast.error('Không thể tải danh sách hiến máu');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsersData = async (userIds) => {
    try {
      const userPromises = userIds.map(userId => getUserById(userId));
      const responses = await Promise.all(userPromises);

      const usersMap = {};
      responses.forEach((response, index) => {
        if (response.status === 200) {
          usersMap[userIds[index]] = response.data.data;
        }
      });

      setUsers(usersMap);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadBloodTypes = async () => {
    try {
      const response = await getBloodTypes(0, 100);
      if (response.status === 200) {
        setBloodTypes(response.data.data.content);
      }
    } catch (error) {
      console.error('Error loading blood types:', error);
    }
  };

  const loadHealthChecksForUsers = async (userIds) => {
    try {
      const healthCheckPromises = userIds.map(userId =>
        getUserHealthChecks(userId, 0, 100)
      );

      const responses = await Promise.all(healthCheckPromises);
      const healthCheckMap = {};

      responses.forEach((response, index) => {
        if (response.status === 200) {
          healthCheckMap[userIds[index]] = response.data.data.content;
        }
      });

      setHealthChecks(healthCheckMap);
    } catch (error) {
      console.error('Error loading health checks:', error);
    }
  };

  const handleStatusUpdate = async (userId, donationDate, donationId, newStatus) => {
    try {
      const response = await updateBloodDonationStatus(donationId, newStatus);

      if (response.status === 200) {
        setDonations(prev =>
          prev.map(donation =>
            donation.donationId === donationId
              ? { ...donation, status: newStatus }
              : donation
          )
        );

        if (BLOOD_DONATION_STATUS.APPROVED === newStatus) {
          const reminderData = {
            userId,
            nextDate: donationDate,
            reminderType: REMINDER_TYPE.BLOOD_DONATION,
            message: getDefaultMessage(REMINDER_TYPE.BLOOD_DONATION),
            sent: true
          };

          await createReminder(reminderData);
        }
        toast.success('Cập nhật trạng thái thành công');
      } else {
        toast.error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
      console.error('Error updating status:', error);
    }
  };

  const openDetailsModal = (donation) => {
    setSelectedDonation(donation);
    setShowDetailsModal(true);
  };

  const getBloodTypeName = (typeId) => {
    const type = bloodTypes.find(t => t.id === typeId);
    return type ? type.typeName : 'N/A';
  };

  const getDonationWithDetails = (donation) => {
    const userHealthChecks = healthChecks[donation.user] || [];
    const healthCheck = userHealthChecks.find(hc => hc.id === donation.healthCheckId);

    const userData = users[donation.user];
    return {
      ...donation,
      healthCheckDetails: healthCheck,
      user: userData ? {
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
      } : {
        id: donation.user,
        name: `Người hiến ${donation.user}`,
        email: `user${donation.user}@email.com`,
      }
    };
  };

  const filteredDonations = donations.filter(donation => {
    const enhancedDonation = getDonationWithDetails(donation);
    const matchesSearch = searchTerm === '' ||
      enhancedDonation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enhancedDonation.user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === '' || donation.status === filterStatus;
    const matchesBloodType = filterBloodType === '' || donation.bloodType.toString() === filterBloodType;

    return matchesSearch && matchesStatus && matchesBloodType;
  });

  const enhancedDonations = filteredDonations.map(getDonationWithDetails);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    loadDonations();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người hiến máu</h1>
          <p className="text-gray-600">Theo dõi và xử lý các đăng ký hiến máu</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(DONATION_STATUSES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm máu
              </label>
              <select
                value={filterBloodType}
                onChange={(e) => setFilterBloodType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tất cả nhóm máu</option>
                {bloodTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('');
                  setFilterBloodType('');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      <DonorStats donations={enhancedDonations} />

      <DonorTable
        donations={enhancedDonations}
        bloodTypes={bloodTypes}
        onStatusUpdate={handleStatusUpdate}
        onViewDetails={openDetailsModal}
        getBloodTypeName={getBloodTypeName}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{currentPage * pageSize + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min((currentPage + 1) * pageSize, totalElements)}
                </span> trong{' '}
                <span className="font-medium">{totalElements}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${i === currentPage
                      ? 'z-10 bg-red-50 border-red-500 text-red-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {selectedDonation && (
        <DonationDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedDonation(null);
          }}
          donation={selectedDonation}
          bloodTypes={bloodTypes}
          onStatusUpdate={handleStatusUpdate}
          getBloodTypeName={getBloodTypeName}
        />
      )}
    </div>
  );
};

export default Donors;
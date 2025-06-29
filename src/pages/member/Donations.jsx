import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Filter, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createBloodDonation, getBloodDonations } from '../../services/bloodDonationService';
import DonationStats from '../../components/donation/DonationStats';
import DonationHistory from '../../components/donation/DonationHistory';
import DonationFormModal from '../../components/donation/DonationFormModal';
import { BLOOD_TYPES, BLOOD_COMPONENTS } from '../../utils/constants';
import toast from 'react-hot-toast';
import { getBloodTypes } from '../../services/bloodTypeService';

const DONATION_STATUSES = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REJECTED: 'Bị từ chối'
};

const Donations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadDonations();
    loadBloodTypes();
  }, [currentPage, pageSize]);

  const loadBloodTypes = async () => {
    try {
      const res = await getBloodTypes();
      if (res.status === 200 && res.data.data?.content) {
        setBloodTypes(res.data.data.content);
      }
    } catch (err) {
      console.error("Lỗi khi tải blood types:", err);
      toast.error("Không thể tải nhóm máu");
    }
  };

  const loadDonations = async () => {
    try {
      setLoading(true);
      const response = await getBloodDonations(currentPage, pageSize);

      if (response.status === 200 && response.data.data) {
        const { content, page } = response.data.data;
        setDonations(content || []);
        setTotalElements(page.totalElements);
        setTotalPages(page.totalPages);
      } else {
        setDonations([]);
        setTotalElements(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error loading donations:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách hiến máu');
      setDonations([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const Pagination = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 0; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        const start = Math.max(0, currentPage - 2);
        const end = Math.min(totalPages - 1, start + maxVisiblePages - 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }

      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} trong tổng số {totalElements} kết quả
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
          >
            <option value={5}>5/trang</option>
            <option value={10}>10/trang</option>
            <option value={20}>20/trang</option>
            <option value={50}>50/trang</option>
          </select>

          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${currentPage === page
                  ? 'bg-red-500 text-white border-red-500'
                  : 'hover:bg-gray-50'
                  }`}
              >
                {page + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleAddDonation = async (donationData) => {
    try {
      const payload = {
        user: user.id,
        donationDate: donationData.donationDate,
        bloodType: donationData.bloodType,
        bloodComponent: donationData.bloodComponent,
        volumeMl: donationData.volumeMl,
        status: 'PENDING',
        healthCheck: 0
      };

      const res = await createBloodDonation(payload);
      if (res.status === 200) {
        toast.success('Đăng ký hiến máu thành công!');
        setIsModalOpen(false);
        loadDonations();
      } else {
        toast.error(res?.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi tạo hiến máu:', error);
      toast.error('Có lỗi xảy ra khi đăng ký');
    }
  };


  const handleCancelDonation = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đăng ký hiến máu này?')) {
      setDonations(prev =>
        prev.map(donation =>
          donation.id === id
            ? { ...donation, status: 'CANCELLED', notes: 'Đã hủy bởi người dùng' }
            : donation
        )
      );
      toast.success('Đã hủy đăng ký hiến máu');
    }
  };

  const filteredDonations = donations.filter(donation => {
    if (filterStatus === '') return true;
    return donation.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hiến máu</h1>
          <p className="text-gray-600">Đăng ký hiến máu và theo dõi lịch sử hiến máu của bạn</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng ký hiến máu</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Heart className="w-8 h-8 text-red-600" fill="currentColor" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Cảm ơn bạn đã tham gia hiến máu! 🩸
            </h3>
            <p className="text-gray-600">
              Mỗi lần hiến máu của bạn có thể cứu sống 3-4 người. Hãy tiếp tục lan tỏa tình yêu thương!
            </p>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo trạng thái
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
          </div>
        </div>
      )}

      <DonationStats donations={filteredDonations} />

      <DonationHistory
        donations={filteredDonations}
        bloodTypes={bloodTypes}
        onCancel={handleCancelDonation}
      />


      <Pagination />

      <DonationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDonation}
        bloodTypes={bloodTypes}
        bloodComponents={[]}
      />

    </div>
  );
};

export default Donations;
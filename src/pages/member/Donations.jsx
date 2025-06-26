import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Filter, Heart } from 'lucide-react';
import DonationStats from '../../components/donation/DonationStats';
import DonationHistory from '../../components/donation/DonationHistory';
import DonationFormModal from '../../components/donation/DonationFormModal';
import { BLOOD_TYPES, BLOOD_COMPONENTS } from '../../utils/constants';

const MOCK_DONATIONS = [
  {
    id: 1,
    user: 1,
    donationDate: '2025-07-15',
    bloodType: BLOOD_TYPES.O_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.WHOLE_BLOOD,
    volumeMl: 450,
    status: 'COMPLETED',
    healthCheck: 1,
    location: 'Bệnh viện Chợ Rẫy',
    notes: 'Hiến máu thành công, sức khỏe tốt'
  },
  {
    id: 2,
    user: 1,
    donationDate: '2025-08-01',
    bloodType: BLOOD_TYPES.O_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.RED_BLOOD_CELLS,
    volumeMl: 300,
    status: 'PENDING',
    healthCheck: null,
    location: 'Trung tâm Huyết học TP.HCM',
    notes: 'Đã đăng ký, chờ xác nhận'
  },
  {
    id: 3,
    user: 1,
    donationDate: '2025-06-20',
    bloodType: BLOOD_TYPES.O_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.PLATELETS,
    volumeMl: 250,
    status: 'CANCELLED',
    healthCheck: null,
    location: 'Bệnh viện Đại học Y Dược',
    notes: 'Hủy do sức khỏe không đảm bảo'
  }
];

const MOCK_BLOOD_TYPES = [
  { bloodTypeId: BLOOD_TYPES.O_NEGATIVE, typeName: 'O-' },
  { bloodTypeId: BLOOD_TYPES.O_POSITIVE, typeName: 'O+' },
  { bloodTypeId: BLOOD_TYPES.A_NEGATIVE, typeName: 'A-' },
  { bloodTypeId: BLOOD_TYPES.A_POSITIVE, typeName: 'A+' },
  { bloodTypeId: BLOOD_TYPES.B_NEGATIVE, typeName: 'B-' },
  { bloodTypeId: BLOOD_TYPES.B_POSITIVE, typeName: 'B+' },
  { bloodTypeId: BLOOD_TYPES.AB_NEGATIVE, typeName: 'AB-' },
  { bloodTypeId: BLOOD_TYPES.AB_POSITIVE, typeName: 'AB+' },
];

const MOCK_BLOOD_COMPONENTS = [
  { componentId: BLOOD_COMPONENTS.WHOLE_BLOOD, componentName: 'Máu toàn phần' },
  { componentId: BLOOD_COMPONENTS.RED_BLOOD_CELLS, componentName: 'Hồng cầu' },
  { componentId: BLOOD_COMPONENTS.PLATELETS, componentName: 'Tiểu cầu' },
  { componentId: BLOOD_COMPONENTS.PLASMA, componentName: 'Huyết tương' },
  { componentId: BLOOD_COMPONENTS.WHITE_BLOOD_CELLS, componentName: 'Bạch cầu' },
];

const DONATION_STATUSES = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REJECTED: 'Bị từ chối'
};

const Donations = () => {
  const [donations, setDonations] = useState(MOCK_DONATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleAddDonation = (donationData) => {
    const newDonation = {
      id: Math.max(...donations.map(d => d.id)) + 1,
      user: currentUser.id || 1,
      ...donationData,
      status: 'PENDING',
      healthCheck: null,
      notes: 'Đăng ký hiến máu mới'
    };
    setDonations(prev => [newDonation, ...prev]);
    setIsModalOpen(false);
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
    }
  };

  const filteredDonations = donations.filter(donation => {
    if (filterStatus === '') return true;
    return donation.status === filterStatus;
  });

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
        bloodTypes={MOCK_BLOOD_TYPES}
        bloodComponents={MOCK_BLOOD_COMPONENTS}
        onCancel={handleCancelDonation}
      />

      <DonationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDonation}
        bloodTypes={MOCK_BLOOD_TYPES}
        bloodComponents={MOCK_BLOOD_COMPONENTS}
      />
    </div>
  );
};

export default Donations;
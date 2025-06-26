import React, { useState } from 'react';
import { Search, Filter, Users, Calendar, FileText } from 'lucide-react';
import DonorStats from '../../components/donors/DonorStats';
import DonorTable from '../../components/donors/DonorTable';
import DonationDetailsModal from '../../components/donors/DonationDetailsModal';
import HealthCheckModal from '../../components/donors/HealthCheckModal';
import { BLOOD_TYPES, BLOOD_COMPONENTS } from '../../utils/constants';

const MOCK_DONATIONS = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@email.com',
      phone: '0901234567',
      bloodType: BLOOD_TYPES.O_POSITIVE,
      age: 28,
      weight: 65
    },
    donationDate: '2025-07-15',
    bloodType: BLOOD_TYPES.O_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.WHOLE_BLOOD,
    volumeMl: 450,
    status: 'PENDING',
    healthCheck: null,
    location: 'Bệnh viện Chợ Rẫy',
    notes: 'Đăng ký hiến máu định kỳ',
    registeredAt: '2025-06-20T10:30:00Z'
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Trần Thị Bình',
      email: 'tranthibibh@email.com',
      phone: '0912345678',
      bloodType: BLOOD_TYPES.A_POSITIVE,
      age: 32,
      weight: 55
    },
    donationDate: '2025-07-20',
    bloodType: BLOOD_TYPES.A_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.RED_BLOOD_CELLS,
    volumeMl: 300,
    status: 'CONFIRMED',
    healthCheck: {
      id: 1,
      bloodPressure: '120/80',
      heartRate: 72,
      hemoglobin: 13.5,
      weight: 55,
      temperature: 36.5,
      approved: true,
      notes: 'Sức khỏe tốt, đủ điều kiện hiến máu'
    },
    location: 'Trung tâm Huyết học TP.HCM',
    notes: 'Lần hiến máu thứ 3',
    registeredAt: '2025-06-15T14:20:00Z'
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'Lê Văn Cường',
      email: 'levancuong@email.com',
      phone: '0923456789',
      bloodType: BLOOD_TYPES.B_NEGATIVE,
      age: 25,
      weight: 70
    },
    donationDate: '2025-07-10',
    bloodType: BLOOD_TYPES.B_NEGATIVE,
    bloodComponent: BLOOD_COMPONENTS.PLASMA,
    volumeMl: 200,
    status: 'COMPLETED',
    healthCheck: {
      id: 2,
      bloodPressure: '115/75',
      heartRate: 68,
      hemoglobin: 14.2,
      weight: 70,
      temperature: 36.3,
      approved: true,
      notes: 'Hiến máu thành công, không có biến chứng'
    },
    location: 'Bệnh viện Đại học Y Dược',
    notes: 'Hiến plasma lần đầu',
    registeredAt: '2025-06-10T09:15:00Z',
    completedAt: '2025-07-10T15:30:00Z'
  },
  {
    id: 4,
    user: {
      id: 4,
      name: 'Phạm Thị Dung',
      email: 'phamthidung@email.com',
      phone: '0934567890',
      bloodType: BLOOD_TYPES.AB_POSITIVE,
      age: 29,
      weight: 48
    },
    donationDate: '2025-07-25',
    bloodType: BLOOD_TYPES.AB_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.PLATELETS,
    volumeMl: 250,
    status: 'REJECTED',
    healthCheck: {
      id: 3,
      bloodPressure: '110/70',
      heartRate: 75,
      hemoglobin: 11.8,
      weight: 48,
      temperature: 36.7,
      approved: false,
      notes: 'Hemoglobin thấp, cân nặng không đủ tiêu chuẩn'
    },
    location: 'Bệnh viện Nhân dân 115',
    notes: 'Muốn hiến tiểu cầu',
    registeredAt: '2025-06-25T16:45:00Z'
  },
  {
    id: 5,
    user: {
      id: 5,
      name: 'Hoàng Văn Em',
      email: 'hoangvanem@email.com',
      phone: '0945678901',
      bloodType: BLOOD_TYPES.O_NEGATIVE,
      age: 35,
      weight: 80
    },
    donationDate: '2025-08-01',
    bloodType: BLOOD_TYPES.O_NEGATIVE,
    bloodComponent: BLOOD_COMPONENTS.WHOLE_BLOOD,
    volumeMl: 450,
    status: 'CONFIRMED',
    healthCheck: {
      id: 4,
      bloodPressure: '125/85',
      heartRate: 70,
      hemoglobin: 15.1,
      weight: 80,
      temperature: 36.4,
      approved: true,
      notes: 'Người hiến máu thường xuyên, sức khỏe tốt'
    },
    location: 'Trung tâm Huyết học TP.HCM',
    notes: 'Donor O- quý hiếm',
    registeredAt: '2025-06-18T11:00:00Z'
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

const Donors = () => {
  const [donations, setDonations] = useState(MOCK_DONATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHealthCheckModal, setShowHealthCheckModal] = useState(false);

  const handleStatusUpdate = (donationId, newStatus) => {
    setDonations(prev => 
      prev.map(donation => 
        donation.id === donationId 
          ? { 
              ...donation, 
              status: newStatus,
              ...(newStatus === 'COMPLETED' && { completedAt: new Date().toISOString() })
            }
          : donation
      )
    );
  };

  const handleHealthCheck = (donationId, healthCheckData) => {
    setDonations(prev => 
      prev.map(donation => 
        donation.id === donationId 
          ? { 
              ...donation, 
              healthCheck: healthCheckData,
              status: healthCheckData.approved ? 'CONFIRMED' : 'REJECTED'
            }
          : donation
      )
    );
    setShowHealthCheckModal(false);
    setSelectedDonation(null);
  };

  const openDetailsModal = (donation) => {
    setSelectedDonation(donation);
    setShowDetailsModal(true);
  };

  const openHealthCheckModal = (donation) => {
    setSelectedDonation(donation);
    setShowHealthCheckModal(true);
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = searchTerm === '' || 
      donation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.user.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === '' || donation.status === filterStatus;
    const matchesBloodType = filterBloodType === '' || donation.bloodType.toString() === filterBloodType;
    const matchesLocation = filterLocation === '' || donation.location.includes(filterLocation);
    
    return matchesSearch && matchesStatus && matchesBloodType && matchesLocation;
  });

  const locations = [...new Set(donations.map(d => d.location))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người hiến máu</h1>
          <p className="text-gray-600">Theo dõi và xử lý các đăng ký hiến máu</p>
        </div>
        
        <div className="flex items-center space-x-3">
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
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                {MOCK_BLOOD_TYPES.map(type => (
                  <option key={type.bloodTypeId} value={type.bloodTypeId}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tất cả địa điểm</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('');
                  setFilterBloodType('');
                  setFilterLocation('');
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

      <DonorStats donations={filteredDonations} />

      <DonorTable
        donations={filteredDonations}
        bloodTypes={MOCK_BLOOD_TYPES}
        bloodComponents={MOCK_BLOOD_COMPONENTS}
        onStatusUpdate={handleStatusUpdate}
        onViewDetails={openDetailsModal}
        onHealthCheck={openHealthCheckModal}
      />

      {selectedDonation && (
        <>
          <DonationDetailsModal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedDonation(null);
            }}
            donation={selectedDonation}
            bloodTypes={MOCK_BLOOD_TYPES}
            bloodComponents={MOCK_BLOOD_COMPONENTS}
            onStatusUpdate={handleStatusUpdate}
          />

          <HealthCheckModal
            isOpen={showHealthCheckModal}
            onClose={() => {
              setShowHealthCheckModal(false);
              setSelectedDonation(null);
            }}
            donation={selectedDonation}
            onSubmit={(healthCheckData) => handleHealthCheck(selectedDonation.id, healthCheckData)}
          />
        </>
      )}
    </div>
  );
};

export default Donors;
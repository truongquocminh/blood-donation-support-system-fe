import React, { useState } from 'react';
import { Search, Filter, Calendar, Users } from 'lucide-react';
import StaffAppointmentStats from '../../components/staff-appointments/StaffAppointmentStats';
import StaffAppointmentTable from '../../components/staff-appointments/StaffAppointmentTable';
import AppointmentDetailsModal from '../../components/staff-appointments/AppointmentDetailsModal';
import HealthCheckFormModal from '../../components/staff-appointments/HealthCheckFormModal';
import { BLOOD_TYPES, BLOOD_COMPONENTS, APPOINTMENT_STATUS } from '../../utils/constants';

const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  SCHEDULED: 'Đã lên lịch',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
};

const MOCK_APPOINTMENTS = [
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
    appointmentDate: '2025-07-15T09:00:00Z',
    bloodType: BLOOD_TYPES.O_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.WHOLE_BLOOD,
    volumeMl: 450,
    status: APPOINTMENT_STATUS.SCHEDULED,
    location: 'Bệnh viện Chợ Rẫy',
    notes: 'Lịch hẹn hiến máu định kỳ',
    createdAt: '2025-06-20T10:30:00Z',
    healthCheck: null
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
    appointmentDate: '2025-07-20T14:00:00Z',
    bloodType: BLOOD_TYPES.A_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.RED_BLOOD_CELLS,
    volumeMl: 300,
    status: APPOINTMENT_STATUS.PENDING,
    location: 'Trung tâm Huyết học TP.HCM',
    notes: 'Lần hiến máu thứ 3',
    createdAt: '2025-06-15T14:20:00Z',
    healthCheck: null
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
    appointmentDate: '2025-06-20T10:00:00Z',
    bloodType: BLOOD_TYPES.B_NEGATIVE,
    bloodComponent: BLOOD_COMPONENTS.PLASMA,
    volumeMl: 200,
    status: APPOINTMENT_STATUS.COMPLETED,
    location: 'Bệnh viện Đại học Y Dược',
    notes: 'Hiến plasma thành công',
    createdAt: '2025-06-10T09:15:00Z',
    completedAt: '2025-06-20T11:30:00Z',
    healthCheck: {
      id: 1,
      pulse: 68,
      bloodPressure: '115/75',
      resultSummary: 'Hiến máu thành công, không có biến chứng',
      isEligible: true,
      ineligibleReason: null,
      bloodTypeId: BLOOD_TYPES.B_NEGATIVE,
      checkedAt: '2025-06-20T09:45:00Z',
      staffId: 1,
      staffName: 'Bs. Trần Thị B'
    }
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
    appointmentDate: '2025-07-25T11:00:00Z',
    bloodType: BLOOD_TYPES.AB_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.PLATELETS,
    volumeMl: 250,
    status: APPOINTMENT_STATUS.CANCELLED,
    location: 'Bệnh viện Nhân dân 115',
    notes: 'Hủy do sức khỏe không đảm bảo',
    createdAt: '2025-06-25T16:45:00Z',
    cancelledAt: '2025-07-24T16:00:00Z',
    healthCheck: {
      id: 2,
      pulse: 95,
      bloodPressure: '140/90',
      resultSummary: 'Huyết áp cao, không đủ điều kiện hiến máu',
      isEligible: false,
      ineligibleReason: 'Huyết áp vượt quá giới hạn cho phép (140/90)',
      bloodTypeId: BLOOD_TYPES.AB_POSITIVE,
      checkedAt: '2025-07-24T15:30:00Z',
      staffId: 2,
      staffName: 'Bs. Lê Văn C'
    }
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
    appointmentDate: '2025-08-01T08:30:00Z',
    bloodType: BLOOD_TYPES.O_NEGATIVE,
    bloodComponent: BLOOD_COMPONENTS.WHOLE_BLOOD,
    volumeMl: 450,
    status: APPOINTMENT_STATUS.PENDING,
    location: 'Trung tâm Huyết học TP.HCM',
    notes: 'Donor O- quý hiếm',
    createdAt: '2025-06-18T11:00:00Z',
    healthCheck: null
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

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHealthCheckModal, setShowHealthCheckModal] = useState(false);

  const handleStatusUpdate = (appointmentId, newStatus) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { 
              ...appointment, 
              status: newStatus,
              ...(newStatus === APPOINTMENT_STATUS.COMPLETED && { completedAt: new Date().toISOString() }),
              ...(newStatus === APPOINTMENT_STATUS.CANCELLED && { cancelledAt: new Date().toISOString() })
            }
          : appointment
      )
    );
  };

  const handleHealthCheck = (appointmentId, healthCheckData) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newHealthCheck = {
      id: Date.now(),
      ...healthCheckData,
      checkedAt: new Date().toISOString(),
      staffId: currentUser.id || 1,
      staffName: currentUser.name || 'Nhân viên Y tế'
    };

    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { 
              ...appointment, 
              healthCheck: newHealthCheck,
              status: healthCheckData.isEligible ? APPOINTMENT_STATUS.SCHEDULED : APPOINTMENT_STATUS.CANCELLED
            }
          : appointment
      )
    );
    
    setShowHealthCheckModal(false);
    setSelectedAppointment(null);
  };

  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const openHealthCheckModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowHealthCheckModal(true);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === '' || 
      appointment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.user.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === '' || appointment.status === filterStatus;
    const matchesLocation = filterLocation === '' || appointment.location.includes(filterLocation);
    
    let matchesDate = true;
    if (filterDate) {
      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      matchesDate = appointmentDate === filterDate;
    }
    
    return matchesSearch && matchesStatus && matchesLocation && matchesDate;
  });

  const locations = [...new Set(appointments.map(a => a.location))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
          <p className="text-gray-600">Theo dõi và xử lý các lịch hẹn hiến máu</p>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(STATUS_LABELS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả địa điểm</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày hẹn
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('');
                  setFilterLocation('');
                  setFilterDate('');
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

      <StaffAppointmentStats appointments={filteredAppointments} />

      <StaffAppointmentTable
        appointments={filteredAppointments}
        bloodTypes={MOCK_BLOOD_TYPES}
        bloodComponents={MOCK_BLOOD_COMPONENTS}
        onStatusUpdate={handleStatusUpdate}
        onViewDetails={openDetailsModal}
        onHealthCheck={openHealthCheckModal}
      />

      {selectedAppointment && (
        <>
          <AppointmentDetailsModal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
            bloodTypes={MOCK_BLOOD_TYPES}
            bloodComponents={MOCK_BLOOD_COMPONENTS}
            onStatusUpdate={handleStatusUpdate}
          />

          <HealthCheckFormModal
            isOpen={showHealthCheckModal}
            onClose={() => {
              setShowHealthCheckModal(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
            bloodTypes={MOCK_BLOOD_TYPES}
            onSubmit={(healthCheckData) => handleHealthCheck(selectedAppointment.id, healthCheckData)}
          />
        </>
      )}
    </div>
  );
};

export default StaffAppointments;
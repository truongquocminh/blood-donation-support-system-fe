import React, { useState } from 'react';
import { Plus, Calendar, Filter, Clock } from 'lucide-react';
import AppointmentStats from '../../components/appointments/AppointmentStats';
import AppointmentHistory from '../../components/appointments/AppointmentHistory';
import AppointmentFormModal from '../../components/appointments/AppointmentFormModal';
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
    userId: 1,
    appointmentDate: '2025-07-15T09:00:00Z',
    bloodType: BLOOD_TYPES.O_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.WHOLE_BLOOD,
    volumeMl: 450,
    status: APPOINTMENT_STATUS.SCHEDULED,
    location: 'Bệnh viện Chợ Rẫy',
    notes: 'Lịch hẹn hiến máu định kỳ',
    createdAt: '2025-06-20T10:30:00Z',
    healthCheck: {
      id: 1,
      pulse: 72,
      bloodPressure: '120/80',
      resultSummary: 'Sức khỏe tốt, đủ điều kiện hiến máu',
      isEligible: true,
      ineligibleReason: null,
      bloodTypeId: BLOOD_TYPES.O_POSITIVE,
      checkedAt: '2025-07-14T14:30:00Z',
      staffName: 'Bs. Nguyễn Văn A'
    }
  },
  {
    id: 2,
    userId: 1,
    appointmentDate: '2025-08-01T14:00:00Z',
    bloodType: BLOOD_TYPES.O_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.RED_BLOOD_CELLS,
    volumeMl: 300,
    status: APPOINTMENT_STATUS.PENDING,
    location: 'Trung tâm Huyết học TP.HCM',
    notes: 'Đăng ký hiến hồng cầu',
    createdAt: '2025-06-25T16:45:00Z',
    healthCheck: null
  },
  {
    id: 3,
    userId: 1,
    appointmentDate: '2025-06-20T10:00:00Z',
    bloodType: BLOOD_TYPES.O_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.WHOLE_BLOOD,
    volumeMl: 450,
    status: APPOINTMENT_STATUS.COMPLETED,
    location: 'Bệnh viện Đại học Y Dược',
    notes: 'Hiến máu thành công',
    createdAt: '2025-06-01T09:15:00Z',
    completedAt: '2025-06-20T11:30:00Z',
    healthCheck: {
      id: 2,
      pulse: 68,
      bloodPressure: '115/75',
      resultSummary: 'Hiến máu thành công, không có biến chứng',
      isEligible: true,
      ineligibleReason: null,
      bloodTypeId: BLOOD_TYPES.O_POSITIVE,
      checkedAt: '2025-06-20T09:45:00Z',
      staffName: 'Bs. Trần Thị B'
    }
  },
  {
    id: 4,
    userId: 1,
    appointmentDate: '2025-07-25T11:00:00Z',
    bloodType: BLOOD_TYPES.O_POSITIVE,
    bloodComponent: BLOOD_COMPONENTS.PLATELETS,
    volumeMl: 250,
    status: APPOINTMENT_STATUS.CANCELLED,
    location: 'Bệnh viện Nhân dân 115',
    notes: 'Hủy do sức khỏe không đảm bảo',
    createdAt: '2025-06-18T11:00:00Z',
    cancelledAt: '2025-07-24T16:00:00Z',
    healthCheck: {
      id: 3,
      pulse: 95,
      bloodPressure: '140/90',
      resultSummary: 'Huyết áp cao, không đủ điều kiện hiến máu',
      isEligible: false,
      ineligibleReason: 'Huyết áp vượt quá giới hạn cho phép (140/90)',
      bloodTypeId: BLOOD_TYPES.O_POSITIVE,
      checkedAt: '2025-07-24T15:30:00Z',
      staffName: 'Bs. Lê Văn C'
    }
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

const Appointments = () => {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleAddAppointment = (appointmentData) => {
    const newAppointment = {
      id: Math.max(...appointments.map(a => a.id)) + 1,
      userId: currentUser.id || 1,
      ...appointmentData,
      status: APPOINTMENT_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      healthCheck: null
    };
    setAppointments(prev => [newAppointment, ...prev]);
    setIsModalOpen(false);
  };

  const handleCancelAppointment = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { 
                ...appointment, 
                status: APPOINTMENT_STATUS.CANCELLED,
                cancelledAt: new Date().toISOString(),
                notes: appointment.notes + ' - Đã hủy bởi người dùng'
              }
            : appointment
        )
      );
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === '') return true;
    return appointment.status === filterStatus;
  });

  const lastCompletedAppointment = appointments
    .filter(a => a.status === APPOINTMENT_STATUS.COMPLETED)
    .sort((a, b) => new Date(b.completedAt || b.appointmentDate) - new Date(a.completedAt || a.appointmentDate))[0];

  const canCreateAppointment = () => {
    if (!lastCompletedAppointment) return true;
    
    const lastDate = new Date(lastCompletedAppointment.completedAt || lastCompletedAppointment.appointmentDate);
    const twelveWeeksLater = new Date(lastDate.getTime() + (12 * 7 * 24 * 60 * 60 * 1000));
    return new Date() >= twelveWeeksLater;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn hiến máu</h1>
          <p className="text-gray-600">Đặt lịch và theo dõi các cuộc hẹn hiến máu của bạn</p>
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
            // disabled={!canCreateAppointment()}
            disabled={canCreateAppointment()}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Đặt lịch hẹn</span>
          </button>
        </div>
      </div>

      {!canCreateAppointment() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Chưa thể đặt lịch hẹn mới
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Bạn cần chờ ít nhất 12 tuần kể từ lần hiến máu cuối cùng ({new Date(lastCompletedAppointment.completedAt || lastCompletedAppointment.appointmentDate).toLocaleDateString('vi-VN')}) 
                trước khi có thể đặt lịch hẹn mới.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Lên lịch hiến máu dễ dàng! 📅
            </h3>
            <p className="text-gray-600">
              Chọn thời gian phù hợp để hiến máu. Chúng tôi sẽ nhắc nhở và hỗ trợ bạn trong suốt quá trình.
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
                {Object.entries(STATUS_LABELS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2 flex items-end">
              <button
                onClick={() => setFilterStatus('')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      <AppointmentStats appointments={filteredAppointments} />

      <AppointmentHistory
        appointments={filteredAppointments}
        bloodTypes={MOCK_BLOOD_TYPES}
        bloodComponents={MOCK_BLOOD_COMPONENTS}
        onCancel={handleCancelAppointment}
      />

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAppointment}
        bloodTypes={MOCK_BLOOD_TYPES}
        bloodComponents={MOCK_BLOOD_COMPONENTS}
      />
    </div>
  );
};

export default Appointments;
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import StaffAppointmentStats from '../../components/staff-appointments/StaffAppointmentStats';
import StaffAppointmentTable from '../../components/staff-appointments/StaffAppointmentTable';
import AppointmentDetailsModal from '../../components/staff-appointments/AppointmentDetailsModal';
import HealthCheckFormModal from '../../components/staff-appointments/HealthCheckFormModal';
import { filterAppointments, updateAppointmentStatus } from '../../services/appointmentService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { createHealthCheck } from '../../services/healthCheckService';
import { APPOINTMENT_STATUS, REMINDER_TYPE } from '../../utils/constants';
import { getDefaultMessage } from '../../utils/helpers';
import { createReminder } from '../../services/reminderService';

const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  SCHEDULED: 'Đã lên lịch',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
};

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHealthCheckModal, setShowHealthCheckModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadAppointments();
    loadBloodTypes();
  }, [currentPage, filterStatus, filterDate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const filters = {
        page: currentPage,
        size: pageSize,
        status: filterStatus || undefined,
        from: filterDate || undefined,
        to: filterDate || undefined,
      };

      const response = await filterAppointments(filters);
      const { content, page } = response.data.data;

      setAppointments(content);
      setTotalPages(page.totalPages);
      setTotalElements(page.totalElements);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const loadBloodTypes = async () => {
    try {
      const response = await getBloodTypes();
      setBloodTypes(response.data.data.content);
    } catch (error) {
      console.error('Error loading blood types:', error);
      toast.error('Không thể tải danh sách nhóm máu');
    }
  };

  const handleStatusUpdate = async (userId, appointmentDate, appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);

      setAppointments(prev =>
        prev.map(appointment =>
          appointment.appointmentId === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      if (APPOINTMENT_STATUS.SCHEDULED === newStatus) {
        const reminderData = {
          userId,
          nextDate: appointmentDate,
          reminderType: REMINDER_TYPE.APPOINTMENT,
          message: getDefaultMessage(REMINDER_TYPE.APPOINTMENT),
          sent: true
        };

        await createReminder(reminderData);

      }

      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleHealthCheck = async (appointmentId, healthCheckData) => {
    try {
      const payload = {
        appointmentId,
        ...healthCheckData
      };

      await createHealthCheck(payload);

      await updateAppointmentStatus(appointmentId, APPOINTMENT_STATUS.COMPLETED);

      await loadAppointments();

      setShowHealthCheckModal(false);
      setSelectedAppointment(null);

      toast.success('Kiểm tra sức khỏe đã được lưu thành công');
    } catch (error) {
      console.error('Error creating health check:', error);
      toast.error('Không thể lưu thông tin kiểm tra sức khỏe');
    }
  };

  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const openHealthCheckModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowHealthCheckModal(true);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    loadAppointments();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      appointment.appointmentId.toString().includes(searchLower) ||
      appointment.userId.toString().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
          <p className="text-gray-600">Xem và xử lý các lịch hẹn hiến máu từ thành viên</p>
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <UserCheck className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Quy trình xử lý lịch hẹn:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Thành viên đặt lịch hẹn với ngày/giờ → Trạng thái <strong>PENDING</strong></li>
              <li>Staff xác nhận → <strong>SCHEDULED</strong> hoặc từ chối → <strong>CANCELLED</strong></li>
              <li>Staff thực hiện kiểm tra sức khỏe và cập nhật thông tin</li>
              <li>Sau khi kiểm tra, trạng thái tự động chuyển thành <strong>COMPLETED</strong></li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID lịch hẹn hoặc ID người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tìm kiếm
        </button>
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
                  setFilterDate('');
                  setSearchTerm('');
                  setCurrentPage(0);
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
        loading={loading}
        onStatusUpdate={handleStatusUpdate}
        onViewDetails={openDetailsModal}
        onHealthCheck={openHealthCheckModal}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Hiển thị {currentPage * pageSize + 1} đến {Math.min((currentPage + 1) * pageSize, totalElements)} trong tổng số {totalElements} kết quả
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              const pageNumber = currentPage < 3 ? index : currentPage - 2 + index;
              if (pageNumber >= totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 text-sm border rounded ${currentPage === pageNumber
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {pageNumber + 1}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {selectedAppointment && (
        <>
          <AppointmentDetailsModal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
          />

          <HealthCheckFormModal
            isOpen={showHealthCheckModal}
            onClose={() => {
              setShowHealthCheckModal(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
            bloodTypes={bloodTypes}
            onSubmit={(healthCheckData) => handleHealthCheck(selectedAppointment.appointmentId, healthCheckData)}
          />
        </>
      )}
    </div>
  );
};

export default StaffAppointments;
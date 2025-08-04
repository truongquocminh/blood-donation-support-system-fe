import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Filter, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AppointmentStats from '../../components/appointments/AppointmentStats';
import AppointmentHistory from '../../components/appointments/AppointmentHistory';
import AppointmentFormModal from '../../components/appointments/AppointmentFormModal';
import AppointmentDetailsModal from '../../components/staff-appointments/AppointmentDetailsModal'; 
import ConfirmModal from '../../components/common/ConfirmModal';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { 
  getUserAppointments, 
  deleteAppointment,
  getAppointmentById
} from '../../services/appointmentService';

const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  SCHEDULED: 'Đã lên lịch',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
};

const Appointments = () => {
  const { user } = useAuth();
  const [allAppointments, setAllAppointments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    from: '',
    to: ''
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    appointmentId: null,
    title: '',
    message: ''
  });

  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    appointment: null
  });
  const [loadingAppointmentDetails, setLoadingAppointmentDetails] = useState(false);

  const fetchAppointments = async (page = 0) => {
    try {
      setLoading(true);
      const response = await getUserAppointments(user.id, page, pagination.size);
            
      if (response.status === 200) {
        setAllAppointments(response.data.data.content);
        setPagination({
          page: response.data.data.page.number,
          size: response.data.data.page.size,
          totalElements: response.data.data.page.totalElements,
          totalPages: response.data.data.page.totalPages
        });
      } else {
        toast.error('Không thể tải danh sách lịch hẹn');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id]);

  const handleAppointmentSuccess = () => {
    setIsModalOpen(false);
    fetchAppointments(pagination.page);
  };

  const handleCancelAppointment = (id) => {
    setConfirmModal({
      isOpen: true,
      appointmentId: id,
      title: 'Xác nhận hủy lịch hẹn',
      message: 'Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.'
    });
  };

  const confirmCancelAppointment = async () => {
    try {
      const response = await deleteAppointment(confirmModal.appointmentId);
      
      if (response.status === 200) {
        toast.success('Hủy lịch hẹn thành công');
        fetchAppointments(pagination.page); 
      } else {
        toast.error(response.message || 'Không thể hủy lịch hẹn');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Có lỗi xảy ra khi hủy lịch hẹn');
    } finally {
      setConfirmModal({ isOpen: false, appointmentId: null, title: '', message: '' });
    }
  };

  const handleViewDetails = async (appointmentId) => {
    try {
      setLoadingAppointmentDetails(true);
      
      const response = await getAppointmentById(appointmentId);
      
      if (response.status === 200) {
        setDetailsModal({
          isOpen: true,
          appointment: response.data.data
        });
      } else {
        toast.error('Không thể tải chi tiết lịch hẹn');
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      toast.error('Có lỗi xảy ra khi tải chi tiết lịch hẹn');
    } finally {
      setLoadingAppointmentDetails(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setDetailsModal({
      isOpen: false,
      appointment: null
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', from: '', to: '' });
  };

  const getFilteredAppointments = () => {
    return allAppointments.filter(appointment => {
      if (filters.status && appointment.status !== filters.status) {
        return false;
      }

      const appointmentDate = new Date(appointment.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0); 

      if (filters.from) {
        const fromDate = new Date(filters.from);
        fromDate.setHours(0, 0, 0, 0);
        if (appointmentDate < fromDate) {
          return false;
        }
      }

      if (filters.to) {
        const toDate = new Date(filters.to);
        toDate.setHours(23, 59, 59, 999); 
        if (appointmentDate > toDate) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredAppointments = getFilteredAppointments();

  const lastCompletedAppointment = allAppointments
    .filter(a => a.status === APPOINTMENT_STATUS.COMPLETED)
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0];

  const canCreateAppointment = () => {
    if (!lastCompletedAppointment) return true;
    
    const lastDate = new Date(lastCompletedAppointment.appointmentDate);
    const twelveWeeksLater = new Date(lastDate.getTime() + (12 * 7 * 24 * 60 * 60 * 1000));
    return new Date() >= twelveWeeksLater;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchAppointments(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

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
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Đặt lịch hẹn</span>
          </button>
        </div>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => handleFilterChange('from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => handleFilterChange('to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                min={filters.from}
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                title="Xóa bộ lọc"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {(filters.status || filters.from || filters.to) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
                
                {filters.status && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Trạng thái: {STATUS_LABELS[filters.status]}
                    <button
                      onClick={() => handleFilterChange('status', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.from && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Từ: {new Date(filters.from).toLocaleDateString('vi-VN')}
                    <button
                      onClick={() => handleFilterChange('from', '')}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.to && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Đến: {new Date(filters.to).toLocaleDateString('vi-VN')}
                    <button
                      onClick={() => handleFilterChange('to', '')}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <span className="text-xs text-gray-500">
                  ({filteredAppointments.length} kết quả)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <AppointmentStats appointments={filteredAppointments} />

      <AppointmentHistory
        appointments={filteredAppointments}
        onCancel={handleCancelAppointment}
        onViewDetails={handleViewDetails}
        loadingDetails={loadingAppointmentDetails}
      />

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{' '}
                <span className="font-medium">{pagination.page * pagination.size + 1}</span>
                {' '}-{' '}
                <span className="font-medium">
                  {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}
                </span>
                {' '}trong{' '}
                <span className="font-medium">{pagination.totalElements}</span>
                {' '}kết quả
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 0}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      i === pagination.page
                        ? 'z-10 bg-red-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAppointmentSuccess}
      />

      {/* Modal chi tiết lịch hẹn */}
      <AppointmentDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={handleCloseDetailsModal}
        appointment={detailsModal.appointment}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmCancelAppointment}
        onCancel={() => setConfirmModal({ isOpen: false, appointmentId: null, title: '', message: '' })}
        confirmText="Hủy lịch hẹn"
        cancelText="Không hủy"
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
      />
    </div>
  );
};

export default Appointments;
import React, { useState, useEffect } from 'react';
import ReminderStats from '../../components/reminder/ReminderStats';
import ReminderFilters from '../../components/reminder/ReminderFilters';
import ReminderTable from '../../components/reminder/ReminderTable';
import ReminderForm from '../../components/reminder/ReminderForm';
import ReminderDetailModal from '../../components/reminder/ReminderDetailModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import HandleLoading from '../../components/common/HandleLoading';
import { getReminders, createReminder, updateReminder, deleteReminder, getReminderById } from '../../services/reminderService';
import { REMINDER_TYPE } from '../../utils/constants';
import toast from 'react-hot-toast';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    number: 0,
    size: 10,
    totalPages: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [detailReminder, setDetailReminder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReminderId, setSelectedReminderId] = useState(null);
  const [isDeletingReminder, setIsDeletingReminder] = useState(false);

  const fetchReminders = async (page = 0, size = 10, resetData = false) => {
    try {
      if (resetData) {
        setTableLoading(true);
      } else {
        setLoading(true);
      }

      const filters = {
        page,
        size,
        ...(filterType && { reminderType: filterType }),
        ...(filterStatus === 'sent' && { sent: true }),
        ...(filterStatus === 'pending' && { sent: false }),
      };

      const response = await getReminders(filters);
      if (response.status === 200 && response.data) {
        const originalData = response.data.data.content || [];
        const reversedData = [...originalData].reverse();

        setReminders(reversedData);
        setPagination(response.data.data.page || {
          totalElements: 0,
          number: 0,
          size: 10,
          totalPages: 0
        });
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setReminders([]);
      setPagination({
        totalElements: 0,
        number: 0,
        size: 10,
        totalPages: 0
      });
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders(0, 10, true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchReminders(0, pagination.size, true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filterType, filterStatus]);

  useEffect(() => {
  }, [searchTerm]);

  const handleCreateNew = () => {
    setEditingReminder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  };

  const handleViewDetail = async (reminderId) => {
    try {
      setLoading(true);
      const response = await getReminderById(reminderId);

      if (response.status === 200 && response.data) {
        setDetailReminder(response.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching reminder detail:', error);
      toast.error('Không thể tải chi tiết nhắc nhở');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (reminder) => {
    setSelectedReminderId(reminder);
    setShowConfirmModal(true);
  };

  const confirmDeleteReminder = async () => {
    if (!selectedReminderId) return;

    try {
      setIsDeletingReminder(true);
      const response = await deleteReminder(selectedReminderId);

      if (response.status === 200) {
        await fetchReminders(pagination.number, pagination.size, true);
        toast.success('Xóa nhắc nhở thành công');
      } else {
        toast.error('Không thể xóa nhắc nhở. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Có lỗi xảy ra khi xóa nhắc nhở');
    } finally {
      setIsDeletingReminder(false);
      setShowConfirmModal(false);
      setSelectedReminderId(null);
    }
  };

  const cancelDeleteModal = () => {
    setShowConfirmModal(false);
    setSelectedReminderId(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      let response;

      if (editingReminder) {
        response = await updateReminder(editingReminder.reminderId, formData);
      } else {
        response = await createReminder(formData);
      }

      if (response.status === 200 || response.status === 201) {
        await fetchReminders(pagination.number, pagination.size, true);
        setIsFormOpen(false);
        setEditingReminder(null);
        toast.success(`${editingReminder ? 'Cập nhật thành công' : 'Tạo nhắc nhở thành công'}`)
      } else {
        toast.error(`${editingReminder ? 'Cập nhật thất bại' : 'Tạo nhắc nhở thất bại'}`);
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error('Có lỗi xảy ra khi lưu nhắc nhở');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingReminder(null);
  };

  const handlePageChange = (newPage) => {
    fetchReminders(newPage, pagination.size, true);
  };

  const handlePageSizeChange = (newSize) => {
    fetchReminders(0, newSize, true);
  };

  const filteredReminders = reminders.filter(reminder => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      reminder.message.toLowerCase().includes(searchLower) ||
      reminder.userId.toString().includes(searchLower) ||
      reminder.reminderId.toString().includes(searchLower)
    );
  });

  return (
    <>
      {loading && <HandleLoading />}

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý nhắc nhở</h1>
            <p className="text-gray-600">
              Quản lý và theo dõi các nhắc nhở cho người dùng về hiến máu, cuộc hẹn và kiểm tra sức khỏe
            </p>
          </div>
        </div>

        <ReminderStats reminders={filteredReminders} />

        <ReminderFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onCreateNew={handleCreateNew}
        />

        <ReminderTable
          reminders={filteredReminders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
          searchTerm={searchTerm}
          filterType={filterType}
          filterStatus={filterStatus}
          loading={tableLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

        <ReminderForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          editingReminder={editingReminder}
        />

        <ReminderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          reminder={detailReminder}
        />

        <ConfirmModal
          isOpen={showConfirmModal}
          title="Xác nhận xóa nhắc nhở"
          message={`Bạn có chắc chắn muốn xóa nhắc nhở này? Hành động này không thể hoàn tác.`}
          onConfirm={confirmDeleteReminder}
          onCancel={cancelDeleteModal}
          confirmText={isDeletingReminder ? "Đang xóa..." : "Xóa nhắc nhở"}
          cancelText="Hủy"
          confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
          type="danger"
        />
      </div>
    </>
  );
};

export default Reminders;
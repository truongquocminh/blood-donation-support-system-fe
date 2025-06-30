import React, { useState, useEffect } from 'react';
import ReminderStats from '../../components/reminder/ReminderStats';
import ReminderFilters from '../../components/reminder/ReminderFilters';
import ReminderTable from '../../components/reminder/ReminderTable';
import ReminderForm from '../../components/reminder/ReminderForm';
import ReminderDetailModal from '../../components/reminder/ReminderDetailModal';
import HandleLoading from '../../components/common/HandleLoading';
import { getReminders, createReminder, updateReminder, deleteReminder, getReminderById } from '../../services/reminderService';
import { REMINDER_TYPE } from '../../utils/constants';

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

      if (response.success && response.data) {
        setReminders(response.data.content || []);
        setPagination(response.data.page || {
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

      if (response.success && response.data) {
        setDetailReminder(response.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching reminder detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reminderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhắc nhở này?')) {
      try {
        setLoading(true);
        const response = await deleteReminder(reminderId);

        if (response.success) {
          await fetchReminders(pagination.number, pagination.size, true);
        }
      } catch (error) {
        console.error('Error deleting reminder:', error);
      } finally {
        setLoading(false);
      }
    }
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

      if (response.success) {
        await fetchReminders(pagination.number, pagination.size, true);
        setIsFormOpen(false);
        setEditingReminder(null);
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
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
      </div>
    </>
  );
};

export default Reminders;
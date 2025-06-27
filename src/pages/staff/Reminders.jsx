import React, { useState, useEffect } from 'react';
import ReminderStats from '../../components/reminder/ReminderStats';
import ReminderFilters from '../../components/reminder/ReminderFilters';
import ReminderTable from '../../components/reminder/ReminderTable';
import ReminderForm from '../../components/reminder/ReminderForm';
import { REMINDER_TYPE } from '../../utils/constants';

const Reminders = () => {
  const [reminders, setReminders] = useState([
    {
      reminderId: 1,
      userId: 101,
      nextDate: '2025-06-26',
      reminderType: REMINDER_TYPE.BLOOD_DONATION,
      message: 'Đã đến lúc hiến máu định kỳ. Hãy đặt lịch hẹn sớm nhất có thể.',
      sent: false
    },
    {
      reminderId: 2,
      userId: 102,
      nextDate: '2025-06-27',
      reminderType: REMINDER_TYPE.APPOINTMENT,
      message: 'Nhắc nhở cuộc hẹn khám sức khỏe vào ngày mai lúc 9:00 AM.',
      sent: true
    },
    {
      reminderId: 3,
      userId: 103,
      nextDate: '2025-06-28',
      reminderType: REMINDER_TYPE.HEALTH_CHECK,
      message: 'Thời gian kiểm tra sức khỏe định kỳ đã đến. Vui lòng liên hệ để đặt lịch.',
      sent: false
    },
    {
      reminderId: 4,
      userId: 104,
      nextDate: '2025-06-25',
      reminderType: REMINDER_TYPE.BLOOD_DONATION,
      message: 'Cảm ơn bạn đã tham gia hiến máu. Lần hiến máu tiếp theo có thể sau 3 tháng.',
      sent: true
    },
    {
      reminderId: 5,
      userId: 105,
      nextDate: '2025-06-29',
      reminderType: REMINDER_TYPE.HEALTH_CHECK,
      message: 'Kiểm tra sức khỏe sau hiến máu để đảm bảo tình trạng sức khỏe tốt.',
      sent: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  const handleCreateNew = () => {
    setEditingReminder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  };

  const handleDelete = (reminderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhắc nhở này?')) {
      setReminders(prev => prev.filter(r => r.reminderId !== reminderId));
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingReminder) {
      setReminders(prev => prev.map(r =>
        r.reminderId === editingReminder.reminderId
          ? { ...formData, reminderId: editingReminder.reminderId }
          : r
      ));
    } else {
      const newReminder = {
        ...formData,
        reminderId: Math.max(...reminders.map(r => r.reminderId), 0) + 1
      };
      setReminders(prev => [...prev, newReminder]);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingReminder(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nhắc nhở
          </h1>
          <p className="text-gray-600">Quản lý và theo dõi các nhắc nhở cho người dùng về hiến máu, cuộc hẹn và kiểm tra sức khỏe
          </p>
        </div>
      </div>

      <ReminderStats reminders={reminders} />

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
        reminders={reminders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        filterType={filterType}
        filterStatus={filterStatus}
      />

      <ReminderForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingReminder={editingReminder}
      />
    </div>
  );
};

export default Reminders;


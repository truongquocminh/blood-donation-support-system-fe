import React, { useState, useEffect } from 'react';
import UserReminderStats from '../../components/user-reminder/UserReminderStats';
import UserReminderFilters from '../../components/user-reminder/UserReminderFilters';
import UserReminderCard from '../../components/user-reminder/UserReminderCard';
import { Bell, Calendar, Heart } from 'lucide-react';
import { REMINDER_TYPE } from '../../utils/constants';

const Reminders = ({ userId = 101 }) => {
  const [reminders, setReminders] = useState([
    {
      reminderId: 1,
      userId: 101,
      nextDate: '2025-06-27',
      reminderType: REMINDER_TYPE.BLOOD_DONATION,
      message: 'Đã đến lúc hiến máu định kỳ! Bạn đã đủ điều kiện để hiến máu lần tiếp theo. Hãy đặt lịch hẹn sớm nhất có thể để giúp đỡ những người cần máu.',
      sent: false
    },
    {
      reminderId: 2,
      userId: 101,
      nextDate: '2025-06-28',
      reminderType: REMINDER_TYPE.APPOINTMENT,
      message: 'Nhắc nhở cuộc hẹn khám sức khỏe định kỳ vào ngày 28/06/2025 lúc 9:00 AM tại phòng khám chính. Vui lòng chuẩn bị đầy đủ giấy tờ.',
      sent: false
    },
    {
      reminderId: 3,
      userId: 101,
      nextDate: '2025-06-25',
      reminderType: REMINDER_TYPE.HEALTH_CHECK,
      message: 'Kết quả kiểm tra sức khỏe sau lần hiến máu gần nhất đã có. Mọi chỉ số đều bình thường. Cảm ơn bạn đã tham gia hiến máu!',
      sent: true
    },
    {
      reminderId: 4,
      userId: 101,
      nextDate: '2025-07-01',
      reminderType: REMINDER_TYPE.BLOOD_DONATION,
      message: 'Lịch hiến máu tình nguyện tháng 7 đã mở đăng ký. Bạn có thể đăng ký tham gia để cùng chung tay cứu người.',
      sent: false
    },
    {
      reminderId: 5,
      userId: 101,
      nextDate: '2025-06-30',
      reminderType: REMINDER_TYPE.HEALTH_CHECK,
      message: 'Thời gian kiểm tra sức khỏe định kỳ 6 tháng đã đến. Vui lòng liên hệ để đặt lịch kiểm tra tổng quát.',
      sent: false
    },
    {
      reminderId: 6,
      userId: 101,
      nextDate: '2025-06-20',
      reminderType: REMINDER_TYPE.APPOINTMENT,
      message: 'Cảm ơn bạn đã tham gia cuộc hẹn tư vấn sức khỏe. Hẹn gặp lại bạn trong lần kiểm tra tiếp theo.',
      sent: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const userReminders = reminders.filter(reminder => reminder.userId === userId);

  const filteredReminders = userReminders.filter(reminder => {
    const matchesSearch = searchTerm === '' ||
      reminder.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === '' || reminder.reminderType === filterType;

    let matchesStatus = true;
    if (filterStatus === 'upcoming') {
      const today = new Date();
      const reminderDate = new Date(reminder.nextDate);
      const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
      matchesStatus = diffDays <= 7 && diffDays >= 0 && !reminder.sent;
    } else if (filterStatus === 'today') {
      const today = new Date();
      const reminderDate = new Date(reminder.nextDate);
      matchesStatus = reminderDate.toDateString() === today.toDateString();
    } else if (filterStatus === 'received') {
      matchesStatus = reminder.sent;
    } else if (filterStatus === 'pending') {
      matchesStatus = !reminder.sent;
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    const today = new Date();
    const dateA = new Date(a.nextDate);
    const dateB = new Date(b.nextDate);

    if (a.sent !== b.sent) {
      return a.sent ? 1 : -1;
    }

    return dateA - dateB;
  });

  return (
    <div className=" space-y-6">
    
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Nhắc nhở của tôi
          </h1>
          <p className="text-gray-600">
            Theo dõi các thông báo và lời nhắc quan trọng từ trung tâm y tế
          </p>
        </div>
      </div>

      <UserReminderStats reminders={userReminders} />

      <UserReminderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        totalCount={filteredReminders.length}
      />

      <div className="space-y-4">
        {sortedReminders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có nhắc nhở nào
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterType || filterStatus
                ? 'Thử thay đổi bộ lọc để xem thêm nhắc nhở'
                : 'Hiện tại bạn chưa có nhắc nhở nào từ trung tâm y tế'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedReminders.map((reminder) => (
              <UserReminderCard
                key={reminder.reminderId}
                reminder={reminder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
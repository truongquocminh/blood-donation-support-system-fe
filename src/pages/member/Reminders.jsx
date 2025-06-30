import React, { useState, useEffect } from 'react';
import UserReminderStats from '../../components/user-reminder/UserReminderStats';
import UserReminderFilters from '../../components/user-reminder/UserReminderFilters';
import UserReminderCard from '../../components/user-reminder/UserReminderCard';
import UserReminderDetailModal from '../../components/user-reminder/UserReminderDetailModal';
import HandleLoading from '../../components/common/HandleLoading';
import { Bell } from 'lucide-react';
import { getReminders, getReminderById } from '../../services/reminderService';

const UserReminderCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-24 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
      </div>

      <div className="flex items-center mb-3">
        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </div>

      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    number: 0,
    size: 20,
    totalPages: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [detailReminder, setDetailReminder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchUserReminders = async (page = 0, size = 20, resetData = false) => {
    try {
      if (resetData) {
        setCardsLoading(true);
      } else {
        setLoading(true);
      }

      const response = await getReminders(page, size);

      if (response.success && response.data) {
        setReminders(response.data.content || []);
        setPagination(response.data.page || {
          totalElements: 0,
          number: 0,
          size: 20,
          totalPages: 0
        });
      }
    } catch (error) {
      console.error('Error fetching user reminders:', error);
      setReminders([]);
      setPagination({
        totalElements: 0,
        number: 0,
        size: 20,
        totalPages: 0
      });
    } finally {
      setLoading(false);
      setCardsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReminders(0, 20, true);
  }, []);

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

  const loadMoreReminders = async () => {
    if (pagination.number + 1 < pagination.totalPages) {
      await fetchUserReminders(pagination.number + 1, pagination.size, false);
    }
  };

  const filteredReminders = reminders.filter(reminder => {
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
    <>
      {loading && <HandleLoading />}

      <div className="space-y-6">
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

        <UserReminderStats reminders={reminders} />

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
          {cardsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <UserReminderCardSkeleton key={index} />
              ))}
            </div>
          ) : sortedReminders.length === 0 ? (
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
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedReminders.map((reminder) => (
                  <UserReminderCard
                    key={reminder.reminderId}
                    reminder={reminder}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>

              {pagination.number + 1 < pagination.totalPages && !cardsLoading && (
                <div className="flex justify-center pt-6">
                  <button
                    onClick={loadMoreReminders}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Xem thêm nhắc nhở
                  </button>
                </div>
              )}

              <div className="text-center text-sm text-gray-500 pt-4">
                Hiển thị {sortedReminders.length} trong tổng số {pagination.totalElements} nhắc nhở
              </div>
            </>
          )}
        </div>

        <UserReminderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          reminder={detailReminder}
        />
      </div>
    </>
  );
};

export default Reminders;
import React from 'react';
import { X, Bell, User, Calendar, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { REMINDER_TYPE_LABELS, REMINDER_TYPE_COLORS } from '../../utils/constants';

const ReminderDetailModal = ({ isOpen, onClose, reminder }) => {
  if (!isOpen || !reminder) return null;

  const getReminderTypeBadge = (type) => {
    const colorClass = REMINDER_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
        <Bell className="w-4 h-4 mr-2" />
        {REMINDER_TYPE_LABELS[type] || type}
      </span>
    );
  };

  const getStatusInfo = (reminder) => {
    const today = new Date();
    const reminderDate = new Date(reminder.nextDate);
    const isToday = reminderDate.toDateString() === today.toDateString();
    const isPast = reminderDate < today;
    const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
    
    if (reminder.sent) {
      return {
        badge: (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            Đã gửi
          </span>
        ),
        description: 'Nhắc nhở này đã được gửi thành công.'
      };
    }
    
    if (isToday) {
      return {
        badge: (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <Clock className="w-4 h-4 mr-2" />
            Hôm nay
          </span>
        ),
        description: 'Nhắc nhở này cần được gửi hôm nay.'
      };
    }
    
    if (isPast) {
      return {
        badge: (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <Clock className="w-4 h-4 mr-2" />
            Quá hạn
          </span>
        ),
        description: `Nhắc nhở này đã quá hạn ${Math.abs(diffDays)} ngày.`
      };
    }
    
    return {
      badge: (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-2" />
          Chờ gửi
        </span>
      ),
      description: `Nhắc nhở này sẽ được gửi trong ${diffDays} ngày.`
    };
  };

  const statusInfo = getStatusInfo(reminder);

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chi tiết nhắc nhở #{reminder.reminderId}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Mã người dùng
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">#{reminder.userId}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Ngày nhắc nhở
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(reminder.nextDate).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bell className="w-4 h-4 inline mr-2" />
                  Loại nhắc nhở
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {getReminderTypeBadge(reminder.reminderType)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {statusInfo.badge}
                  <p className="text-xs text-gray-600 mt-2">{statusInfo.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Nội dung tin nhắn
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-900 leading-relaxed">{reminder.message}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">
                Ngày tạo
              </p>
              <p className="text-sm text-blue-900">
                {reminder.createdAt ? 
                  new Date(reminder.createdAt).toLocaleDateString('vi-VN') : 
                  'Không có thông tin'
                }
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">
                Cập nhật lần cuối
              </p>
              <p className="text-sm text-blue-900">
                {reminder.updatedAt ? 
                  new Date(reminder.updatedAt).toLocaleDateString('vi-VN') : 
                  'Không có thông tin'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderDetailModal;
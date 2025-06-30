import React from 'react';
import { Calendar, Clock, CheckCircle, Bell, Droplets, Heart, MessageSquare, Eye } from 'lucide-react';
import { REMINDER_TYPE, REMINDER_TYPE_LABELS, REMINDER_TYPE_COLORS } from '../../utils/constants';

const UserReminderCard = ({ reminder, onViewDetail }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case REMINDER_TYPE.BLOOD_DONATION:
        return <Droplets className="w-5 h-5" />;
      case REMINDER_TYPE.APPOINTMENT:
        return <Calendar className="w-5 h-5" />;
      case REMINDER_TYPE.HEALTH_CHECK:
        return <Heart className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getStatusInfo = () => {
    const today = new Date();
    const reminderDate = new Date(reminder.nextDate);
    const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
    
    if (reminder.sent) {
      return {
        text: 'Đã nhận',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: <CheckCircle className="w-4 h-4" />
      };
    }
    
    if (diffDays === 0) {
      return {
        text: 'Hôm nay',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    if (diffDays === 1) {
      return {
        text: 'Ngày mai',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    if (diffDays > 1) {
      return {
        text: `Còn ${diffDays} ngày`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    return {
      text: 'Đã quá hạn',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: <Clock className="w-4 h-4" />
    };
  };

  const isUpcoming = () => {
    const today = new Date();
    const reminderDate = new Date(reminder.nextDate);
    const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const truncateMessage = (message, maxLength = 120) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const statusInfo = getStatusInfo();
  const typeColor = REMINDER_TYPE_COLORS[reminder.reminderType] || 'bg-gray-100 text-gray-800';

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md cursor-pointer group ${
      isUpcoming() && !reminder.sent ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${typeColor.replace('text', 'bg').replace('800', '100')}`}>
              {getTypeIcon(reminder.reminderType)}
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                {REMINDER_TYPE_LABELS[reminder.reminderType]}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.text}</span>
            </div>
            
            {onViewDetail && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(reminder.reminderId);
                }}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Xem chi tiết"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {new Date(reminder.nextDate).toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        <div className="flex items-start space-x-2">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-gray-700 text-sm leading-relaxed">
              {truncateMessage(reminder.message)}
            </p>
            {reminder.message.length > 120 && onViewDetail && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(reminder.reminderId);
                }}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium mt-1 transition-colors"
              >
                Xem thêm →
              </button>
            )}
          </div>
        </div>

        {isUpcoming() && !reminder.sent && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-xs font-medium">
              💡 Nhắc nhở quan trọng sắp tới. Vui lòng ghi nhớ!
            </p>
          </div>
        )}

        {statusInfo.text === 'Hôm nay' && !reminder.sent && (
          <div className="mt-4 flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-purple-700 text-xs font-medium">
              ⏰ Nhắc nhở cho hôm nay
            </p>
            {onViewDetail && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(reminder.reminderId);
                }}
                className="text-purple-600 hover:text-purple-700 text-xs font-medium transition-colors"
              >
                Chi tiết
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReminderCard;
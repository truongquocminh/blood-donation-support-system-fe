import React from 'react';
import { X, Bell, Calendar, MessageSquare, CheckCircle, Clock, Droplets, Heart, AlertTriangle } from 'lucide-react';
import { REMINDER_TYPE, REMINDER_TYPE_LABELS, REMINDER_TYPE_COLORS } from '../../utils/constants';

const UserReminderDetailModal = ({ isOpen, onClose, reminder }) => {
  if (!isOpen || !reminder) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case REMINDER_TYPE.BLOOD_DONATION:
        return <Droplets className="w-6 h-6" />;
      case REMINDER_TYPE.APPOINTMENT:
        return <Calendar className="w-6 h-6" />;
      case REMINDER_TYPE.HEALTH_CHECK:
        return <Heart className="w-6 h-6" />;
      default:
        return <Bell className="w-6 h-6" />;
    }
  };

  const getReminderTypeBadge = (type) => {
    const colorClass = REMINDER_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${colorClass}`}>
        {getTypeIcon(type)}
        <span className="ml-2">{REMINDER_TYPE_LABELS[type] || type}</span>
      </span>
    );
  };

  const getDetailedStatusInfo = (reminder) => {
    const today = new Date();
    const reminderDate = new Date(reminder.nextDate);
    const isToday = reminderDate.toDateString() === today.toDateString();
    const isPast = reminderDate < today;
    const diffDays = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
    
    if (reminder.sent) {
      return {
        badge: (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-5 h-5 mr-2" />
            Đã nhận
          </span>
        ),
        description: 'Bạn đã nhận và xem nhắc nhở này.',
        actionText: 'Cảm ơn bạn đã xem qua thông tin này.',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }
    
    if (isToday) {
      return {
        badge: (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Hôm nay
          </span>
        ),
        description: 'Đây là nhắc nhở quan trọng cho hôm nay.',
        actionText: 'Vui lòng thực hiện theo hướng dẫn trong tin nhắn.',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };
    }
    
    if (isPast) {
      return {
        badge: (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <Clock className="w-5 h-5 mr-2" />
            Đã quá hạn
          </span>
        ),
        description: `Nhắc nhở này đã quá hạn ${Math.abs(diffDays)} ngày.`,
        actionText: 'Nếu cần thiết, vui lòng liên hệ với trung tâm y tế.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }

    if (diffDays === 1) {
      return {
        badge: (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            <Clock className="w-5 h-5 mr-2" />
            Ngày mai
          </span>
        ),
        description: 'Nhắc nhở này sẽ có hiệu lực vào ngày mai.',
        actionText: 'Hãy chuẩn bị sẵn sàng cho ngày mai.',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    }
    
    return {
      badge: (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <Clock className="w-5 h-5 mr-2" />
          Còn {diffDays} ngày
        </span>
      ),
      description: `Nhắc nhở này sẽ có hiệu lực trong ${diffDays} ngày.`,
      actionText: 'Bạn có thể ghi nhớ và chuẩn bị trước.',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    };
  };

  const statusInfo = getDetailedStatusInfo(reminder);

  const getActionSuggestion = (reminderType) => {
    switch (reminderType) {
      case REMINDER_TYPE.BLOOD_DONATION:
        return {
          title: 'Hướng dẫn hiến máu',
          suggestions: [
            'Đảm bảo ăn uống đầy đủ trước khi hiến máu',
            'Mang theo giấy tờ tùy thân và sổ hiến máu (nếu có)',
            'Nghỉ ngơi đầy đủ trước ngày hiến máu',
            'Uống nhiều nước và tránh rượu bia'
          ]
        };
      case REMINDER_TYPE.APPOINTMENT:
        return {
          title: 'Chuẩn bị cho cuộc hẹn',
          suggestions: [
            'Chuẩn bị đầy đủ giấy tờ cần thiết',
            'Đến đúng giờ hẹn',
            'Ghi chú các câu hỏi muốn trao đổi với bác sĩ',
            'Mang theo kết quả xét nghiệm cũ (nếu có)'
          ]
        };
      case REMINDER_TYPE.HEALTH_CHECK:
        return {
          title: 'Chuẩn bị kiểm tra sức khỏe',
          suggestions: [
            'Nhịn ăn 8-12 tiếng trước khi xét nghiệm máu (nếu cần)',
            'Mang theo danh sách thuốc đang sử dụng',
            'Chuẩn bị tinh thần thoải mái',
            'Liên hệ trung tâm để xác nhận lịch hẹn'
          ]
        };
      default:
        return {
          title: 'Lưu ý chung',
          suggestions: [
            'Đọc kỹ nội dung nhắc nhở',
            'Liên hệ trung tâm nếu có thắc mắc',
            'Thực hiện theo hướng dẫn'
          ]
        };
    }
  };

  const actionInfo = getActionSuggestion(reminder.reminderType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chi tiết nhắc nhở
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header with type and status */}
          <div className="flex items-center justify-between">
            {getReminderTypeBadge(reminder.reminderType)}
            {statusInfo.badge}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ngày nhắc nhở
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-lg font-medium text-gray-900">
                {new Date(reminder.nextDate).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(reminder.nextDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Nội dung nhắc nhở
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <p className="text-gray-900 leading-relaxed">{reminder.message}</p>
            </div>
          </div>

          {/* Status Info */}
          <div className={`p-4 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
            <h4 className="font-medium text-gray-900 mb-2">Trạng thái</h4>
            <p className="text-gray-700 text-sm mb-2">{statusInfo.description}</p>
            <p className="text-gray-600 text-sm italic">{statusInfo.actionText}</p>
          </div>

          {/* Action Suggestions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              {actionInfo.title}
            </h4>
            <ul className="space-y-2">
              {actionInfo.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start text-sm text-blue-800">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Thông tin liên hệ</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700 mb-1">Hotline hỗ trợ</p>
                <p className="text-blue-600">1900 xxxx</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Email</p>
                <p className="text-blue-600">support@bloodcenter.vn</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về nhắc nhở này.
            </p>
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

export default UserReminderDetailModal;
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, MessageSquare, Bell, Save } from 'lucide-react';
import { REMINDER_TYPE, REMINDER_TYPE_LABELS } from '../../utils/constants';

const ReminderForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingReminder = null 
}) => {
  const [formData, setFormData] = useState({
    userId: '',
    nextDate: '',
    reminderType: REMINDER_TYPE.BLOOD_DONATION,
    message: '',
    sent: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingReminder) {
      setFormData({
        ...editingReminder,
        nextDate: new Date(editingReminder.nextDate).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        userId: '',
        nextDate: '',
        reminderType: REMINDER_TYPE.BLOOD_DONATION,
        message: '',
        sent: false
      });
    }
    setErrors({});
  }, [editingReminder, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userId) {
      newErrors.userId = 'Vui lòng nhập mã người dùng';
    } else if (isNaN(formData.userId) || parseInt(formData.userId) <= 0) {
      newErrors.userId = 'Mã người dùng phải là số dương';
    }
    
    if (!formData.nextDate) {
      newErrors.nextDate = 'Vui lòng chọn ngày nhắc nhở';
    } else {
      const selectedDate = new Date(formData.nextDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.nextDate = 'Ngày nhắc nhở không thể là ngày trong quá khứ';
      }
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập tin nhắn';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Tin nhắn phải có ít nhất 10 ký tự';
    } else if (formData.message.trim().length > 500) {
      newErrors.message = 'Tin nhắn không được vượt quá 500 ký tự';
    }

    if (!formData.reminderType) {
      newErrors.reminderType = 'Vui lòng chọn loại nhắc nhở';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        userId: parseInt(formData.userId),
        nextDate: formData.nextDate,
        message: formData.message.trim()
      };

      if (!editingReminder) {
        delete submissionData.reminderId;
      }

      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getDefaultMessage = (reminderType) => {
    const messages = {
      [REMINDER_TYPE.BLOOD_DONATION]: 'Đã đến lúc hiến máu định kỳ. Hãy đặt lịch hẹn sớm nhất có thể để tiếp tục hành trình cứu người.',
      [REMINDER_TYPE.APPOINTMENT]: 'Nhắc nhở cuộc hẹn khám sức khỏe. Vui lòng đến đúng giờ và mang theo các giấy tờ cần thiết.',
      [REMINDER_TYPE.HEALTH_CHECK]: 'Thời gian kiểm tra sức khỏe định kỳ đã đến. Vui lòng liên hệ để đặt lịch khám.'
    };
    return messages[reminderType] || '';
  };

  const handleTypeChange = (newType) => {
    handleChange('reminderType', newType);
    
    const currentMessage = formData.message.trim();
    const isDefaultMessage = Object.values(REMINDER_TYPE).some(type => 
      currentMessage === getDefaultMessage(type)
    );
    
    if (!currentMessage || isDefaultMessage) {
      handleChange('message', getDefaultMessage(newType));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingReminder ? 'Chỉnh sửa nhắc nhở' : 'Tạo nhắc nhở mới'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Mã người dùng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.userId}
              onChange={(e) => handleChange('userId', e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:opacity-50 ${
                errors.userId ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập mã người dùng"
              min="1"
            />
            {errors.userId && (
              <p className="text-red-500 text-xs mt-1">{errors.userId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bell className="w-4 h-4 inline mr-2" />
              Loại nhắc nhở <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.reminderType}
              onChange={(e) => handleTypeChange(e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:opacity-50 ${
                errors.reminderType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {Object.entries(REMINDER_TYPE).map(([key, value]) => (
                <option key={key} value={value}>
                  {REMINDER_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
            {errors.reminderType && (
              <p className="text-red-500 text-xs mt-1">{errors.reminderType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ngày nhắc nhở <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.nextDate}
              onChange={(e) => handleChange('nextDate', e.target.value)}
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:opacity-50 ${
                errors.nextDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.nextDate && (
              <p className="text-red-500 text-xs mt-1">{errors.nextDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Tin nhắn <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              disabled={isSubmitting}
              rows={4}
              maxLength={500}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:opacity-50 ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập nội dung tin nhắn nhắc nhở..."
            />
            <div className="flex justify-between items-center mt-1">
              {errors.message && (
                <p className="text-red-500 text-xs">{errors.message}</p>
              )}
              <p className={`text-xs ml-auto ${
                formData.message.length > 450 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {formData.message.length}/500
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sent"
              checked={formData.sent}
              onChange={(e) => handleChange('sent', e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <label htmlFor="sent" className="ml-2 text-sm text-gray-700">
              Đánh dấu là đã gửi
            </label>
          </div>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {editingReminder ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingReminder ? 'Cập nhật' : 'Tạo mới'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderForm;
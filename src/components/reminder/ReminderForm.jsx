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
    }
    
    if (!formData.nextDate) {
      newErrors.nextDate = 'Vui lòng chọn ngày nhắc nhở';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập tin nhắn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      userId: parseInt(formData.userId),
      nextDate: formData.nextDate
    };

    if (editingReminder) {
      submissionData.reminderId = editingReminder.reminderId;
    }

    onSubmit(submissionData);
    onClose();
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
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Mã người dùng
            </label>
            <input
              type="number"
              value={formData.userId}
              onChange={(e) => handleChange('userId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.userId ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập mã người dùng"
            />
            {errors.userId && (
              <p className="text-red-500 text-xs mt-1">{errors.userId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bell className="w-4 h-4 inline mr-2" />
              Loại nhắc nhở
            </label>
            <select
              value={formData.reminderType}
              onChange={(e) => handleChange('reminderType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(REMINDER_TYPE).map(([key, value]) => (
                <option key={key} value={value}>
                  {REMINDER_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ngày nhắc nhở
            </label>
            <input
              type="date"
              value={formData.nextDate}
              onChange={(e) => handleChange('nextDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
              Tin nhắn
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập nội dung tin nhắn nhắc nhở..."
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sent"
              checked={formData.sent}
              onChange={(e) => handleChange('sent', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingReminder ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderForm;
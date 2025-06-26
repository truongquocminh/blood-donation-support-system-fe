import React, { useState } from 'react';
import { X, Calendar, Info, Clock } from 'lucide-react';

const AppointmentFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Vui lòng chọn ngày hẹn';
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Ngày hẹn không thể trong quá khứ';
      }
      
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      if (selectedDate > threeMonthsLater) {
        newErrors.appointmentDate = 'Chỉ có thể đặt lịch trong vòng 3 tháng tới';
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Vui lòng chọn giờ hẹn';
    } else {
      const [hours] = formData.appointmentTime.split(':').map(Number);
      if (hours < 8 || hours >= 17) {
        newErrors.appointmentTime = 'Giờ hẹn phải trong khung 8:00 - 17:00';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}:00`);

    onSubmit({
      appointmentDate: appointmentDateTime.toISOString(),
      notes: formData.notes.trim() || 'Đặt lịch hẹn hiến máu'
    });

    setFormData({
      appointmentDate: '',
      appointmentTime: '',
      notes: ''
    });
    setErrors({});
  };

  if (!isOpen) return null;

  const timeSlots = [];
  for (let hour = 8; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Đặt lịch hẹn</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <div className="space-y-0.5">
                  <div>• Giờ làm việc: 8:00 - 17:00 (T2-CN)</div>
                  <div>• Nhân viên y tế sẽ tư vấn khi bạn đến</div>
                  <div>• Vui lòng đến đúng giờ hẹn</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày hẹn <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
                {errors.appointmentDate && <p className="text-xs text-red-500 mt-1">{errors.appointmentDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ hẹn <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.appointmentTime}
                  onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.appointmentTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn giờ</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.appointmentTime && <p className="text-xs text-red-500 mt-1">{errors.appointmentTime}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Ví dụ: Có tiền sử dị ứng thuốc ABC..."
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-green-700">
                  <h4 className="font-medium mb-1">Quy trình khi đến:</h4>
                  <div className="space-y-0.5">
                    <div>1. Đăng ký và xác nhận thông tin</div>
                    <div>2. Tư vấn với nhân viên y tế</div>
                    <div>3. Kiểm tra sức khỏe</div>
                    <div>4. Hiến máu (nếu đủ điều kiện)</div>
                    <div>5. Nghỉ ngơi và nhận chứng nhận</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Đặt lịch hẹn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFormModal;

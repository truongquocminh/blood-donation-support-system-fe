import React, { useState } from 'react';
import { X, Heart, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { isCompatible } from '../../utils/helpers';

const DonationFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  bloodTypes, 
  bloodComponents 
}) => {
  const [formData, setFormData] = useState({
    donationDate: '',
    bloodType: '',
    bloodComponent: '',
    volumeMl: '',
    location: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [compatibilityCheck, setCompatibilityCheck] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Check compatibility when blood type or component changes
    if (field === 'bloodType' || field === 'bloodComponent') {
      const newFormData = { ...formData, [field]: value };
      if (newFormData.bloodType && newFormData.bloodComponent) {
        const compatible = isCompatible(
          parseInt(newFormData.bloodType),
          parseInt(newFormData.bloodType),
          parseInt(newFormData.bloodComponent)
        );
        setCompatibilityCheck(compatible);
      } else {
        setCompatibilityCheck(null);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const selectedDate = new Date(formData.donationDate);

    if (!formData.donationDate) {
      newErrors.donationDate = 'Vui lòng chọn ngày hiến máu';
    } else if (selectedDate <= today) {
      newErrors.donationDate = 'Ngày hiến máu phải sau ngày hôm nay';
    }

    if (!formData.bloodType) {
      newErrors.bloodType = 'Vui lòng chọn nhóm máu';
    }

    if (!formData.bloodComponent) {
      newErrors.bloodComponent = 'Vui lòng chọn thành phần máu';
    }

    if (!formData.volumeMl || parseInt(formData.volumeMl) <= 0) {
      newErrors.volumeMl = 'Thể tích phải lớn hơn 0';
    } else {
      const volume = parseInt(formData.volumeMl);
      if (volume < 50) {
        newErrors.volumeMl = 'Thể tích tối thiểu là 50ml';
      } else if (volume > 500) {
        newErrors.volumeMl = 'Thể tích tối đa là 500ml';
      }
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Vui lòng nhập địa điểm hiến máu';
    }

    if (compatibilityCheck === false) {
      newErrors.compatibility = 'Nhóm máu và thành phần máu không tương thích';
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

    onSubmit({
      ...formData,
      bloodType: parseInt(formData.bloodType),
      bloodComponent: parseInt(formData.bloodComponent),
      volumeMl: parseInt(formData.volumeMl),
      location: formData.location.trim(),
      notes: formData.notes.trim() || 'Đăng ký hiến máu mới'
    });

    // Reset form
    setFormData({
      donationDate: '',
      bloodType: '',
      bloodComponent: '',
      volumeMl: '',
      location: '',
      notes: ''
    });
    setErrors({});
    setCompatibilityCheck(null);
  };

  if (!isOpen) return null;

  const getRecommendedVolume = (componentId) => {
    switch (parseInt(componentId)) {
      case 0: return '450'; // Whole blood
      case 1: return '300'; // Red blood cells
      case 2: return '250'; // Platelets
      case 3: return '200'; // Plasma
      case 4: return '200'; // White blood cells
      default: return '300';
    }
  };

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Đăng ký hiến máu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Important Notice */}
        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Lưu ý quan trọng:</p>
              <ul className="space-y-1 text-xs">
                <li>• Bạn phải đủ 18 tuổi và cân nặng tối thiểu 45kg</li>
                <li>• Khoảng cách giữa 2 lần hiến máu tối thiểu 12 tuần</li>
                <li>• Sức khỏe tốt, không bị bệnh truyền nhiễm</li>
                <li>• Sẽ có kiểm tra sức khỏe trước khi hiến máu</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Compatibility Warning */}
          {errors.compatibility && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{errors.compatibility}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donation Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày dự kiến hiến máu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.donationDate}
                onChange={(e) => handleInputChange('donationDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                  errors.donationDate ? 'border-red-500' : 'border-gray-300'
                }`}
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              {errors.donationDate && <p className="text-sm text-red-500 mt-1">{errors.donationDate}</p>}
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm máu <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bloodType}
                onChange={(e) => handleInputChange('bloodType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                  errors.bloodType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn nhóm máu</option>
                {bloodTypes.map(type => (
                  <option key={type.bloodTypeId} value={type.bloodTypeId}>
                    {type.typeName}
                  </option>
                ))}
              </select>
              {errors.bloodType && <p className="text-sm text-red-500 mt-1">{errors.bloodType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Blood Component */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thành phần máu <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bloodComponent}
                onChange={(e) => {
                  handleInputChange('bloodComponent', e.target.value);
                  // Auto-fill recommended volume
                  if (e.target.value) {
                    handleInputChange('volumeMl', getRecommendedVolume(e.target.value));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                  errors.bloodComponent ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn thành phần máu</option>
                {bloodComponents.map(component => (
                  <option key={component.componentId} value={component.componentId}>
                    {component.componentName}
                  </option>
                ))}
              </select>
              {errors.bloodComponent && <p className="text-sm text-red-500 mt-1">{errors.bloodComponent}</p>}
            </div>

            {/* Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thể tích (ml) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="50"
                max="500"
                value={formData.volumeMl}
                onChange={(e) => handleInputChange('volumeMl', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                  errors.volumeMl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập thể tích máu"
              />
              {errors.volumeMl && <p className="text-sm text-red-500 mt-1">{errors.volumeMl}</p>}
              <p className="text-xs text-gray-500 mt-1">Thể tích từ 50ml đến 500ml</p>
            </div>
          </div>

          {/* Compatibility Check */}
          {compatibilityCheck !== null && (
            <div className={`p-3 rounded-lg flex items-center space-x-2 ${
              compatibilityCheck ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {compatibilityCheck ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <span className={`text-sm ${compatibilityCheck ? 'text-green-600' : 'text-red-600'}`}>
                {compatibilityCheck ? 'Tương thích' : 'Không tương thích - Vui lòng chọn lại'}
              </span>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa điểm hiến máu <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Chọn địa điểm</option>
              <option value="Bệnh viện Chợ Rẫy">Bệnh viện Chợ Rẫy</option>
              <option value="Trung tâm Huyết học TP.HCM">Trung tâm Huyết học TP.HCM</option>
              <option value="Bệnh viện Đại học Y Dược">Bệnh viện Đại học Y Dược</option>
              <option value="Bệnh viện Nhân dân 115">Bệnh viện Nhân dân 115</option>
              <option value="Bệnh viện Từ Dũ">Bệnh viện Từ Dũ</option>
              <option value="Khác">Khác (ghi rõ trong ghi chú)</option>
            </select>
            {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              placeholder="Thêm ghi chú (không bắt buộc)..."
            />
          </div>

          {/* Volume Guidelines */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Hướng dẫn thể tích:</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>• <strong>Máu toàn phần:</strong> 450ml (tiêu chuẩn)</div>
              <div>• <strong>Hồng cầu:</strong> 300ml</div>
              <div>• <strong>Tiểu cầu:</strong> 250ml</div>
              <div>• <strong>Huyết tương:</strong> 200ml</div>
              <div>• <strong>Bạch cầu:</strong> 200ml</div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={compatibilityCheck === false}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Đăng ký hiến máu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationFormModal;
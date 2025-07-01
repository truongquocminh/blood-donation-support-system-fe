import React, { useState, useEffect } from 'react';
import { X, Heart, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const DonationFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  bloodTypes,
  bloodComponents,
  healthCheck = null
}) => {
  const [formData, setFormData] = useState({
    donationDate: '',
    bloodType: '',
    bloodComponent: '',
    volumeMl: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (healthCheck && isOpen) {
      setFormData(prev => ({
        ...prev,
        bloodType: healthCheck.bloodTypeId ? healthCheck.bloodTypeId.toString() : '',
        notes: `Đăng ký hiến máu dựa trên kết quả kiểm tra sức khỏe #${healthCheck.healthCheckId}`
      }));
    }
  }, [healthCheck, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        bloodType: parseInt(formData.bloodType),
        bloodComponent: parseInt(formData.bloodComponent),
        volumeMl: parseInt(formData.volumeMl),
        notes: formData.notes.trim() || 'Đăng ký hiến máu mới'
      });

      setFormData({
        donationDate: '',
        bloodType: '',
        bloodComponent: '',
        volumeMl: '',
        notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting donation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        donationDate: '',
        bloodType: '',
        bloodComponent: '',
        volumeMl: '',
        notes: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  const getRecommendedVolume = (componentId) => {
    switch (parseInt(componentId)) {
      case 0: return '450'; 
      case 1: return '300'; 
      case 2: return '250'; 
      case 3: return '200'; 
      case 4: return '200'; 
      default: return '300';
    }
  };

  const selectedBloodType = bloodTypes.find(bt => bt.id === parseInt(formData.bloodType));

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {healthCheck && (
          <div className="p-4 bg-green-50 border-b border-green-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-700">
                <p className="font-medium mb-1">Dựa trên kết quả kiểm tra sức khỏe</p>
                <div className="space-y-1 text-xs">
                  <div>• Kiểm tra lúc: {new Date(healthCheck.checkedAt).toLocaleString('vi-VN')}</div>
                  <div>• Kết quả: Đủ điều kiện hiến máu</div>
                  {healthCheck.bloodTypeName && (
                    <div>• Nhóm máu xác nhận: {healthCheck.bloodTypeName}</div>
                  )}
                  <div>• Nhịp tim: {healthCheck.pulse} bpm</div>
                  <div>• Huyết áp: {healthCheck.bloodPressure !== 'string' ? healthCheck.bloodPressure : 'Chưa đo'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Lưu ý quan trọng:</p>
              <ul className="space-y-1 text-xs">
                <li>• Bạn phải đủ 18 tuổi và cân nặng tối thiểu 45kg</li>
                <li>• Khoảng cách giữa 2 lần hiến máu tối thiểu 12 tuần</li>
                <li>• Sức khỏe tốt, không bị bệnh truyền nhiễm</li>
                <li>• Ngày hiến máu phải sau ngày hôm nay</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.compatibility && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{errors.compatibility}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày dự kiến hiến máu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.donationDate}
                onChange={(e) => handleInputChange('donationDate', e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                  errors.donationDate ? 'border-red-500' : 'border-gray-300'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              {errors.donationDate && <p className="text-sm text-red-500 mt-1">{errors.donationDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm máu <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bloodType}
                onChange={(e) => handleInputChange('bloodType', e.target.value)}
                disabled={isSubmitting || (healthCheck && healthCheck.bloodTypeId)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                  errors.bloodType ? 'border-red-500' : 'border-gray-300'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${
                  (healthCheck && healthCheck.bloodTypeId) ? 'bg-gray-100' : ''
                }`}
              >
                <option value="">Chọn nhóm máu</option>
                {bloodTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.typeName}
                  </option>
                ))}
              </select>
              {errors.bloodType && <p className="text-sm text-red-500 mt-1">{errors.bloodType}</p>}
              {(healthCheck && healthCheck.bloodTypeId) && (
                <p className="text-xs text-green-600 mt-1">
                  Nhóm máu đã được xác nhận từ kết quả kiểm tra sức khỏe
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thành phần máu <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bloodComponent}
                onChange={(e) => {
                  handleInputChange('bloodComponent', e.target.value);
                  if (e.target.value) {
                    handleInputChange('volumeMl', getRecommendedVolume(e.target.value));
                  }
                }}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                  errors.bloodComponent ? 'border-red-500' : 'border-gray-300'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">Chọn thành phần máu</option>
                {selectedBloodType?.components?.map(comp => (
                  <option key={comp.componentId} value={comp.componentId}>
                    {comp.componentName}
                  </option>
                )) || []}
              </select>
              {errors.bloodComponent && <p className="text-sm text-red-500 mt-1">{errors.bloodComponent}</p>}
            </div>

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
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                  errors.volumeMl ? 'border-red-500' : 'border-gray-300'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Nhập thể tích máu"
              />
              {errors.volumeMl && <p className="text-sm text-red-500 mt-1">{errors.volumeMl}</p>}
              <p className="text-xs text-gray-500 mt-1">Thể tích từ 50ml đến 500ml</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder="Thêm ghi chú (không bắt buộc)..."
            />
          </div>

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

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký hiến máu'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationFormModal;
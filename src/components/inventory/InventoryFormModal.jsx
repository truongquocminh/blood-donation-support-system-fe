import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { isCompatible } from '../../utils/helpers';

const InventoryFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  inventory = null, 
  bloodTypes, 
  bloodComponents 
}) => {
  const [formData, setFormData] = useState({
    bloodType: '',
    bloodComponent: '',
    quantity: '',
    expiryDate: '',
    donorId: ''
  });
  const [errors, setErrors] = useState({});
  const [compatibilityCheck, setCompatibilityCheck] = useState(null);

  useEffect(() => {
    if (inventory) {
      setFormData({
        bloodType: inventory.bloodType.toString(),
        bloodComponent: inventory.bloodComponent.toString(),
        quantity: inventory.quantity.toString(),
        expiryDate: inventory.expiryDate,
        donorId: inventory.donorId
      });
    } else {
      setFormData({
        bloodType: '',
        bloodComponent: '',
        quantity: '',
        expiryDate: '',
        donorId: ''
      });
    }
    setErrors({});
    setCompatibilityCheck(null);
  }, [inventory, isOpen]);

  useEffect(() => {
    if (formData.bloodType !== '' && formData.bloodComponent !== '') {
      const bloodTypeId = parseInt(formData.bloodType);
      const componentId = parseInt(formData.bloodComponent);
      const compatible = isCompatible(bloodTypeId, bloodTypeId, componentId);
      setCompatibilityCheck(compatible);
    } else {
      setCompatibilityCheck(null);
    }
  }, [formData.bloodType, formData.bloodComponent]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bloodType) {
      newErrors.bloodType = 'Vui lòng chọn nhóm máu';
    }

    if (!formData.bloodComponent) {
      newErrors.bloodComponent = 'Vui lòng chọn thành phần máu';
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Vui lòng chọn ngày hết hạn';
    } else {
      const today = new Date();
      const expiry = new Date(formData.expiryDate);
      if (expiry <= today) {
        newErrors.expiryDate = 'Ngày hết hạn phải sau ngày hôm nay';
      }
    }

    if (!formData.donorId.trim()) {
      newErrors.donorId = 'Vui lòng nhập mã người hiến';
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
      quantity: parseInt(formData.quantity),
      donorId: formData.donorId.trim()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {inventory ? 'Chỉnh sửa kho máu' : 'Thêm kho máu mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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

          {/* Blood Component */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thành phần máu <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.bloodComponent}
              onChange={(e) => handleInputChange('bloodComponent', e.target.value)}
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

          {/* Compatibility Check */}
          {compatibilityCheck !== null && (
            <div className={`p-3 rounded-lg flex items-center space-x-2 ${
              compatibilityCheck ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {compatibilityCheck ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <span className={`text-sm ${compatibilityCheck ? 'text-green-600' : 'text-red-600'}`}>
                {compatibilityCheck ? 'Tương thích' : 'Không tương thích'}
              </span>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng (đơn vị) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số lượng"
            />
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày hết hạn <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              }`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
          </div>

          {/* Donor ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã người hiến <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.donorId}
              onChange={(e) => handleInputChange('donorId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
                errors.donorId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập mã người hiến (VD: D001)"
            />
            {errors.donorId && <p className="text-sm text-red-500 mt-1">{errors.donorId}</p>}
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
              {inventory ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryFormModal;
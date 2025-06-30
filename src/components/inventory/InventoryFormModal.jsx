import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

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
    quantity: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (inventory) {
      console.log("inventory: ",inventory)
      setFormData({
        bloodType: inventory.bloodType ? inventory.bloodType.toString() : '',
        bloodComponent: inventory.bloodComponent ? inventory.bloodComponent.toString() : '',
        quantity: inventory.quantity ? inventory.quantity.toString() : ''
      });
    } else {
      setFormData({
        bloodType: '',
        bloodComponent: '',
        quantity: ''
      });
    }
    setErrors({});
  }, [inventory, isOpen]);


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
      quantity: parseInt(formData.quantity)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.compatibility && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{errors.compatibility}</span>
            </div>
          )}

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
                <option key={type.id} value={type.id}>
                  {type.typeName}
                </option>
              ))}
            </select>
            {errors.bloodType && <p className="text-sm text-red-500 mt-1">{errors.bloodType}</p>}
          </div>

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
                <option key={component.id} value={component.id}>
                  {component.componentName}
                </option>
              ))}
            </select>
            {errors.bloodComponent && <p className="text-sm text-red-500 mt-1">{errors.bloodComponent}</p>}
          </div>

         

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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Lưu ý:</strong> Thời gian cập nhật và hạn sử dụng sẽ được tự động tính toán dựa trên thời điểm hiện tại.
            </p>
          </div>

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
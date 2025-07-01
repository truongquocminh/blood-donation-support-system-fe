import React, { useState, useEffect } from 'react';
import { X, FlaskConical, AlertTriangle } from 'lucide-react';
import { URGENCY_LEVELS } from '../../utils/constants';

const CreateBloodRequestModal = ({ isOpen, onClose, onSubmit, bloodTypes, isLoading = false }) => {
  const [formData, setFormData] = useState({
    bloodTypeId: '',
    bloodComponentId: '',
    urgencyLevel: URGENCY_LEVELS.MEDIUM,
    quantity: 1
  });

  const [errors, setErrors] = useState({});
  const [availableComponents, setAvailableComponents] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        bloodTypeId: '',
        bloodComponentId: '',
        urgencyLevel: URGENCY_LEVELS.MEDIUM,
        quantity: 1
      });
      setErrors({});
      setAvailableComponents([]);
    }
  }, [isOpen]);

  const handleBloodTypeChange = (bloodTypeId) => {
    const selectedType = bloodTypes.find(t => t.id.toString() === bloodTypeId);
    setFormData(prev => ({ ...prev, bloodTypeId, bloodComponentId: '' }));
    setAvailableComponents(selectedType ? selectedType.components : []);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bloodTypeId) newErrors.bloodTypeId = 'Chọn nhóm máu';
    if (!formData.bloodComponentId) newErrors.bloodComponentId = 'Chọn thành phần máu';
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = 'Số lượng phải > 0';
    if (formData.quantity > 100) newErrors.quantity = 'Tối đa 100 đơn vị';
    return newErrors;
  };

  const handleSubmit = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    const submitData = {
      bloodTypeId: parseInt(formData.bloodTypeId),
      bloodComponentId: parseInt(formData.bloodComponentId),
      urgencyLevel: formData.urgencyLevel,
      quantity: parseInt(formData.quantity)
    };
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FlaskConical className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tạo yêu cầu máu</h3>
              <p className="text-sm text-gray-600">Điền thông tin yêu cầu</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nhóm máu *</label>
            <select
              value={formData.bloodTypeId}
              onChange={(e) => handleBloodTypeChange(e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg ${errors.bloodTypeId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Chọn nhóm máu</option>
              {bloodTypes.map(bt => (
                <option key={bt.id} value={bt.id}>{bt.typeName}</option>
              ))}
            </select>
            {errors.bloodTypeId && <p className="text-sm text-red-500 mt-1">{errors.bloodTypeId}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Thành phần máu *</label>
            <select
              value={formData.bloodComponentId}
              onChange={(e) => handleChange('bloodComponentId', e.target.value)}
              disabled={!formData.bloodTypeId || availableComponents.length === 0 || isLoading}
              className={`w-full px-3 py-2 border rounded-lg ${errors.bloodComponentId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">
                {!formData.bloodTypeId ? 'Chọn nhóm máu trước' : 'Chọn thành phần máu'}
              </option>
              {availableComponents.map(comp => (
                <option key={comp.componentId} value={comp.componentId}>{comp.componentName}</option>
              ))}
            </select>
            {errors.bloodComponentId && <p className="text-sm text-red-500 mt-1">{errors.bloodComponentId}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Mức độ khẩn cấp</label>
            <select
              value={formData.urgencyLevel}
              onChange={(e) => handleChange('urgencyLevel', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {Object.values(URGENCY_LEVELS).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Số lượng *</label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700">Hủy</button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.bloodTypeId || !formData.bloodComponentId}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Đang tạo...' : 'Tạo yêu cầu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBloodRequestModal;
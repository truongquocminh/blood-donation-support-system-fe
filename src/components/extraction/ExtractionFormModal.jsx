import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Syringe, Calendar, FileText, Loader2, Droplets } from 'lucide-react';
import { createExtraction } from '../../services/extractionService';
import toast from 'react-hot-toast';
import HandleLoading from '../common/HandleLoading';

const ExtractionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  bloodTypes,
  bloodComponents,
  onRefresh
}) => {
  const [availableComponents, setAvailableComponents] = useState([]);
  const [formData, setFormData] = useState({
    bloodTypeId: '',
    bloodComponentId: '',
    totalVolumeExtraction: '',
    notes: '',
    extractedAt: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setFormData({
        bloodTypeId: '',
        bloodComponentId: '',
        totalVolumeExtraction: '',
        notes: '',
        extractedAt: localDateTime
      });
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const selectedType = bloodTypes.find(type => type.id.toString() === formData.bloodTypeId);
    if (selectedType && selectedType.components) {
      setAvailableComponents(selectedType.components);
    } else {
      setAvailableComponents(bloodComponents || []);
    }
  }, [formData.bloodTypeId, bloodTypes, bloodComponents]);

  const handleInputChange = (field, value) => {
    if (field === 'extractedAt' && value) {
      const selectedTime = new Date(value);
      const now = new Date();
      
      if (selectedTime > now) {
        setErrors(prev => ({ 
          ...prev, 
          extractedAt: 'Thời gian trích xuất không thể trong tương lai' 
        }));
        return; 
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCurrentVietnamTime = () => {
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    return vietnamTime.toISOString().slice(0, 16);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bloodTypeId) {
      newErrors.bloodTypeId = 'Vui lòng chọn nhóm máu';
    }

    if (!formData.bloodComponentId) {
      newErrors.bloodComponentId = 'Vui lòng chọn thành phần máu';
    }

    if (!formData.totalVolumeExtraction || parseInt(formData.totalVolumeExtraction) <= 0) {
      newErrors.totalVolumeExtraction = 'Thể tích trích xuất phải lớn hơn 0';
    }

    if (!formData.extractedAt) {
      newErrors.extractedAt = 'Vui lòng chọn thời gian trích xuất';
    }

    if (formData.extractedAt) {
      const extractedDate = new Date(formData.extractedAt);
      const now = new Date();
      
      if (extractedDate > now) {
        newErrors.extractedAt = 'Thời gian trích xuất không thể trong tương lai';
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

    try {
      setLoading(true);

      const extractionData = {
        bloodTypeId: parseInt(formData.bloodTypeId),
        bloodComponentId: parseInt(formData.bloodComponentId),
        totalVolumeExtraction: parseInt(formData.totalVolumeExtraction),
        notes: formData.notes.trim() || null,
        extractedAt: formData.extractedAt
      };

      const response = await createExtraction(extractionData);

      if (response.status === 200 || response.status === 201) {
        toast.success('Tạo trích xuất thành công!');
        onClose();
        if (onRefresh) {
          onRefresh();
        } else {
          onSubmit();
        }
      }

    } catch (error) {
      console.error('Lỗi khi tạo trích xuất:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Dữ liệu không hợp lệ');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy thông tin nhóm máu hoặc thành phần');
      } else {
        toast.error('Lỗi khi tạo trích xuất');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {loading && <HandleLoading />}

      <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Syringe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tạo trích xuất mới
                </h3>
                <p className="text-sm text-gray-600">
                  Nhập thông tin trích xuất máu
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">Thông tin quan trọng:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Chọn nhóm máu và thành phần máu cần trích xuất</li>
                    <li>• Nhập thể tích trích xuất chính xác</li>
                    <li>• Ghi chú thêm thông tin nếu cần thiết</li>
                    <li>• Kiểm tra thời gian trích xuất</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhóm máu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.bloodTypeId}
                  onChange={(e) => handleInputChange('bloodTypeId', e.target.value)}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.bloodTypeId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Chọn nhóm máu</option>
                  {bloodTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
                {errors.bloodTypeId && <p className="text-sm text-red-500 mt-1">{errors.bloodTypeId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành phần máu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.bloodComponentId}
                  onChange={(e) => handleInputChange('bloodComponentId', e.target.value)}
                  disabled={loading || !formData.bloodTypeId}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.bloodComponentId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Chọn thành phần máu</option>
                  {availableComponents.map(component => (
                    <option key={component.componentId} value={component.componentId}>
                      {component.componentName}
                    </option>
                  ))}
                </select>
                {errors.bloodComponentId && <p className="text-sm text-red-500 mt-1">{errors.bloodComponentId}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thể tích trích xuất (ml) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Syringe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={formData.totalVolumeExtraction}
                    onChange={(e) => handleInputChange('totalVolumeExtraction', e.target.value)}
                    disabled={loading}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.totalVolumeExtraction ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="VD: 500"
                  />
                </div>
                {errors.totalVolumeExtraction && <p className="text-sm text-red-500 mt-1">{errors.totalVolumeExtraction}</p>}
                <p className="text-xs text-gray-500 mt-1">Thể tích máu cần trích xuất (1-10,000ml)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian trích xuất <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="datetime-local"
                    value={formData.extractedAt}
                    onChange={(e) => handleInputChange('extractedAt', e.target.value)}
                    disabled={loading}
                    max={getCurrentVietnamTime()}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${errors.extractedAt ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.extractedAt && <p className="text-sm text-red-500 mt-1">{errors.extractedAt}</p>}
                <p className="text-xs text-gray-500 mt-1">Thời gian thực hiện trích xuất</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  disabled={loading}
                  rows={4}
                  maxLength={500}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  placeholder="Nhập ghi chú về quá trình trích xuất (tùy chọn)..."
                />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">Thông tin bổ sung về trích xuất</p>
                <p className="text-xs text-gray-500">
                  {formData.notes.length}/500
                </p>
              </div>
            </div>

            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Syringe className="w-5 h-5" />
                    <span>Tạo trích xuất</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ExtractionFormModal;
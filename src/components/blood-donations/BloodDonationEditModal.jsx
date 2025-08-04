import React, { useState, useEffect } from 'react';
import { X, Droplets, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { getBloodTypes } from '../../services/bloodTypeService';
import { updateBloodDonationInfo } from '../../services/bloodDonationInformationService';

const BloodDonationEditModal = ({ isOpen, onClose, donation, onSuccess }) => {
  const [formData, setFormData] = useState({
    bloodTypeId: '',
    actualBloodVolume: ''
  });
  const [bloodTypes, setBloodTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingBloodTypes, setLoadingBloodTypes] = useState(false);

  useEffect(() => {
    if (isOpen && donation) {
      setFormData({
        bloodTypeId: donation.bloodTypeId || '',
        actualBloodVolume: donation.actualBloodVolume || ''
      });
      loadBloodTypes();
    }
  }, [isOpen, donation]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        bloodTypeId: '',
        actualBloodVolume: ''
      });
      setErrors({});
      setBloodTypes([]);
    }
  }, [isOpen]);

  const loadBloodTypes = async () => {
    try {
      setLoadingBloodTypes(true);
      const response = await getBloodTypes();
      if (response.status === 200) {
        setBloodTypes(response.data.data.content);
      }
    } catch (error) {
      console.error('Error loading blood types:', error);
      toast.error('Không thể tải danh sách nhóm máu');
    } finally {
      setLoadingBloodTypes(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.actualBloodVolume || parseFloat(formData.actualBloodVolume) <= 0) {
      newErrors.actualBloodVolume = 'Vui lòng nhập thể tích máu hợp lệ';
    } else if (parseFloat(formData.actualBloodVolume) < 250 || parseFloat(formData.actualBloodVolume) > 650) {
      newErrors.actualBloodVolume = 'Thể tích máu phải từ 250ml đến 650ml';
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
      setSubmitting(true);

      const updateData = {
        appointmentId: donation.appointmentId,
        bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId) : null,
        actualBloodVolume: parseFloat(formData.actualBloodVolume)
      };

      const response = await updateBloodDonationInfo(donation.bloodDonationInformationId, updateData);
      
      if (response.status === 200) {
        toast.success('Cập nhật thông tin hiến máu thành công!');
        onSuccess();
        onClose();
      } else {
        toast.error('Không thể cập nhật thông tin hiến máu');
      }
    } catch (error) {
      console.error('Error updating blood donation:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin hiến máu');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !donation) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Chỉnh sửa thông tin hiến máu
              </h3>
              <p className="text-sm text-gray-600">
                ID: #{donation.bloodDonationInformationId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Droplets className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Thông tin hiện tại:</p>
                <p>Người hiến: <strong>{donation.userName}</strong></p>
                <p>Lịch hẹn: <strong>#{donation.appointmentId}</strong></p>
                <p>Nhóm máu hiện tại: <strong>{donation.bloodTypeName}</strong></p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhóm máu
            </label>
            {loadingBloodTypes ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
              </div>
            ) : (
              <select
                value={formData.bloodTypeId}
                onChange={(e) => handleInputChange('bloodTypeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                disabled={submitting}
              >
                <option value="">Chọn nhóm máu (tùy chọn)</option>
                {bloodTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Có thể để trống nếu chưa xác định
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thể tích máu thực tế (ml) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="250"
              max="650"
              step="50"
              value={formData.actualBloodVolume}
              onChange={(e) => handleInputChange('actualBloodVolume', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.actualBloodVolume ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: 500"
              disabled={submitting}
              required
            />
            {errors.actualBloodVolume && (
              <p className="text-sm text-red-500 mt-1">{errors.actualBloodVolume}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Thể tích máu thực tế đã thu được (250-650ml)
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BloodDonationEditModal;
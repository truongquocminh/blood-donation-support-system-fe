import React, { useState } from 'react';
import { X, UserCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const HealthCheckModal = ({ isOpen, onClose, donation, onSubmit }) => {
  const [formData, setFormData] = useState({
    bloodPressure: '',
    heartRate: '',
    hemoglobin: '',
    weight: donation?.user?.weight || '',
    temperature: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [autoApproval, setAutoApproval] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-check health criteria
    checkHealthCriteria({ ...formData, [field]: value });
  };

  const checkHealthCriteria = (data) => {
    const { bloodPressure, heartRate, hemoglobin, weight, temperature } = data;
    
    // Only check if all values are present
    if (!bloodPressure || !heartRate || !hemoglobin || !weight || !temperature) {
      setAutoApproval(null);
      return;
    }

    const issues = [];

    // Blood pressure check (format: "120/80")
    if (bloodPressure.includes('/')) {
      const [systolic, diastolic] = bloodPressure.split('/').map(Number);
      if (systolic > 180 || systolic < 90 || diastolic > 100 || diastolic < 60) {
        issues.push('Huyết áp không trong giới hạn cho phép (90-180/60-100)');
      }
    }

    // Heart rate check
    const hr = parseFloat(heartRate);
    if (hr > 100 || hr < 50) {
      issues.push('Nhịp tim không trong giới hạn cho phép (50-100 bpm)');
    }

    // Hemoglobin check (different for male/female, assuming general criteria)
    const hb = parseFloat(hemoglobin);
    if (hb < 12.5 || hb > 18) {
      issues.push('Nồng độ hemoglobin không đạt tiêu chuẩn (12.5-18 g/dL)');
    }

    // Weight check
    const w = parseFloat(weight);
    if (w < 45) {
      issues.push('Cân nặng dưới 45kg');
    }

    // Temperature check
    const temp = parseFloat(temperature);
    if (temp > 37.5 || temp < 36) {
      issues.push('Nhiệt độ cơ thể không bình thường (36-37.5°C)');
    }

    setAutoApproval({
      approved: issues.length === 0,
      issues: issues
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bloodPressure) {
      newErrors.bloodPressure = 'Vui lòng nhập huyết áp';
    } else if (!formData.bloodPressure.match(/^\d{2,3}\/\d{2,3}$/)) {
      newErrors.bloodPressure = 'Định dạng huyết áp không đúng (VD: 120/80)';
    }

    if (!formData.heartRate || parseFloat(formData.heartRate) <= 0) {
      newErrors.heartRate = 'Vui lòng nhập nhịp tim hợp lệ';
    }

    if (!formData.hemoglobin || parseFloat(formData.hemoglobin) <= 0) {
      newErrors.hemoglobin = 'Vui lòng nhập nồng độ hemoglobin hợp lệ';
    }

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Vui lòng nhập cân nặng hợp lệ';
    }

    if (!formData.temperature || parseFloat(formData.temperature) <= 0) {
      newErrors.temperature = 'Vui lòng nhập nhiệt độ hợp lệ';
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

    const healthCheckData = {
      id: Date.now(),
      bloodPressure: formData.bloodPressure,
      heartRate: parseFloat(formData.heartRate),
      hemoglobin: parseFloat(formData.hemoglobin),
      weight: parseFloat(formData.weight),
      temperature: parseFloat(formData.temperature),
      approved: autoApproval?.approved || false,
      notes: formData.notes.trim() || (autoApproval?.approved 
        ? 'Tất cả chỉ số sức khỏe đều đạt tiêu chuẩn' 
        : `Không đạt tiêu chuẩn: ${autoApproval?.issues?.join(', ')}`)
    };

    onSubmit(healthCheckData);
  };

  if (!isOpen || !donation) return null;

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Kiểm tra sức khỏe
              </h3>
              <p className="text-sm text-gray-600">
                Người hiến: {donation.user.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">Tiêu chuẩn sức khỏe cho hiến máu:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Huyết áp:</strong> 90-180 / 60-100 mmHg</li>
                <li>• <strong>Nhịp tim:</strong> 50-100 bpm</li>
                <li>• <strong>Hemoglobin:</strong> 12.5-18 g/dL</li>
                <li>• <strong>Cân nặng:</strong> Tối thiểu 45kg</li>
                <li>• <strong>Nhiệt độ:</strong> 36-37.5°C</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Huyết áp (mmHg) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.bloodPressure}
                onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.bloodPressure ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: 120/80"
              />
              {errors.bloodPressure && <p className="text-sm text-red-500 mt-1">{errors.bloodPressure}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhịp tim (bpm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="40"
                max="120"
                value={formData.heartRate}
                onChange={(e) => handleInputChange('heartRate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.heartRate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: 72"
              />
              {errors.heartRate && <p className="text-sm text-red-500 mt-1">{errors.heartRate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hemoglobin (g/dL) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="8"
                max="20"
                value={formData.hemoglobin}
                onChange={(e) => handleInputChange('hemoglobin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.hemoglobin ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: 13.5"
              />
              {errors.hemoglobin && <p className="text-sm text-red-500 mt-1">{errors.hemoglobin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cân nặng (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="150"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: 65"
              />
              {errors.weight && <p className="text-sm text-red-500 mt-1">{errors.weight}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhiệt độ cơ thể (°C) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="40"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.temperature ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: 36.5"
              />
              {errors.temperature && <p className="text-sm text-red-500 mt-1">{errors.temperature}</p>}
            </div>
          </div>

          {autoApproval !== null && (
            <div className={`p-4 rounded-lg border ${
              autoApproval.approved 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                {autoApproval.approved ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className={`text-sm font-medium ${
                    autoApproval.approved ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {autoApproval.approved ? 'Đạt tiêu chuẩn hiến máu' : 'Không đạt tiêu chuẩn hiến máu'}
                  </h4>
                  {!autoApproval.approved && autoApproval.issues.length > 0 && (
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      {autoApproval.issues.map((issue, index) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                  {autoApproval.approved && (
                    <p className="text-sm text-green-700 mt-1">
                      Tất cả các chỉ số sức khỏe đều nằm trong giới hạn cho phép
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú thêm
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập ghi chú về tình trạng sức khỏe, các lưu ý đặc biệt..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-3">Câu hỏi sức khỏe bổ sung:</h4>
            <div className="space-y-2 text-sm text-yellow-700">
              <div>✓ Người hiến có đang dùng thuốc gì không?</div>
              <div>✓ Có triệu chứng cảm cúm, sốt trong 2 tuần qua?</div>
              <div>✓ Có tiền sử bệnh tim, tiểu đường, cao huyết áp?</div>
              <div>✓ Có từng hiến máu trong 3 tháng qua?</div>
              <div>✓ Có uống rượu/bia trong 24h qua?</div>
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              * Ghi chú các câu trả lời vào phần ghi chú ở trên
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
              className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                autoApproval?.approved 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {autoApproval?.approved ? 'Phê duyệt hiến máu' : 'Từ chối hiến máu'}
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600 text-center">
              Quyết định phê duyệt/từ chối sẽ được gửi thông báo đến người hiến máu qua email/SMS
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthCheckModal;
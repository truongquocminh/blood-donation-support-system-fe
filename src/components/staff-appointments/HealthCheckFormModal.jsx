import React, { useState } from 'react';
import { X, UserCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const HealthCheckFormModal = ({ isOpen, onClose, appointment, bloodTypes, onSubmit }) => {
  const [formData, setFormData] = useState({
    pulse: '',
    bloodPressure: '',
    resultSummary: '',
    isEligible: null,
    ineligibleReason: '',
    bloodTypeId: appointment?.bloodType?.toString() || ''
  });
  const [errors, setErrors] = useState({});
  const [autoEligibility, setAutoEligibility] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    checkEligibilityCriteria({ ...formData, [field]: value });
  };

  const checkEligibilityCriteria = (data) => {
    const { pulse, bloodPressure } = data;
    
    if (!pulse || !bloodPressure) {
      setAutoEligibility(null);
      return;
    }

    const issues = [];

    const pulseNum = parseFloat(pulse);
    if (pulseNum < 50 || pulseNum > 100) {
      issues.push('Mạch không trong giới hạn cho phép (50-100 bpm)');
    }

    if (bloodPressure.includes('/')) {
      const [systolic, diastolic] = bloodPressure.split('/').map(Number);
      if (systolic > 180 || systolic < 90 || diastolic > 100 || diastolic < 60) {
        issues.push('Huyết áp không trong giới hạn cho phép (90-180/60-100)');
      }
    }

    const eligible = issues.length === 0;
    setAutoEligibility({
      eligible: eligible,
      issues: issues
    });

    setFormData(prev => ({
      ...prev,
      isEligible: eligible,
      resultSummary: eligible 
        ? 'Tất cả chỉ số sức khỏe đều đạt tiêu chuẩn, đủ điều kiện hiến máu' 
        : `Không đủ điều kiện hiến máu: ${issues.join(', ')}`,
      ineligibleReason: eligible ? '' : issues.join(', ')
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pulse || parseFloat(formData.pulse) <= 0) {
      newErrors.pulse = 'Vui lòng nhập mạch hợp lệ';
    }

    if (!formData.bloodPressure) {
      newErrors.bloodPressure = 'Vui lòng nhập huyết áp';
    } else if (!formData.bloodPressure.match(/^\d{2,3}\/\d{2,3}$/)) {
      newErrors.bloodPressure = 'Định dạng huyết áp không đúng (VD: 120/80)';
    }

    if (!formData.resultSummary?.trim()) {
      newErrors.resultSummary = 'Vui lòng nhập tóm tắt kết quả';
    }

    if (formData.isEligible === null) {
      newErrors.isEligible = 'Vui lòng chọn kết quả đánh giá';
    }

    if (formData.isEligible === false && !formData.ineligibleReason?.trim()) {
      newErrors.ineligibleReason = 'Vui lòng nhập lý do không đủ điều kiện';
    }

    if (!formData.bloodTypeId) {
      newErrors.bloodTypeId = 'Vui lòng xác nhận nhóm máu';
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
      pulse: parseFloat(formData.pulse),
      bloodPressure: formData.bloodPressure,
      resultSummary: formData.resultSummary.trim(),
      isEligible: formData.isEligible,
      ineligibleReason: formData.isEligible ? null : formData.ineligibleReason.trim(),
      bloodTypeId: parseInt(formData.bloodTypeId)
    };

    onSubmit(healthCheckData);
  };

  const getBloodTypeName = (typeId) => {
    const type = bloodTypes.find(t => t.bloodTypeId === parseInt(typeId));
    return type ? type.typeName : 'N/A';
  };

  if (!isOpen || !appointment) return null;

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
                Lịch hẹn #{appointment.id} - {appointment.user.name}
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

        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin bệnh nhân</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Họ tên:</span>
              <p className="font-medium">{appointment.user.name}</p>
            </div>
            <div>
              <span className="text-gray-600">Tuổi:</span>
              <p className="font-medium">{appointment.user.age} tuổi</p>
            </div>
            <div>
              <span className="text-gray-600">Cân nặng:</span>
              <p className="font-medium">{appointment.user.weight} kg</p>
            </div>
            <div>
              <span className="text-gray-600">Nhóm máu (hồ sơ):</span>
              <p className="font-medium">{getBloodTypeName(appointment.user.bloodType)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">Tiêu chuẩn sức khỏe cho hiến máu:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Mạch:</strong> 50-100 bpm</li>
                <li>• <strong>Huyết áp:</strong> 90-180 / 60-100 mmHg</li>
                <li>• <strong>Cân nặng:</strong> Tối thiểu 45kg</li>
                <li>• <strong>Tình trạng chung:</strong> Không sốt, không có triệu chứng bệnh lý</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mạch (bpm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="40"
                max="120"
                value={formData.pulse}
                onChange={(e) => handleInputChange('pulse', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.pulse ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: 72"
              />
              {errors.pulse && <p className="text-sm text-red-500 mt-1">{errors.pulse}</p>}
            </div>

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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận nhóm máu <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.bloodTypeId}
              onChange={(e) => handleInputChange('bloodTypeId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.bloodTypeId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Chọn nhóm máu đã xác minh</option>
              {bloodTypes.map(type => (
                <option key={type.bloodTypeId} value={type.bloodTypeId}>
                  {type.typeName}
                </option>
              ))}
            </select>
            {errors.bloodTypeId && <p className="text-sm text-red-500 mt-1">{errors.bloodTypeId}</p>}
          </div>

          {autoEligibility !== null && (
            <div className={`p-4 rounded-lg border ${
              autoEligibility.eligible 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                {autoEligibility.eligible ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className={`text-sm font-medium ${
                    autoEligibility.eligible ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {autoEligibility.eligible ? 'Đạt tiêu chuẩn hiến máu' : 'Không đạt tiêu chuẩn hiến máu'}
                  </h4>
                  {!autoEligibility.eligible && autoEligibility.issues.length > 0 && (
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      {autoEligibility.issues.map((issue, index) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kết quả đánh giá <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isEligible"
                  value="true"
                  checked={formData.isEligible === true}
                  onChange={() => handleInputChange('isEligible', true)}
                  className="mr-2"
                />
                <span className="text-green-700">Đủ điều kiện hiến máu</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isEligible"
                  value="false"
                  checked={formData.isEligible === false}
                  onChange={() => handleInputChange('isEligible', false)}
                  className="mr-2"
                />
                <span className="text-red-700">Không đủ điều kiện hiến máu</span>
              </label>
            </div>
            {errors.isEligible && <p className="text-sm text-red-500 mt-1">{errors.isEligible}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tóm tắt kết quả <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.resultSummary}
              onChange={(e) => handleInputChange('resultSummary', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.resultSummary ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tóm tắt về tình trạng sức khỏe và kết quả kiểm tra..."
            />
            {errors.resultSummary && <p className="text-sm text-red-500 mt-1">{errors.resultSummary}</p>}
          </div>

          {formData.isEligible === false && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do không đủ điều kiện <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.ineligibleReason}
                onChange={(e) => handleInputChange('ineligibleReason', e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ineligibleReason ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mô tả chi tiết lý do tại sao không đủ điều kiện..."
              />
              {errors.ineligibleReason && <p className="text-sm text-red-500 mt-1">{errors.ineligibleReason}</p>}
            </div>
          )}

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
                formData.isEligible === true
                  ? 'bg-green-600 hover:bg-green-700' 
                  : formData.isEligible === false
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {formData.isEligible === true ? 'Phê duyệt hiến máu' : 
               formData.isEligible === false ? 'Từ chối hiến máu' : 
               'Lưu kết quả'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthCheckFormModal;
import React, { useState, useEffect } from 'react';
import { X, UserCheck, AlertTriangle, CheckCircle, Info, Scale, Droplets, User, Phone, MapPin, CreditCard, Briefcase, Heart, Calendar } from 'lucide-react';
import { getUserById } from '../../services/userService';
import { getAppointmentHealthDeclaration } from '../../services/healthDeclarationService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { formatVietnamTime } from '../../utils/formatters'; 

const HealthCheckFormModal = ({ isOpen, onClose, appointment, onSubmit }) => {
  const [formData, setFormData] = useState({
    pulse: '',
    bloodPressure: '',
    weight: '',
    suggestBloodVolume: '',
    resultSummary: '',
    isEligible: null,
    ineligibleReason: ''
  });
  const [userInfo, setUserInfo] = useState(null);
  const [healthDeclaration, setHealthDeclaration] = useState(null);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [autoEligibility, setAutoEligibility] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!appointment?.userId || !appointment?.appointmentId) return;
      
      setLoadingUser(true);
      setLoadingHealth(true);

      try {
        const [userData, bloodTypesData] = await Promise.all([
          getUserById(appointment.userId),
          getBloodTypes()
        ]);
        
        setUserInfo(userData.data.data);
        setBloodTypes(bloodTypesData.data.data.content);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoadingUser(false);
      }

      try {
        const healthData = await getAppointmentHealthDeclaration(appointment.appointmentId);
        setHealthDeclaration(healthData.data.data);
      } catch (error) {
        console.error('Error fetching health declaration:', error);
      } finally {
        setLoadingHealth(false);
      }
    };

    if (isOpen && appointment) {
      fetchData();
    }
  }, [appointment, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        pulse: '',
        bloodPressure: '',
        weight: '',
        suggestBloodVolume: '',
        resultSummary: '',
        isEligible: null,
        ineligibleReason: ''
      });
      setUserInfo(null);
      setHealthDeclaration(null);
      setBloodTypes([]);
      setErrors({});
      setAutoEligibility(null);
      setLoadingUser(false);
      setLoadingHealth(false);
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    const updatedData = { ...formData, [field]: value };
    
    if (field === 'weight') {
      const suggestedVolume = calculateSuggestedBloodVolume(parseFloat(value));
      setFormData(prev => ({ ...prev, [field]: value, suggestBloodVolume: suggestedVolume.toString() }));
      updatedData.suggestBloodVolume = suggestedVolume.toString();
    }

    checkEligibilityCriteria(updatedData);
  };

  const calculateSuggestedBloodVolume = (weight) => {
    if (!weight || weight <= 0) return '';
    
    if (weight >= 42 && weight < 45) {
      return 250;
    } else if (weight >= 45 && weight < 60) {
      return 500;
    } else if (weight >= 60) {
      return 650;
    }
    return '';
  };

  const checkEligibilityCriteria = (data) => {
    const { pulse, bloodPressure, weight } = data;
    
    if (!pulse || !bloodPressure || !weight) {
      setAutoEligibility(null);
      return;
    }

    const issues = [];
    const weightNum = parseFloat(weight);
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

    if (userInfo?.gender === 'FEMALE' && weightNum < 42) {
      issues.push('Phụ nữ dưới 42kg không được hiến máu');
    } else if (userInfo?.gender === 'MALE' && weightNum < 45) {
      issues.push('Nam giới dưới 45kg không được hiến máu');
    } else if (weightNum < 42) {
      issues.push('Cân nặng dưới 42kg không đủ điều kiện hiến máu');
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

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Vui lòng nhập cân nặng hợp lệ';
    }

    if (!formData.suggestBloodVolume || parseFloat(formData.suggestBloodVolume) <= 0) {
      newErrors.suggestBloodVolume = 'Vui lòng nhập thể tích máu đề xuất';
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

    const weightNum = parseFloat(formData.weight);
    if (formData.isEligible === true && userInfo) {
      if (userInfo.gender === 'FEMALE' && weightNum < 42) {
        newErrors.weight = 'Phụ nữ dưới 42kg không được hiến máu';
        newErrors.isEligible = 'Không thể đánh giá đủ điều kiện với cân nặng này';
      } else if (userInfo.gender === 'MALE' && weightNum < 45) {
        newErrors.weight = 'Nam giới dưới 45kg không được hiến máu';
        newErrors.isEligible = 'Không thể đánh giá đủ điều kiện với cân nặng này';
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

    const healthCheckData = {
      pulse: parseFloat(formData.pulse),
      bloodPressure: formData.bloodPressure,
      weight: parseFloat(formData.weight),
      suggestBloodVolume: parseFloat(formData.suggestBloodVolume),
      resultSummary: formData.resultSummary.trim(),
      isEligible: formData.isEligible,
      ineligibleReason: formData.isEligible ? null : formData.ineligibleReason.trim()
    };

    onSubmit(healthCheckData);
  };

  if (!isOpen || !appointment) return null;

  const getBloodTypeName = (bloodTypeId) => {
    const bloodType = bloodTypes.find(bt => bt.id === bloodTypeId);
    return bloodType ? bloodType.typeName : 'Chưa cập nhật';
  };

  const GENDER_LABELS = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác'
  };

  const BooleanDisplay = ({ label, value }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-700">{label}:</span>
      <span className={`text-sm font-medium ${value ? 'text-red-600' : 'text-green-600'}`}>
        {value ? 'Có' : 'Không'}
      </span>
    </div>
  );

  return (
    <div className="mt-0-important fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Kiểm tra sức khỏe
              </h3>
              <p className="text-sm text-gray-600">
                Lịch hẹn #{appointment.appointmentId} - User ID: {appointment.userId}
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin lịch hẹn</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID Lịch hẹn:</span>
                  <p className="font-medium">#{appointment.appointmentId}</p>
                </div>
                <div>
                  <span className="text-gray-600">ID Người dùng:</span>
                  <p className="font-medium">{appointment.userId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Ngày hẹn:</span>
                  <p className="font-medium">{formatVietnamTime(appointment.appointmentDate, 'DD/MM/YYYY')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Giờ hẹn:</span>
                  <p className="font-medium">{formatVietnamTime(appointment.appointmentDate, 'HH:mm')}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Thông tin người dùng</span>
              </h4>
              {loadingUser ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-500">Đang tải...</span>
                </div>
              ) : userInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Họ tên:</span>
                    <p className="font-medium">{userInfo.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{userInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">SĐT:</span>
                    <p className="font-medium">{userInfo.phoneNumber || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Giới tính:</span>
                    <p className="font-medium">{GENDER_LABELS[userInfo.gender] || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Ngày sinh:</span>
                    <p className="font-medium">
                      {userInfo.dateOfBirth ? formatVietnamTime(userInfo.dateOfBirth, 'DD/MM/YYYY') : 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nhóm máu:</span>
                    <p className="font-medium text-red-600">{getBloodTypeName(userInfo.bloodTypeId)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">CMND/CCCD:</span>
                    <p className="font-medium">{userInfo.citizenId || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nghề nghiệp:</span>
                    <p className="font-medium">{userInfo.job || 'Chưa cập nhật'}</p>
                  </div>
                  {userInfo.address && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <p className="font-medium">{userInfo.address}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-500">Không thể tải thông tin người dùng</p>
              )}
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span>Khai báo y tế</span>
              </h4>
              {loadingHealth ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  <span className="text-sm text-gray-500">Đang tải...</span>
                </div>
              ) : healthDeclaration ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900 text-sm">Tiền sử bệnh lý</h5>
                    <div className="space-y-1">
                      <BooleanDisplay label="Bệnh lây qua đường máu" value={healthDeclaration.hasBloodTransmittedDisease} />
                      <BooleanDisplay label="Bệnh mãn tính" value={healthDeclaration.hasChronicDisease} />
                      <div className="flex items-center justify-between py-1">
                        <span className="text-sm text-gray-700">Thuốc đang dùng:</span>
                        <span className="text-sm text-gray-900 text-right max-w-32 truncate" title={healthDeclaration.currentMedications}>
                          {healthDeclaration.currentMedications}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900 text-sm">Hoạt động gần đây</h5>
                    <div className="space-y-1">
                      <BooleanDisplay label="Xăm mình/châm cứu" value={healthDeclaration.hasTattooAcupuncture} />
                      <BooleanDisplay label="Tiêm vaccine" value={healthDeclaration.hasRecentVaccine} />
                      <BooleanDisplay label="Đi nước ngoài" value={healthDeclaration.hasTravelAbroad} />
                      <BooleanDisplay label="Tình dục không an toàn" value={healthDeclaration.hasUnsafeSex} />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1">
                    <BooleanDisplay label="Lần đầu hiến máu" value={healthDeclaration.isFirstBlood} />
                    
                    {healthDeclaration.isPregnantOrBreastfeeding !== null && (
                      <BooleanDisplay label="Mang thai/cho con bú" value={healthDeclaration.isPregnantOrBreastfeeding} />
                    )}
                    
                    {healthDeclaration.isMenstruating !== null && (
                      <BooleanDisplay label="Đang có kinh" value={healthDeclaration.isMenstruating} />
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-500">Không thể tải thông tin khai báo y tế</p>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-2">Tiêu chuẩn sức khỏe cho hiến máu:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>Mạch:</strong> 50-100 bpm</li>
                    <li>• <strong>Huyết áp:</strong> 90-180 / 60-100 mmHg</li>
                    <li>• <strong>Cân nặng:</strong> Nam ≥ 45kg, Nữ ≥ 42kg</li>
                    <li>• <strong>Thể tích máu:</strong> 42-45kg: 250ml, 45-60kg: 500ml, ≥60kg: 650ml</li>
                    <li>• <strong>Tình trạng chung:</strong> Không sốt, không có triệu chứng bệnh lý</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Chỉ số sinh tồn</h4>
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
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Cân nặng và thể tích máu</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                      <Scale className="w-4 h-4" />
                      <span>Cân nặng (kg) <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="150"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        errors.weight ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="VD: 60.5"
                    />
                    {errors.weight && <p className="text-sm text-red-500 mt-1">{errors.weight}</p>}
                    {userInfo && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tiêu chuẩn: {userInfo.gender === 'FEMALE' ? 'Nữ ≥ 42kg' : 'Nam ≥ 45kg'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                      <Droplets className="w-4 h-4 text-red-500" />
                      <span>Thể tích máu đề xuất (ml) <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="number"
                      min="250"
                      max="650"
                      step="50"
                      value={formData.suggestBloodVolume}
                      onChange={(e) => handleInputChange('suggestBloodVolume', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        errors.suggestBloodVolume ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="VD: 500"
                    />
                    {errors.suggestBloodVolume && <p className="text-sm text-red-500 mt-1">{errors.suggestBloodVolume}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Tự động tính dựa trên cân nặng, có thể chỉnh sửa
                    </p>
                  </div>
                </div>
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

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Kết quả đánh giá</h4>
                <div className="space-y-4">
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
                        <span className="text-green-700 font-medium">Đủ điều kiện hiến máu</span>
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
                        <span className="text-red-700 font-medium">Không đủ điều kiện hiến máu</span>
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
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2.5 rounded-lg text-white transition-colors font-medium ${
                    formData.isEligible === true
                      ? 'bg-green-600 hover:bg-green-700' 
                      : formData.isEligible === false
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {formData.isEligible === true ? 'Lưu và hoàn thành' : 
                   formData.isEligible === false ? 'Lưu và từ chối' : 
                   'Lưu kết quả'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckFormModal;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart, User, Mail, Lock, Phone, Calendar, MapPin,
  Shield, Check, ArrowRight, ArrowLeft, ChevronRight,
  AlertCircle, CheckCircle, Eye, EyeOff, UserPlus
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input, { PasswordInput } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
  validateAge,
  validateWeight,
  validateIdNumber,
  validateAddress
} from '../../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',

    phone: '',
    dateOfBirth: '',
    gender: '',
    idNumber: '',
    address: '',

    bloodType: '',
    weight: '',
    height: '',
    medicalHistory: '',

    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },

    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToMarketing: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    { id: 1, title: 'Thông tin cơ bản', icon: User },
    { id: 2, title: 'Thông tin cá nhân', icon: UserPlus },
    { id: 3, title: 'Thông tin y tế', icon: Heart },
    { id: 4, title: 'Liên hệ khẩn cấp', icon: Phone },
    { id: 5, title: 'Xác nhận', icon: Shield }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        const firstNameValidation = validateName(formData.firstName);
        if (firstNameValidation !== true) newErrors.firstName = firstNameValidation;

        const lastNameValidation = validateName(formData.lastName);
        if (lastNameValidation !== true) newErrors.lastName = lastNameValidation;

        const emailValidation = validateEmail(formData.email);
        if (emailValidation !== true) newErrors.email = emailValidation;

        const passwordValidation = validatePassword(formData.password);
        if (passwordValidation !== true) newErrors.password = passwordValidation;

        const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
        if (confirmPasswordValidation !== true) newErrors.confirmPassword = confirmPasswordValidation;
        break;

      case 2:
        const phoneValidation = validatePhone(formData.phone);
        if (phoneValidation !== true) newErrors.phone = phoneValidation;

        const ageValidation = validateAge(formData.dateOfBirth);
        if (ageValidation !== true) newErrors.dateOfBirth = ageValidation;

        if (!formData.gender) newErrors.gender = 'Giới tính là bắt buộc';

        const idValidation = validateIdNumber(formData.idNumber);
        if (idValidation !== true) newErrors.idNumber = idValidation;

        const addressValidation = validateAddress(formData.address);
        if (addressValidation !== true) newErrors.address = addressValidation;
        break;

      case 3:
        if (!formData.bloodType) newErrors.bloodType = 'Nhóm máu là bắt buộc';

        const weightValidation = validateWeight(formData.weight);
        if (weightValidation !== true) newErrors.weight = weightValidation;

        if (!formData.height) newErrors.height = 'Chiều cao là bắt buộc';
        break;

      case 4:
        if (!formData.emergencyContact.name) newErrors['emergencyContact.name'] = 'Tên người liên hệ là bắt buộc';

        const emergencyPhoneValidation = validatePhone(formData.emergencyContact.phone);
        if (emergencyPhoneValidation !== true) newErrors['emergencyContact.phone'] = emergencyPhoneValidation;

        if (!formData.emergencyContact.relationship) newErrors['emergencyContact.relationship'] = 'Mối quan hệ là bắt buộc';
        break;

      case 5:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
        if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'Bạn phải đồng ý với chính sách bảo mật';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);

    try {
      const result = await register(formData);

      if (result.success) {
        navigate(ROUTES.HOME);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Họ"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Nhập họ"
                error={errors.firstName}
                required
              />
              <Input
                label="Tên"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Nhập tên"
                error={errors.lastName}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Nhập email"
              error={errors.email}
              icon={<Mail />}
              required
            />

            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Nhập mật khẩu"
                error={errors.password}
                icon={<Lock />}
                required
                helperText="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Nhập lại mật khẩu"
                error={errors.confirmPassword}
                icon={<Lock />}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Input
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Nhập số điện thoại"
              error={errors.phone}
              icon={<Phone />}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ngày sinh"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
                required
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`input-field ${errors.gender ? 'border-red-500' : ''}`}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <Input
              label="Số CMND/CCCD"
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              placeholder="Nhập số CMND/CCCD"
              error={errors.idNumber}
              required
            />

            <Input
              label="Địa chỉ"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Nhập địa chỉ đầy đủ"
              error={errors.address}
              icon={<MapPin />}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhóm máu *
                </label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                  className={`input-field ${errors.bloodType ? 'border-red-500' : ''}`}
                >
                  <option value="">Chọn nhóm máu</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodType && (
                  <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>
                )}
              </div>

              <Input
                label="Cân nặng (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="Nhập cân nặng"
                error={errors.weight}
                required
                min="45"
                max="200"
              />
            </div>

            <Input
              label="Chiều cao (cm)"
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              placeholder="Nhập chiều cao"
              error={errors.height}
              required
              min="140"
              max="220"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiền sử bệnh lý (không bắt buộc)
              </label>
              <textarea
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                placeholder="Mô tả các bệnh lý đã từng mắc (nếu có)..."
                rows={4}
                className="input-field"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Thông tin liên hệ khẩn cấp</p>
                  <p className="text-sm text-yellow-700">
                    Thông tin này sẽ được sử dụng trong trường hợp cấp cứu khi bạn hiến máu.
                  </p>
                </div>
              </div>
            </div>

            <Input
              label="Họ tên người liên hệ"
              value={formData.emergencyContact.name}
              onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
              placeholder="Nhập họ tên"
              error={errors['emergencyContact.name']}
              icon={<User />}
              required
            />

            <Input
              label="Số điện thoại"
              value={formData.emergencyContact.phone}
              onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
              placeholder="Nhập số điện thoại"
              error={errors['emergencyContact.phone']}
              icon={<Phone />}
              required
            />

            <Input
              label="Mối quan hệ"
              value={formData.emergencyContact.relationship}
              onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
              placeholder="Ví dụ: Vợ/chồng, Con, Bố/mẹ..."
              error={errors['emergencyContact.relationship']}
              required
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Xác nhận thông tin</h3>
              <p className="text-gray-600">Vui lòng xem lại và xác nhận thông tin trước khi hoàn tất đăng ký</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nhóm máu:</span>
                <span className="font-medium text-red-600">{formData.bloodType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Người liên hệ khẩn cấp:</span>
                <span className="font-medium">{formData.emergencyContact.name}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="text-red-600 hover:text-red-700 font-medium">
                    Điều khoản sử dụng
                  </Link>{' '}
                  của BloodConnect *
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm ml-6">{errors.agreeToTerms}</p>
              )}

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToPrivacy}
                  onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  Tôi đồng ý với{' '}
                  <Link to="/privacy" className="text-red-600 hover:text-red-700 font-medium">
                    Chính sách bảo mật
                  </Link>{' '}
                  và cho phép xử lý dữ liệu cá nhân *
                </span>
              </label>
              {errors.agreeToPrivacy && (
                <p className="text-red-500 text-sm ml-6">{errors.agreeToPrivacy}</p>
              )}

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToMarketing}
                  onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  Tôi muốn nhận thông tin về các chương trình hiến máu và ưu đãi từ BloodConnect
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center space-x-2 mb-6">
            <div className="relative">
              <Heart className="w-10 h-10 text-red-500" fill="currentColor" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              BloodConnect
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản mới</h1>
          <p className="text-gray-600">Tham gia cộng đồng hiến máu để cứu sống nhiều người</p>
        </div>

        <div className="mb-8 ">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center flex-1 overflow-hidden">
                  <div className={`relative top-1 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 mb-2 ${isCompleted ? 'bg-green-500 border-green-500 text-white shadow-lg' :
                      isActive ? 'bg-red-500 border-red-500 text-white shadow-lg scale-110' :
                        'bg-white border-gray-300 text-gray-400'
                    }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>

                  <div className="text-center">
                    <p className={`text-sm font-medium transition-colors ${isActive ? 'text-red-600' :
                        isCompleted ? 'text-green-600' :
                          'text-gray-500'
                      }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Bước {step.id}
                    </p>
                  </div>

                
                </div>
              );
            })}
          </div>

          <div className="text-center bg-gradient-to-r from-red-50 to-pink-50 rounded-lg py-4 px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{steps[currentStep - 1]?.title}</h2>
            <p className="text-sm text-gray-600">Hoàn thành bước {currentStep} trên tổng số {steps.length} bước</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          {renderStep()}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  icon={<ArrowLeft />}
                  iconPosition="left"
                >
                  Quay lại
                </Button>
              ) : (
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" icon={<ArrowLeft />} iconPosition="left">
                    Đã có tài khoản?
                  </Button>
                </Link>
              )}
            </div>

            <div>
              {currentStep < 5 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  icon={<ArrowRight />}
                  iconPosition="right"
                >
                  Tiếp tục
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  icon={<CheckCircle />}
                  iconPosition="right"
                >
                  {isSubmitting ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Bảo mật SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Hoàn toàn miễn phí</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Xác thực nhanh chóng</span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Bằng cách đăng ký, bạn xác nhận rằng bạn đã đọc và hiểu{' '}
            <Link to="/terms" className="text-red-600 hover:text-red-700">
              Điều khoản sử dụng
            </Link>
            {' '}và{' '}
            <Link to="/privacy" className="text-red-600 hover:text-red-700">
              Chính sách bảo mật
            </Link>
            {' '}của chúng tôi.
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Cần hỗ trợ?</p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <button className="text-red-600 hover:text-red-700 font-medium">
              Chat với chúng tôi
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-red-600 hover:text-red-700 font-medium">
              Gọi 1900 1234
            </button>
            <span className="text-gray-400">|</span>
            <Link to="/faq" className="text-red-600 hover:text-red-700 font-medium">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
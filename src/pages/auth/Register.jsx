import React, { useState, useEffect } from 'react';
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
import { login, register } from '../../services/authService';
import { getBloodTypes } from '../../services/bloodTypeService';
import { updateUser } from '../../services/userService';
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
import { getStoredAuth, setStoredAuth } from '../../utils/storage';

const Register = () => {
  const navigate = useNavigate();
  const auth = getStoredAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [bloodTypes, setBloodTypes] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',

    dateOfBirth: '',
    gender: '',
    address: '',
    latitude: 0.1,
    longitude: 0.1,

    bloodTypeId: '',

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
    { id: 4, title: 'Xác nhận', icon: Shield }
  ];

  useEffect(() => {
    if (isRegistered && currentStep >= 2) {
      loadBloodTypes();
    }
  }, [isRegistered, currentStep]);

  const loadBloodTypes = async () => {
    try {
      const response = await getBloodTypes();
      setBloodTypes(response.data.data.content || []);
    } catch (error) {
      console.error('Error loading blood types:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        const fullNameValidation = validateName(formData.fullName);
        if (fullNameValidation !== true) newErrors.fullName = fullNameValidation;

        const emailValidation = validateEmail(formData.email);
        if (emailValidation !== true) newErrors.email = emailValidation;

        const passwordValidation = validatePassword(formData.password);
        if (passwordValidation !== true) newErrors.password = passwordValidation;

        const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
        if (confirmPasswordValidation !== true) newErrors.confirmPassword = confirmPasswordValidation;

        const phoneValidation = validatePhone(formData.phoneNumber);
        if (phoneValidation !== true) newErrors.phoneNumber = phoneValidation;
        break;

      case 2:
        const ageValidation = validateAge(formData.dateOfBirth);
        if (ageValidation !== true) newErrors.dateOfBirth = ageValidation;

        if (!formData.gender) newErrors.gender = 'Giới tính là bắt buộc';

        const addressValidation = validateAddress(formData.address);
        if (addressValidation !== true) newErrors.address = addressValidation;
        break;

      case 3:
        break;

      case 4:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
        if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'Bạn phải đồng ý với chính sách bảo mật';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 1 && !isRegistered) {
      setIsSubmitting(true);
      try {
        const registerData = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber
        };


        const registerResult = await register(registerData);

        if (registerResult.status === 200 || registerResult.status === 201) {

          const loginResult = await login({
            email: formData.email,
            password: formData.password,
          });
          const { user, token } = loginResult.data.data;
          setStoredAuth({ token, user });

          if (loginResult.status === 200) {
            setIsRegistered(true);
            setCurrentStep(2);
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ general: 'Đăng ký thất bại. Vui lòng thử lại.' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentStep === 2 && isRegistered && auth?.user?.id) {
      setIsSubmitting(true);
      try {
        const updateData = {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          gender: formData.gender.toUpperCase(), 
          dateOfBirth: formData.dateOfBirth,
          latitude: formData.latitude,
          longitude: formData.longitude
        };

        const updateResult = await updateUser(auth.user.id, updateData);

        if (updateResult.status === 200 || updateResult.status === 201) {
          setCurrentStep(3);
        }
      } catch (error) {
        console.error('Update user error:', error);
        setErrors({ general: 'Cập nhật thông tin thất bại. Vui lòng thử lại.' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentStep === 3 && isRegistered && auth?.user?.id) {
      setIsSubmitting(true);
      try {
        const updateData = {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          gender: formData.gender.toUpperCase(),
          dateOfBirth: formData.dateOfBirth,
          latitude: formData.latitude,
          longitude: formData.longitude
        };

        if (formData.bloodTypeId) {
          updateData.bloodTypeId = parseInt(formData.bloodTypeId);
        }

        const updateResult = await updateUser(auth.user.id, updateData);

        if (updateResult.status === 200) {
          setCurrentStep(4);
        }
      } catch (error) {
        console.error('Update blood type error:', error);
        setErrors({ general: 'Cập nhật thông tin thất bại. Vui lòng thử lại.' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    navigate(ROUTES.HOME);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="Họ và tên"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Nhập họ và tên đầy đủ"
              error={errors.fullName}
              required
            />

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

            <Input
              label="Số điện thoại"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Nhập số điện thoại"
              error={errors.phoneNumber}
              icon={<Phone />}
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

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
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
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <Input
              label="Địa chỉ"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Nhập địa chỉ đầy đủ"
              error={errors.address}
              icon={<MapPin />}
              required
            />

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Thông tin nhóm máu (không bắt buộc)</p>
                  <p className="text-sm text-blue-700">
                    Nếu bạn không biết nhóm máu của mình, bạn có thể bỏ qua phần này và cập nhật sau.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm máu (tùy chọn)
              </label>
              <select
                value={formData.bloodTypeId}
                onChange={(e) => handleInputChange('bloodTypeId', e.target.value)}
                className="input-field"
              >
                <option value="">Chọn nhóm máu (có thể bỏ qua)</option>
                {bloodTypes.map((bloodType) => (
                  <option key={bloodType.id} value={bloodType.id}>
                    {bloodType.typeName}
                  </option>
                ))}
              </select>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Xác nhận thông tin</h3>
              <p className="text-gray-600">Vui lòng xem lại và xác nhận thông tin trước khi hoàn tất đăng ký</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{formData.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nhóm máu:</span>
                <span className="font-medium text-red-600">
                  {formData.bloodTypeId
                    ? bloodTypes.find(bt => bt.id == formData.bloodTypeId)?.typeName?.replace('_', '') || ''
                    : 'Chưa cập nhật'
                  }
                </span>
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

        <div className="mb-8">
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
                  disabled={isSubmitting}
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
              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  icon={<ArrowRight />}
                  iconPosition="right"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Tiếp tục'}
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
                  {isSubmitting ? 'Đang hoàn tất...' : 'Hoàn tất đăng ký'}
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
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Heart, Lock, Eye, EyeOff, CheckCircle, 
  AlertCircle, ArrowRight, Shield, Check
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ROUTES } from '../../utils/constants';
import { validatePassword, validatePasswordConfirmation } from '../../utils/validators';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false
  });

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        return;
      }
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
      }
    };
    
    checkToken();
  }, [token]);

  useEffect(() => {
    const password = formData.password;
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password)
    });
  }, [formData.password]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation !== true) {
      newErrors.password = passwordValidation;
    }
    
    const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
    if (confirmPasswordValidation !== true) {
      newErrors.confirmPassword = confirmPasswordValidation;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate(ROUTES.LOGIN, {
          state: { message: 'Mật khẩu đã được cập nhật thành công. Vui lòng đăng nhập.' }
        });
      }, 3000);
      
    } catch (error) {
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = (isValid) => {
    return isValid ? 'text-green-600' : 'text-gray-400';
  };

  const getStrengthIcon = (isValid) => {
    return isValid ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-300 rounded-full" />;
  };

  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <Link to={ROUTES.HOME} className="inline-flex items-center space-x-2 mb-6">
              <Heart className="w-10 h-10 text-red-500" fill="currentColor" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                BloodConnect
              </span>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Link không hợp lệ</h1>
            
            <p className="text-gray-600 mb-6">
              Link khôi phục mật khẩu không hợp lệ hoặc đã hết hạn. 
              Vui lòng yêu cầu link mới.
            </p>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
              >
                Yêu cầu link mới
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Quay lại đăng nhập
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <Link to={ROUTES.HOME} className="inline-flex items-center space-x-2 mb-6">
              <Heart className="w-10 h-10 text-red-500" fill="currentColor" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                BloodConnect
              </span>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Thành công!</h1>
            
            <p className="text-gray-600 mb-6">
              Mật khẩu của bạn đã được cập nhật thành công. 
              Bạn sẽ được chuyển đến trang đăng nhập sau giây lát.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
              <span>Đang chuyển hướng...</span>
            </div>
            
            <div className="mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Đăng nhập ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h1>
          <p className="text-gray-600">Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Mật khẩu mới"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Nhập mật khẩu mới"
                error={errors.password}
                icon={<Lock />}
                iconPosition="left"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Mật khẩu phải có:</p>
              <div className="space-y-2">
                <div className={`flex items-center space-x-2 text-sm ${getStrengthColor(passwordStrength.hasLength)}`}>
                  {getStrengthIcon(passwordStrength.hasLength)}
                  <span>Ít nhất 8 ký tự</span>
                </div>
                <div className={`flex items-center space-x-2 text-sm ${getStrengthColor(passwordStrength.hasUpper)}`}>
                  {getStrengthIcon(passwordStrength.hasUpper)}
                  <span>Ít nhất 1 chữ hoa</span>
                </div>
                <div className={`flex items-center space-x-2 text-sm ${getStrengthColor(passwordStrength.hasLower)}`}>
                  {getStrengthIcon(passwordStrength.hasLower)}
                  <span>Ít nhất 1 chữ thường</span>
                </div>
                <div className={`flex items-center space-x-2 text-sm ${getStrengthColor(passwordStrength.hasNumber)}`}>
                  {getStrengthIcon(passwordStrength.hasNumber)}
                  <span>Ít nhất 1 số</span>
                </div>
                <div className={`flex items-center space-x-2 text-sm ${getStrengthColor(passwordStrength.hasSpecial)}`}>
                  {getStrengthIcon(passwordStrength.hasSpecial)}
                  <span>Ký tự đặc biệt (@$!%*?&)</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Input
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                error={errors.confirmPassword}
                icon={<Lock />}
                iconPosition="left"
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

            {errors.submit && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.submit}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting || !Object.values(passwordStrength).every(Boolean)}
              icon={<ArrowRight />}
              iconPosition="right"
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Bảo mật tài khoản:</p>
                <ul className="space-y-1">
                  <li>• Không chia sẻ mật khẩu với ai</li>
                  <li>• Sử dụng mật khẩu khác nhau cho các tài khoản</li>
                  <li>• Đăng xuất khỏi các thiết bị công cộng</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link 
              to={ROUTES.LOGIN}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-2">Cần hỗ trợ?</p>
          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
            Liên hệ hỗ trợ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
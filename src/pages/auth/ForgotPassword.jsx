import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Mail, ArrowLeft, Send, CheckCircle, 
  Clock, RefreshCw, AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ROUTES } from '../../utils/constants';
import { validateEmail } from '../../utils/validators';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailValidation = validateEmail(email);
    if (emailValidation !== true) {
      setError(emailValidation);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
      setCountdown(60); 
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setError('Không thể gửi lại email. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex items-center justify-center p-4">
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
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Email đã được gửi!</h1>
            
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-900">{email}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Email có thể mất 1-2 phút để đến hộp thư của bạn</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">Không thấy email?</p>
                <ul className="text-left space-y-1 max-w-xs mx-auto">
                  <li>• Kiểm tra thư mục Spam/Junk</li>
                  <li>• Đảm bảo email được viết đúng</li>
                  <li>• Thử gửi lại sau {countdown > 0 ? `${countdown}s` : 'vài giây'}</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={handleResend}
                disabled={countdown > 0 || isSubmitting}
                loading={isSubmitting}
                icon={<RefreshCw />}
              >
                {countdown > 0 
                  ? `Gửi lại sau ${countdown}s` 
                  : isSubmitting 
                    ? 'Đang gửi...' 
                    : 'Gửi lại email'
                }
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                  setCountdown(0);
                }}
                icon={<ArrowLeft />}
              >
                Thử email khác
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link 
              to={ROUTES.LOGIN}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              ← Quay lại đăng nhập
            </Link>
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h1>
          <p className="text-gray-600">Nhập email để nhận hướng dẫn khôi phục mật khẩu</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Nhập email của bạn"
              error={error}
              icon={<Mail />}
              iconPosition="left"
              required
              autoFocus
            />
            
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting || !email}
              icon={<Send />}
              iconPosition="right"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi hướng dẫn'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Lưu ý:</p>
                <ul className="space-y-1">
                  <li>• Email khôi phục sẽ có hiệu lực trong 15 phút</li>
                  <li>• Kiểm tra cả thư mục Spam nếu không thấy email</li>
                  <li>• Liên hệ hỗ trợ nếu vẫn gặp vấn đề</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link 
              to={ROUTES.LOGIN}
              className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại đăng nhập</span>
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-2">Cần hỗ trợ?</p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <button className="text-red-600 hover:text-red-700 font-medium">
              Chat với chúng tôi
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-red-600 hover:text-red-700 font-medium">
              Gọi 1900 1234
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
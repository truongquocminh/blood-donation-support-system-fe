// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { 
//   Heart, Mail, Lock, Eye, EyeOff, ArrowRight, 
//   Facebook, Chrome, Apple, Shield, AlertCircle
// } from 'lucide-react';
// import Button from '../../components/ui/Button';
// import Input from '../../components/ui/Input';
// import { useAuth } from '../../hooks/useAuth';
// import { ROUTES } from '../../utils/constants';
// import { validateEmail } from '../../utils/validators';

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login, loading } = useAuth();
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });
  
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const from = location.state?.from || ROUTES.HOME;

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.email) {
//       newErrors.email = 'Email là bắt buộc';
//     } else {
//       const emailValidation = validateEmail(formData.email);
//       if (emailValidation !== true) {
//         newErrors.email = emailValidation;
//       }
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Mật khẩu là bắt buộc';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setIsSubmitting(true);
//     setErrors({});
    
//     try {
//       const result = await login({
//         email: formData.email,
//         password: formData.password,
//         rememberMe: formData.rememberMe
//       });
      
//       if (result.success) {
//         navigate(from, { replace: true });
//       } else {
//         setErrors(prev => ({
//           ...prev,
//           general: result.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
//         }));
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setErrors(prev => ({
//         ...prev,
//         general: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
//       }));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSocialLogin = (provider) => {
//     console.log(`Login with ${provider}`);
//     // Implement social login logic here
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex items-center justify-center p-4">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
//       </div>

//       <div className="relative w-full max-w-md">
//         <div className="text-center mb-8">
//           <Link to={ROUTES.HOME} className="inline-flex items-center space-x-2 mb-6">
//             <div className="relative">
//               <Heart className="w-10 h-10 text-red-500" fill="currentColor" />
//               <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
//             </div>
//             <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//               BloodConnect
//             </span>
//           </Link>
          
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h1>
//           <p className="text-gray-600">Đăng nhập để tiếp tục hành trình hiến máu</p>
//         </div>

//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {errors.general && (
//               <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2">
//                 <AlertCircle className="w-5 h-5 text-red-500" />
//                 <p className="text-sm text-red-600">{errors.general}</p>
//               </div>
//             )}
            
//             <Input
//               label="Email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => handleInputChange('email', e.target.value)}
//               placeholder="Nhập email của bạn"
//               error={errors.email}
//               icon={<Mail />}
//               iconPosition="left"
//               required
//             />

//             <div className="relative">
//               <Input
//                 label="Mật khẩu"
//                 type={showPassword ? 'text' : 'password'}
//                 value={formData.password}
//                 onChange={(e) => handleInputChange('password', e.target.value)}
//                 placeholder="Nhập mật khẩu"
//                 error={errors.password}
//                 icon={<Lock />}
//                 iconPosition="left"
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.rememberMe}
//                   onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
//                   className="rounded border-gray-300 text-red-600 focus:ring-red-500"
//                 />
//                 <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
//               </label>
              
//               <Link 
//                 to={ROUTES.FORGOT_PASSWORD}
//                 className="text-sm text-red-600 hover:text-red-700 font-medium"
//               >
//                 Quên mật khẩu?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               variant="primary"
//               size="lg"
//               fullWidth
//               loading={isSubmitting || loading}
//               disabled={isSubmitting || loading}
//               icon={<ArrowRight />}
//               iconPosition="right"
//             >
//               {isSubmitting || loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
//             </Button>
//           </form>

//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-3">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handleSocialLogin('google')}
//               icon={<Chrome />}
//               className="flex-1"
//             >
//               Google
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handleSocialLogin('facebook')}
//               icon={<Facebook />}
//               className="flex-1"
//             >
//               Facebook
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handleSocialLogin('apple')}
//               icon={<Apple />}
//               className="flex-1"
//             >
//               Apple
//             </Button>
//           </div>

//           <div className="text-center mt-6">
//             <p className="text-gray-600">
//               Chưa có tài khoản?{' '}
//               <Link 
//                 to={ROUTES.REGISTER}
//                 className="font-medium text-red-600 hover:text-red-700"
//               >
//                 Đăng ký ngay
//               </Link>
//             </p>
//           </div>
//         </div>

//         <div className="mt-6 text-center">
//           <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
//             <Shield className="w-4 h-4" />
//             <span>Kết nối được bảo mật với SSL</span>
//           </div>
//         </div>

//         <div className="mt-4 text-center">
//           <p className="text-xs text-gray-500">
//             Bằng cách đăng nhập, bạn đồng ý với{' '}
//             <Link to="/terms" className="text-red-600 hover:text-red-700">
//               Điều khoản sử dụng
//             </Link>
//             {' '}và{' '}
//             <Link to="/privacy" className="text-red-600 hover:text-red-700">
//               Chính sách bảo mật
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, Mail, Lock, Eye, EyeOff, ArrowRight, 
  Facebook, Chrome, Apple, Shield, AlertCircle, Info
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ROUTES, ROLES } from '../../utils/constants';
import { validateEmail } from '../../utils/validators';

// Mock user data for testing
const MOCK_USERS = {
  'admin@bloodconnect.com': {
    email: 'admin@bloodconnect.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    name: 'Admin User'
  },
  'staff@bloodconnect.com': {
    email: 'staff@bloodconnect.com',
    password: 'staff123',
    role: ROLES.STAFF,
    name: 'Staff User'
  },
  'member@bloodconnect.com': {
    email: 'member@bloodconnect.com',
    password: 'member123',
    role: ROLES.MEMBER,
    name: 'Member User'
  },
  'guest@bloodconnect.com': {
    email: 'guest@bloodconnect.com',
    password: 'guest123',
    role: ROLES.GUEST,
    name: 'Guest User'
  }
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from || ROUTES.HOME;

  const getDefaultRoute = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return ROUTES.ADMIN_DASHBOARD;
      case ROLES.STAFF:
        return ROUTES.STAFF_DASHBOARD;
      case ROLES.MEMBER:
        return ROUTES.MEMBER_DASHBOARD;
      default:
        return ROUTES.HOME;
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else {
      const emailValidation = validateEmail(formData.email);
      if (emailValidation !== true) {
        newErrors.email = emailValidation;
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mockLogin = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS[email.toLowerCase()];
    
    if (!user) {
      throw new Error('Email không tồn tại trong hệ thống');
    }
    
    if (user.password !== password) {
      throw new Error('Mật khẩu không chính xác');
    }
    
    const userData = {
      email: user.email,
      name: user.name,
      role: user.role,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    return {
      success: true,
      user: userData
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const result = await mockLogin(formData.email, formData.password);
      
      if (result.success) {
        const targetRoute = getDefaultRoute(result.user.role);
        navigate(targetRoute, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  const handleQuickLogin = (userType) => {
    const userData = Object.values(MOCK_USERS).find(user => user.role === userType);
    if (userData) {
      setFormData({
        email: userData.email,
        password: userData.password,
        rememberMe: false
      });
    }
  };

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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h1>
          <p className="text-gray-600">Đăng nhập để tiếp tục hành trình hiến máu</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-2">Tài khoản demo:</h3>
              <div className="space-y-1 text-xs text-blue-700">
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleQuickLogin(ROLES.ADMIN)}
                    className="text-left hover:underline"
                  >
                    <strong>Admin:</strong> admin@bloodconnect.com / admin123
                  </button>
                  <button 
                    onClick={() => handleQuickLogin(ROLES.STAFF)}
                    className="text-left hover:underline"
                  >
                    <strong>Staff:</strong> staff@bloodconnect.com / staff123
                  </button>
                  <button 
                    onClick={() => handleQuickLogin(ROLES.MEMBER)}
                    className="text-left hover:underline"
                  >
                    <strong>Member:</strong> member@bloodconnect.com / member123
                  </button>
                  <button 
                    onClick={() => handleQuickLogin(ROLES.GUEST)}
                    className="text-left hover:underline"
                  >
                    <strong>Guest:</strong> guest@bloodconnect.com / guest123
                  </button>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">Click vào tài khoản để tự động điền thông tin</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Nhập email của bạn"
              error={errors.email}
              icon={<Mail />}
              iconPosition="left"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              
              <Link 
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
              icon={<ArrowRight />}
              iconPosition="right"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin('google')}
              icon={<Chrome />}
              className="flex-1"
            >
              Google
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin('facebook')}
              icon={<Facebook />}
              className="flex-1"
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin('apple')}
              icon={<Apple />}
              className="flex-1"
            >
              Apple
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link 
                to={ROUTES.REGISTER}
                className="font-medium text-red-600 hover:text-red-700"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Kết nối được bảo mật với SSL</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <Link to="/terms" className="text-red-600 hover:text-red-700">
              Điều khoản sử dụng
            </Link>
            {' '}và{' '}
            <Link to="/privacy" className="text-red-600 hover:text-red-700">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
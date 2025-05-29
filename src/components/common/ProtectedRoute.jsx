import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

import { ROUTES } from '../../utils/constants';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  requireEmailVerification = false,
  fallbackPath = ROUTES.LOGIN,
  showUnauthorized = true 
}) => {
  const { user, isAuthenticated, loading, hasAnyRole, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  if (requireEmailVerification && !user?.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Xác thực email cần thiết
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần xác thực email để truy cập trang này. Vui lòng kiểm tra hộp thư và click vào link xác thực.
          </p>
          <button className="btn-primary">
            Gửi lại email xác thực
          </button>
        </div>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    if (!showUnauthorized) {
      return <Navigate to={ROUTES.HOME} replace />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="btn-outline"
            >
              Quay lại
            </button>
            <button 
              onClick={() => window.location.href = ROUTES.HOME}
              className="btn-primary"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      if (!showUnauthorized) {
        return <Navigate to={ROUTES.HOME} replace />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Thiếu quyền cần thiết
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn không có đủ quyền để thực hiện hành động này.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="btn-primary"
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export const withRoleProtection = (Component, allowedRoles) => {
  return (props) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export const withPermissionProtection = (Component, requiredPermissions) => {
  return (props) => (
    <ProtectedRoute requiredPermissions={requiredPermissions}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
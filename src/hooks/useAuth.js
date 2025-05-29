import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context object containing:
 * - user: Current user object
 * - token: JWT token
 * - loading: Loading state
 * - error: Error state
 * - isAuthenticated: Authentication state
 * - login: Login function
 * - register: Register function
 * - logout: Logout function
 * - updateUser: Update user function
 * - clearError: Clear error function
 * - initializeAuth: Initialize auth function
 * - hasRole: Check if user has role
 * - hasAnyRole: Check if user has any of roles
 * - hasPermission: Check if user has permission
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    login,
    register,
    logout,
    updateUser,
    clearError,
    initializeAuth,
    
    hasRole,
    hasAnyRole,
    hasPermission,
  } = context;

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    login,
    register,
    logout,
    updateUser,
    clearError,
    initializeAuth,
    
    hasRole,
    hasAnyRole,
    hasPermission,
  };
};

export default useAuth;
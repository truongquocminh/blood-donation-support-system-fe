import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

import * as authService from '../services/authService';

import { getStoredAuth, setStoredAuth, removeStoredAuth } from '../utils/storage';
import { ROLES } from '../utils/constants';

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_INITIALIZE: 'AUTH_INITIALIZE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };

    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.AUTH_LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case AUTH_ACTIONS.AUTH_INITIALIZE:
      return {
        ...state,
        loading: false,
        user: action.payload?.user || null,
        token: action.payload?.token || null,
        isAuthenticated: !!action.payload?.user,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    default:
      return state;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const initializeAuth = useCallback(async () => {
    try {
      const storedAuth = getStoredAuth();

      if (storedAuth?.token && storedAuth?.user) {
        try {

          const userData = {
            user: storedAuth.user,
            token: storedAuth?.token,
          };

          setStoredAuth(userData);

          dispatch({
            type: AUTH_ACTIONS.AUTH_INITIALIZE,
            payload: userData,
          });
        } catch (error) {
          console.error('Token refresh failed:', error);
          removeStoredAuth();
          dispatch({
            type: AUTH_ACTIONS.AUTH_INITIALIZE,
            payload: null,
          });
        }
      } else {
        dispatch({
          type: AUTH_ACTIONS.AUTH_INITIALIZE,
          payload: null,
        });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      removeStoredAuth();
      dispatch({
        type: AUTH_ACTIONS.AUTH_INITIALIZE,
        payload: null,
      });
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });

      const response = await authService.login(credentials);
      const { user, token, refresh_token } = response.data.data;
      setStoredAuth({ token, user });

      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: { user, token },
      });

      toast.success(`Chào mừng ${user.fullName || user.email}!`);
      return { success: true };

    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Đăng nhập thất bại';

      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });

      const response = await authService.register(userData);

      const { user, token } = response.data.data || response;

      setStoredAuth({ token, user });

      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: { user, token },
      });

      toast.success('Đăng ký thành công!');
      return { success: true };

    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Đăng ký thất bại';

      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeStoredAuth();
      dispatch({ type: AUTH_ACTIONS.AUTH_LOGOUT });
      toast.success('Đăng xuất thành công!');
    }
  }, []);

  const updateUser = useCallback((userData) => {
    const updatedUser = { ...state.user, ...userData };

    // Cập nhật storage
    const storedAuth = getStoredAuth();
    if (storedAuth) {
      setStoredAuth({ ...storedAuth, user: updatedUser });
    }

    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
  }, [state.user]);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const hasRole = useCallback((role) => {
    return state.user?.role === role;
  }, [state.user]);

  const hasAnyRole = useCallback((roles) => {
    return roles.includes(state.user?.role);
  }, [state.user]);

  const hasPermission = useCallback((permission) => {
    if (!state.user) return false;

    if (state.user.role === ROLES.ADMIN) return true;

    return state.user.permissions?.includes(permission) || false;
  }, [state.user]);

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
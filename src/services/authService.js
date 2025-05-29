import { apiPost, apiGet, apiPut } from './api';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY_TOKEN: '/auth/verify',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
};

export const login = async (credentials) => {
  const { email, password, rememberMe } = credentials;
  
  return apiPost(AUTH_ENDPOINTS.LOGIN, {
    email,
    password,
    rememberMe,
  });
};

export const register = async (userData) => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    bloodType,
    address,
    emergencyContact,
    medicalHistory,
    agreeToTerms,
  } = userData;

  return apiPost(AUTH_ENDPOINTS.REGISTER, {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    bloodType,
    address,
    emergencyContact,
    medicalHistory,
    agreeToTerms,
  });
};

export const logout = async () => {
  return apiPost(AUTH_ENDPOINTS.LOGOUT);
};

export const refreshToken = async (refreshToken) => {
  return apiPost(AUTH_ENDPOINTS.REFRESH, {
    refreshToken,
  });
};

export const verifyToken = async (token) => {
  return apiGet(AUTH_ENDPOINTS.VERIFY_TOKEN, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const forgotPassword = async (email) => {
  return apiPost(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
    email,
  });
};

export const resetPassword = async (resetData) => {
  const { token, password, confirmPassword } = resetData;
  
  return apiPost(AUTH_ENDPOINTS.RESET_PASSWORD, {
    token,
    password,
    confirmPassword,
  });
};

export const changePassword = async (passwordData) => {
  const { currentPassword, newPassword, confirmPassword } = passwordData;
  
  return apiPut(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
    currentPassword,
    newPassword,
    confirmPassword,
  });
};

export const verifyEmail = async (token) => {
  return apiPost(AUTH_ENDPOINTS.VERIFY_EMAIL, {
    token,
  });
};

export const resendVerification = async (email) => {
  return apiPost(AUTH_ENDPOINTS.RESEND_VERIFICATION, {
    email,
  });
};

export const socialLogin = async (provider, token) => {
  return apiPost(`/auth/social/${provider}`, {
    token,
  });
};

export const enableTwoFactor = async () => {
  return apiPost('/auth/2fa/enable');
};

export const disableTwoFactor = async (code) => {
  return apiPost('/auth/2fa/disable', {
    code,
  });
};

export const verifyTwoFactor = async (code) => {
  return apiPost('/auth/2fa/verify', {
    code,
  });
};

export const getActiveSessions = async () => {
  return apiGet('/auth/sessions');
};

export const revokeSession = async (sessionId) => {
  return apiPost(`/auth/sessions/${sessionId}/revoke`);
};

export const revokeAllSessions = async () => {
  return apiPost('/auth/sessions/revoke-all');
};

export const requestAccountVerification = async () => {
  return apiPost('/auth/verify-account');
};

export const submitVerificationDocuments = async (documents) => {
  const formData = new FormData();
  
  documents.forEach((doc, index) => {
    formData.append(`document_${index}`, doc.file);
    formData.append(`document_${index}_type`, doc.type);
  });
  
  return apiPost('/auth/verification-documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const requestAccountDeletion = async (reason) => {
  return apiPost('/auth/delete-account', {
    reason,
  });
};

export const cancelAccountDeletion = async () => {
  return apiPost('/auth/cancel-deletion');
};

export const updatePrivacySettings = async (settings) => {
  return apiPut('/auth/privacy-settings', settings);
};

export const getPrivacySettings = async () => {
  return apiGet('/auth/privacy-settings');
};

export const getLoginAttempts = async () => {
  return apiGet('/auth/login-attempts');
};

export const clearLoginAttempts = async () => {
  return apiPost('/auth/clear-login-attempts');
};

export const getRegisteredDevices = async () => {
  return apiGet('/auth/devices');
};

export const registerDevice = async (deviceInfo) => {
  return apiPost('/auth/devices', deviceInfo);
};

export const unregisterDevice = async (deviceId) => {
  return apiPost(`/auth/devices/${deviceId}/unregister`);
};

export const getSecurityQuestions = async () => {
  return apiGet('/auth/security-questions');
};

export const setSecurityQuestions = async (questions) => {
  return apiPost('/auth/security-questions', {
    questions,
  });
};

export const verifySecurityQuestions = async (answers) => {
  return apiPost('/auth/verify-security-questions', {
    answers,
  });
};

export const initiateAccountRecovery = async (email) => {
  return apiPost('/auth/account-recovery', {
    email,
  });
};

export const completeAccountRecovery = async (recoveryData) => {
  return apiPost('/auth/account-recovery/complete', recoveryData);
};

export const updateEmailPreferences = async (preferences) => {
  return apiPut('/auth/email-preferences', preferences);
};

export const getEmailPreferences = async () => {
  return apiGet('/auth/email-preferences');
};

export default {
  login,
  register,
  logout,
  refreshToken,
  verifyToken,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerification,
  socialLogin,
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactor,
  getActiveSessions,
  revokeSession,
  revokeAllSessions,
  requestAccountVerification,
  submitVerificationDocuments,
  requestAccountDeletion,
  cancelAccountDeletion,
  updatePrivacySettings,
  getPrivacySettings,
  getLoginAttempts,
  clearLoginAttempts,
  getRegisteredDevices,
  registerDevice,
  unregisterDevice,
  getSecurityQuestions,
  setSecurityQuestions,
  verifySecurityQuestions,
  initiateAccountRecovery,
  completeAccountRecovery,
  updateEmailPreferences,
  getEmailPreferences,
};
import { apiPost, apiGet, apiPut } from "./api";

const AUTH_ENDPOINTS = {
  LOGIN: "/v1/auth/login",
  REGISTER: "/v1/auth",
  LOGOUT: "/v1/auth/logout",
  REFRESH: "/v1/auth/refreshToken",
  RESET_PASSWORD: "/v1/auth/reset-password",
  CREATE_STAFF: "/v1/auth/staff",
};

export const login = async (credentials) => {
  const { email, password } = credentials;

  return apiPost(AUTH_ENDPOINTS.LOGIN, {
    email,
    password,
  });
};

export const register = async (userData) => {
  const { email, password, fullName, phoneNumber } = userData;

  return apiPost(AUTH_ENDPOINTS.REGISTER, {
    email,
    password,
    fullName,
    phoneNumber,
  });
};

export const logout = async () => {
  return apiPost(AUTH_ENDPOINTS.LOGOUT);
};

export const refreshToken = async () => {
  return apiPost(AUTH_ENDPOINTS.REFRESH);
};

export const resetPassword = async (resetData) => {
  const { email, password, otp } = resetData;

  return apiPost(AUTH_ENDPOINTS.RESET_PASSWORD, {
    email,
    password,
    otp,
  });
};

export const createStaff = async (staffData) => {
  const requestBody = {
    email: staffData.email,
    password: staffData.password,
    fullName: staffData.fullName,
    phoneNumber: staffData.phoneNumber,
  };

  return apiPost(AUTH_ENDPOINTS.CREATE_STAFF, requestBody);
};

export default {
  login,
  register,
  logout,
  refreshToken,
  resetPassword,
  createStaff,
};

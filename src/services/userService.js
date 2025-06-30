import { apiPost, apiGet, apiPut } from "./api";

const USER_ENDPOINTS = {
  GET_USERS: "/v1/user/getUser",
  GET_USER_BY_ID: "/v1/user", 
  UPDATE_USER: "/v1/user", 
  GET_CURRENT_USER: "/v1/user/me",
  GET_NEARBY_USERS: "/v1/user/nearby",
};

export const getUsers = async (page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });
  return apiGet(`${USER_ENDPOINTS.GET_USERS}?${params.toString()}`);
};

export const getUserById = async (userId) => {
  return apiGet(`${USER_ENDPOINTS.GET_USER_BY_ID}/${userId}`);
};

export const updateUser = async (userId, userData) => {
  return apiPut(`${USER_ENDPOINTS.UPDATE_USER}/${userId}`, userData);
};

export const getCurrentUser = async () => {
  return apiGet(USER_ENDPOINTS.GET_CURRENT_USER);
};

export const getNearbyUsers = async (lat, lon, radiusKm = 10, page = 0, size = 10) => {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    radiusKm: radiusKm.toString(),
    page: page.toString(),
    size: size.toString()
  });
  return apiGet(`${USER_ENDPOINTS.GET_NEARBY_USERS}?${params.toString()}`);
};

export default {
  getUsers,
  getUserById,
  updateUser,
  getCurrentUser,
  getNearbyUsers,
};
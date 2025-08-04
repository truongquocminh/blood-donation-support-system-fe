import { apiPost, apiGet, apiPut, apiDelete } from "./api";

const BLOOD_DONATION_INFO_ENDPOINTS = {
  CREATE_BLOOD_DONATION_INFO: "/v1/blood-donation-infor",
  UPDATE_BLOOD_DONATION_INFO: "/v1/blood-donation-infor",
  DELETE_BLOOD_DONATION_INFO: "/v1/blood-donation-infor",
  GET_ALL_BLOOD_DONATION_INFO: "/v1/blood-donation-infor",
  GET_USER_BLOOD_DONATION_INFO: "/v1/blood-donation-infor/user",
  GET_USER_TOTAL_VOLUME: "/v1/blood-donation-infor/user/total-volume",
  GET_APPOINTMENT_BLOOD_DONATION_INFO: "/v1/blood-donation-infor/appointment",
};

export const createBloodDonationInfo = async (bloodDonationData) => {
  const { 
    appointmentId,
    bloodTypeId,
    actualBloodVolume
  } = bloodDonationData;

  const payload = {
    appointmentId,
    bloodTypeId,
    actualBloodVolume,
  };

  return apiPost(BLOOD_DONATION_INFO_ENDPOINTS.CREATE_BLOOD_DONATION_INFO, payload);
};

export const updateBloodDonationInfo = async (id, bloodDonationData) => {
  const { 
    appointmentId,
    bloodTypeId,
    actualBloodVolume
  } = bloodDonationData;

  const payload = {
    appointmentId,
    bloodTypeId,
    actualBloodVolume,
  };

  return apiPut(`${BLOOD_DONATION_INFO_ENDPOINTS.UPDATE_BLOOD_DONATION_INFO}/${id}`, payload);
};

export const deleteBloodDonationInfo = async (id) => {
  return apiDelete(`${BLOOD_DONATION_INFO_ENDPOINTS.DELETE_BLOOD_DONATION_INFO}/${id}`);
};

export const getAllBloodDonationInfo = async (page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(
    `${BLOOD_DONATION_INFO_ENDPOINTS.GET_ALL_BLOOD_DONATION_INFO}?${params.toString()}`
  );
};

export const getUserBloodDonationInfo = async (page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(
    `${BLOOD_DONATION_INFO_ENDPOINTS.GET_USER_BLOOD_DONATION_INFO}?${params.toString()}`
  );
};

export const getUserTotalVolume = async () => {
  return apiGet(BLOOD_DONATION_INFO_ENDPOINTS.GET_USER_TOTAL_VOLUME);
};

export const getAppointmentBloodDonationInfo = async (appointmentId) => {
  return apiGet(`${BLOOD_DONATION_INFO_ENDPOINTS.GET_APPOINTMENT_BLOOD_DONATION_INFO}/${appointmentId}`);
};

export default {
  createBloodDonationInfo,
  updateBloodDonationInfo,
  deleteBloodDonationInfo,
  getAllBloodDonationInfo,
  getUserBloodDonationInfo,
  getUserTotalVolume,
  getAppointmentBloodDonationInfo,
};
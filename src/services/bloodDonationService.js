import { apiPost, apiGet } from "./api";

const BLOOD_DONATION_ENDPOINTS = {
  CREATE_BLOOD_DONATION: "/v1/blood-donation",
  GET_BLOOD_DONATIONS: "/v1/blood-donation",
  GET_BLOOD_DONATION_BY_ID: "/v1/blood-donation",
};

export const createBloodDonation = async (donationData) => {
  const {
    user,
    donationDate,
    bloodType,
    bloodComponent,
    volumeMl,
    status = "PENDING",
    healthCheck,
  } = donationData;

  const payload = {
    user,
    donationDate,
    bloodType,
    bloodComponent,
    volumeMl,
    status,
    healthCheck,
  };

  return apiPost(BLOOD_DONATION_ENDPOINTS.CREATE_BLOOD_DONATION, payload);
};

export const getBloodDonations = async (page = 0, size = 10) => {
  return apiGet(
    `${BLOOD_DONATION_ENDPOINTS.GET_BLOOD_DONATIONS}?page=${page}&size=${size}`
  );
};

export const getBloodDonationById = async (id) => {
  return apiGet(`${BLOOD_DONATION_ENDPOINTS.GET_BLOOD_DONATION_BY_ID}/${id}`);
};

export default {
  createBloodDonation,
  getBloodDonations,
  getBloodDonationById,
};

import { apiGet } from "./api";

const CERTIFICATE_ENDPOINTS = {
  GET_CERTIFICATES: "/v1/certificates",
  GET_CERTIFICATE_BY_ID: "/v1/certificates",
  GET_USER_CERTIFICATES: "/v1/certificates/user",
};

export const getCertificates = async (page = 0, size = 10) => {
  return apiGet(
    `${CERTIFICATE_ENDPOINTS.GET_CERTIFICATES}?page=${page}&size=${size}`
  );
};

export const getCertificateById = async (certificateId) => {
  return apiGet(
    `${CERTIFICATE_ENDPOINTS.GET_CERTIFICATE_BY_ID}/${certificateId}`
  );
};

export const getUserCertificates = async (userId, page = 0, size = 10) => {
  return apiGet(
    `${CERTIFICATE_ENDPOINTS.GET_USER_CERTIFICATES}?userId=${userId}&page=${page}&size=${size}`
  );
};

export default {
  getCertificates,
  getCertificateById,
  getUserCertificates,
};

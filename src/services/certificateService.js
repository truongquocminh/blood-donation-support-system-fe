import { apiGet } from "./api";

const CERTIFICATE_ENDPOINTS = {
  GET_CERTIFICATES: "/api/v1/certificates",
  GET_CERTIFICATE_BY_ID: "/api/v1/certificates",
  GET_USER_CERTIFICATES: "/api/v1/certificates/user",
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

export const getUserCertificates = async (page = 0, size = 10) => {
  return apiGet(
    `${CERTIFICATE_ENDPOINTS.GET_USER_CERTIFICATES}?page=${page}&size=${size}`
  );
};

export default {
  getCertificates,
  getCertificateById,
  getUserCertificates,
};

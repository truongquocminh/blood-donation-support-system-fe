import { apiGet } from "./api";
import { withTokenRefresh } from "./apiWrapper";

const BLOOD_TYPE_ENDPOINTS = {
  GET_BLOOD_TYPES: "/v1/blood-type",
};

const _getBloodTypes = async (page = 0, size = 100) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  return apiGet(`${BLOOD_TYPE_ENDPOINTS.GET_BLOOD_TYPES}?${params.toString()}`);
};

export const getBloodTypes = async (page = 0, size = 100) => {
  return withTokenRefresh(_getBloodTypes, page, size);
};

export default {
  getBloodTypes,
};
import { apiGet } from "./api";

const BLOOD_TYPE_ENDPOINTS = {
  GET_BLOOD_TYPES: "/v1/blood-type",
};

export const getBloodTypes = async (page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  return apiGet(`${BLOOD_TYPE_ENDPOINTS.GET_BLOOD_TYPES}?${params.toString()}`);
};

export default {
  getBloodTypes,
};
import { apiGet } from "./api";

const BLOOD_COMPONENT_ENDPOINTS = {
  GET_BLOOD_COMPONENTS: "/v1/blood-component",
};

export const getBloodComponents = async (page = 0, size = 100) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  return apiGet(`${BLOOD_COMPONENT_ENDPOINTS.GET_BLOOD_COMPONENTS}?${params.toString()}`);
};

export default {
  getBloodComponents,
};
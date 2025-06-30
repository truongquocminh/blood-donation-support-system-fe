import { apiGet, apiPost, apiPut, apiDelete } from "./api";

const BLOOD_COMPONENT_ENDPOINTS = {
  GET_BLOOD_COMPONENTS: "/v1/blood-component",
  CREATE_BLOOD_COMPONENT: "/v1/blood-component",
  UPDATE_BLOOD_COMPONENT: "/v1/blood-component",
  DELETE_BLOOD_COMPONENT: "/v1/blood-component"
};

export const getBloodComponents = async (page = 0, size = 100) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  return apiGet(`${BLOOD_COMPONENT_ENDPOINTS.GET_BLOOD_COMPONENTS}?${params.toString()}`);
};

export const createBloodComponent = async (componentData) => {
  const requestBody = {
    componentId: componentData.componentId,
    componentName: componentData.componentName
  };

  return apiPost(BLOOD_COMPONENT_ENDPOINTS.CREATE_BLOOD_COMPONENT, requestBody);
};

export const updateBloodComponent = async (id, componentData) => {
  const requestBody = {
    componentId: componentData.componentId,
    componentName: componentData.componentName
  };

  return apiPut(`${BLOOD_COMPONENT_ENDPOINTS.UPDATE_BLOOD_COMPONENT}/${id}`, requestBody);
};

export const deleteBloodComponent = async (id) => {
  return apiDelete(`${BLOOD_COMPONENT_ENDPOINTS.DELETE_BLOOD_COMPONENT}/${id}`);
};

export default {
  getBloodComponents,
  createBloodComponent,
  updateBloodComponent,
  deleteBloodComponent,
};
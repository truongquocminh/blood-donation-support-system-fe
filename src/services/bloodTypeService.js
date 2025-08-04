import { apiGet, apiPost, apiPut, apiDelete } from "./api";

const BLOOD_TYPE_ENDPOINTS = {
  GET_BLOOD_TYPES: "/v1/blood-type",
  CREATE_BLOOD_TYPE: "/v1/blood-type",
  UPDATE_BLOOD_TYPE: "/v1/blood-type",
  DELETE_BLOOD_TYPE: "/v1/blood-type",
  DELETE_COMPONENT_FROM_BLOOD_TYPE: "/v1/blood-type",
};

export const getBloodTypes = async (page = 0, size = 100) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(`${BLOOD_TYPE_ENDPOINTS.GET_BLOOD_TYPES}?${params.toString()}`);
};

export const createBloodType = async (bloodTypeData) => {
  const requestBody = {
    bloodTypeId: bloodTypeData.bloodTypeId,
    typeName: bloodTypeData.typeName,
    componentIds: bloodTypeData.componentIds || [],
  };

  return apiPost(BLOOD_TYPE_ENDPOINTS.CREATE_BLOOD_TYPE, requestBody);
};

export const updateBloodType = async (id, bloodTypeData) => {
  const requestBody = {
    bloodTypeId: bloodTypeData.bloodTypeId,
    typeName: bloodTypeData.typeName,
    componentIds: bloodTypeData.componentIds || [],
    canDonateTo: bloodTypeData.canDonateTo,
    canReceiveFrom: bloodTypeData.canReceiveFrom,
  };

  return apiPut(`${BLOOD_TYPE_ENDPOINTS.UPDATE_BLOOD_TYPE}/${id}`, requestBody);
};

export const deleteBloodType = async (id) => {
  return apiDelete(`${BLOOD_TYPE_ENDPOINTS.DELETE_BLOOD_TYPE}/${id}`);
};

export const removeComponentFromBloodType = async (
  bloodTypeId,
  componentId
) => {
  return apiDelete(
    `${BLOOD_TYPE_ENDPOINTS.DELETE_COMPONENT_FROM_BLOOD_TYPE}/${bloodTypeId}/components/${componentId}`
  );
};

export default {
  getBloodTypes,
  createBloodType,
  updateBloodType,
  deleteBloodType,
  removeComponentFromBloodType,
};

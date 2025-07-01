import { apiPost, apiGet, apiPut, apiDelete } from "./api";

const BLOOD_REQUEST_ENDPOINTS = {
  GET_BLOOD_REQUESTS: "/blood-requests",
  CREATE_BLOOD_REQUEST: "/blood-requests",
  ALLOCATE_BLOOD_REQUEST: "/blood-requests",
  GET_REQUEST_INVENTORY: "/blood-requests",
};

export const getBloodRequests = async (page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(
    `${BLOOD_REQUEST_ENDPOINTS.GET_BLOOD_REQUESTS}?${params.toString()}`
  );
};

export const createBloodRequest = async (bloodRequestData) => {
  const { bloodTypeId, bloodComponentId, urgencyLevel, quantity } =
    bloodRequestData;

  const payload = {
    bloodTypeId,
    bloodComponentId,
    urgencyLevel,
    quantity,
  };

  return apiPost(BLOOD_REQUEST_ENDPOINTS.CREATE_BLOOD_REQUEST, payload);
};

export const allocateBloodRequest = async (requestId) => {
  return apiPut(
    `${BLOOD_REQUEST_ENDPOINTS.ALLOCATE_BLOOD_REQUEST}/${requestId}/allocate`
  );
};

export const getRequestInventory = async (requestId, page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(
    `${
      BLOOD_REQUEST_ENDPOINTS.GET_REQUEST_INVENTORY
    }/${requestId}/inventory?${params.toString()}`
  );
};

export default {
  getBloodRequests,
  createBloodRequest,
  allocateBloodRequest,
  getRequestInventory,
};

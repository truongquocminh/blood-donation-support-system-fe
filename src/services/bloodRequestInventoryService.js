import { apiPost } from "./api";

const BLOOD_REQUEST_INVENTORY_ENDPOINTS = {
  CREATE_BLOOD_REQUEST_INVENTORY: "/v1/blood-request-inventories",
};

export const createBloodRequestInventory = async (requestInventoryData) => {
  const { bloodRequestId, inventoryId, quantity } = requestInventoryData;

  const payload = {
    bloodRequestId,
    inventoryId,
    quantity,
  };

  return apiPost(
    BLOOD_REQUEST_INVENTORY_ENDPOINTS.CREATE_BLOOD_REQUEST_INVENTORY,
    payload
  );
};

export default {
  createBloodRequestInventory,
};

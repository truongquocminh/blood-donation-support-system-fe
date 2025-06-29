import { apiPost, apiGet, apiPut, apiDelete } from "./api";

const INVENTORY_ENDPOINTS = {
  GET_INVENTORIES: "/v1/inventory",
  GET_INVENTORY_BY_ID: "/v1/inventory",
  UPDATE_INVENTORY: "/v1/inventory",
  CREATE_INVENTORY: "/v1/inventory",
};

export const getInventories = async (page = 0, size = 10) => {
  return apiGet(`${INVENTORY_ENDPOINTS.GET_INVENTORIES}?page=${page}&size=${size}`);
};

export const getInventoryById = async (id) => {
  return apiGet(`${INVENTORY_ENDPOINTS.GET_INVENTORY_BY_ID}/${id}`);
};

export const updateInventory = async (id, inventoryData) => {
  const { bloodType, bloodComponent, quantity } = inventoryData;

  const payload = {
    bloodType,
    bloodComponent,
    quantity,
  };

  return apiPut(`${INVENTORY_ENDPOINTS.UPDATE_INVENTORY}/${id}`, payload);
};

export const createInventory = async (inventoryData) => {
  const { bloodType, bloodComponent, quantity } = inventoryData;

  const payload = {
    bloodType,
    bloodComponent,
    quantity,
  };

  return apiPost(INVENTORY_ENDPOINTS.CREATE_INVENTORY, payload);
};

export default {
  getInventories,
  getInventoryById,
  updateInventory,
  createInventory,
};

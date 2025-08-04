import { apiPost, apiGet, apiPut, apiDelete } from "./api";

const EXTRACTION_ENDPOINTS = {
  CREATE_EXTRACTION: "/v1/extractions",
  GET_EXTRACTION_BY_ID: "/v1/extractions",
  UPDATE_EXTRACTION: "/v1/extractions",
  DELETE_EXTRACTION: "/v1/extractions",
  GET_ALL_EXTRACTIONS: "/v1/extractions",
  GET_EXTRACTION_DETAILS: "/v1/extractions",
};

export const createExtraction = async (extractionData) => {
  const { 
    bloodTypeId,
    bloodComponentId,
    totalVolumeExtraction,
    notes,
    extractedAt
  } = extractionData;

  const payload = {
    bloodTypeId,
    bloodComponentId,
    totalVolumeExtraction,
    notes,
    extractedAt,
  };

  return apiPost(EXTRACTION_ENDPOINTS.CREATE_EXTRACTION, payload);
};

export const getExtractionById = async (id) => {
  return apiGet(`${EXTRACTION_ENDPOINTS.GET_EXTRACTION_BY_ID}/${id}`);
};

export const updateExtraction = async (id, extractionData) => {
  const { 
    inventoryId,
    bloodTypeId,
    bloodComponentId,
    totalVolumeExtraction,
    notes,
    extractedAt
  } = extractionData;

  const payload = {
    inventoryId,
    bloodTypeId,
    bloodComponentId,
    totalVolumeExtraction,
    notes,
    extractedAt,
  };

  return apiPut(`${EXTRACTION_ENDPOINTS.UPDATE_EXTRACTION}/${id}`, payload);
};

export const deleteExtraction = async (id) => {
  return apiDelete(`${EXTRACTION_ENDPOINTS.DELETE_EXTRACTION}/${id}`);
};

export const getAllExtractions = async (page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(
    `${EXTRACTION_ENDPOINTS.GET_ALL_EXTRACTIONS}?${params.toString()}`
  );
};

export const getExtractionDetails = async (extractionId) => {
  return apiGet(`${EXTRACTION_ENDPOINTS.GET_EXTRACTION_DETAILS}/${extractionId}/details`);
};

export default {
  createExtraction,
  getExtractionById,
  updateExtraction,
  deleteExtraction,
  getAllExtractions,
  getExtractionDetails,
};
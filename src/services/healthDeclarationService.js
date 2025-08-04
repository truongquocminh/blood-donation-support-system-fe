import { apiPost, apiGet, apiPut, apiDelete } from "./api";

const HEALTH_DECLARATION_ENDPOINTS = {
  CREATE_HEALTH_DECLARATION: "/v1/health-declaration",
  GET_HEALTH_DECLARATION_BY_ID: "/v1/health-declaration",
  UPDATE_HEALTH_DECLARATION: "/v1/health-declaration",
  DELETE_HEALTH_DECLARATION: "/v1/health-declaration",
  GET_USER_HEALTH_DECLARATIONS: "/v1/health-declaration/user",
  GET_APPOINTMENT_HEALTH_DECLARATION: "/v1/health-declaration/appointment",
};

export const createHealthDeclaration = async (healthDeclarationData) => {
  const { 
    appointmentId,
    hasBloodTransmittedDisease,
    hasChronicDisease,
    currentMedications,
    hasTattooAcupuncture,
    hasRecentVaccine,
    hasTravelAbroad,
    hasUnsafeSex,
    isFirstBlood,
    isPregnantOrBreastfeeding,
    isMenstruating
  } = healthDeclarationData;

  const payload = {
    appointmentId,
    hasBloodTransmittedDisease,
    hasChronicDisease,
    currentMedications,
    hasTattooAcupuncture,
    hasRecentVaccine,
    hasTravelAbroad,
    hasUnsafeSex,
    isFirstBlood,
    isPregnantOrBreastfeeding,
    isMenstruating,
  };

  return apiPost(HEALTH_DECLARATION_ENDPOINTS.CREATE_HEALTH_DECLARATION, payload);
};

export const getHealthDeclarationById = async (id) => {
  return apiGet(`${HEALTH_DECLARATION_ENDPOINTS.GET_HEALTH_DECLARATION_BY_ID}/${id}`);
};

export const updateHealthDeclaration = async (id, healthDeclarationData) => {
  const { 
    appointmentId,
    hasBloodTransmittedDisease,
    hasChronicDisease,
    currentMedications,
    hasTattooAcupuncture,
    hasRecentVaccine,
    hasTravelAbroad,
    hasUnsafeSex,
    isFirstBlood,
    isPregnantOrBreastfeeding,
    isMenstruating
  } = healthDeclarationData;

  const payload = {
    appointmentId,
    hasBloodTransmittedDisease,
    hasChronicDisease,
    currentMedications,
    hasTattooAcupuncture,
    hasRecentVaccine,
    hasTravelAbroad,
    hasUnsafeSex,
    isFirstBlood,
    isPregnantOrBreastfeeding,
    isMenstruating,
  };

  return apiPut(`${HEALTH_DECLARATION_ENDPOINTS.UPDATE_HEALTH_DECLARATION}/${id}`, payload);
};

export const deleteHealthDeclaration = async (id) => {
  return apiDelete(`${HEALTH_DECLARATION_ENDPOINTS.DELETE_HEALTH_DECLARATION}/${id}`);
};

export const getUserHealthDeclarations = async (page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(
    `${HEALTH_DECLARATION_ENDPOINTS.GET_USER_HEALTH_DECLARATIONS}?${params.toString()}`
  );
};

export const getAppointmentHealthDeclaration = async (appointmentId) => {
  return apiGet(`${HEALTH_DECLARATION_ENDPOINTS.GET_APPOINTMENT_HEALTH_DECLARATION}/${appointmentId}`);
};

export default {
  createHealthDeclaration,
  getHealthDeclarationById,
  updateHealthDeclaration,
  deleteHealthDeclaration,
  getUserHealthDeclarations,
  getAppointmentHealthDeclaration,
};
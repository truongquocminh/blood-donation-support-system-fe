import { apiPost, apiGet } from "./api";

const HEALTH_CHECK_ENDPOINTS = {
  CREATE_HEALTH_CHECK: "/v1/health-check",
  GET_USER_HEALTH_CHECKS: "/v1/health-check/users",
  GET_HEALTH_CHECK_BY_APPOINTMENT:
    "/v1/health-check/health-checks/by-appointment",
};

export const createHealthCheck = async (healthCheckData) => {
  const {
    appointmentId,
    pulse,
    bloodPressure,
    resultSummary,
    isEligible,
    ineligibleReason,
    weight,
    suggestBloodVolume,
  } = healthCheckData;

  const payload = {
    appointmentId,
    pulse,
    bloodPressure,
    resultSummary,
    isEligible,
    ineligibleReason,
    weight,
    suggestBloodVolume,
  };

  return apiPost(`${HEALTH_CHECK_ENDPOINTS.CREATE_HEALTH_CHECK}`, payload);
};

export const getUserHealthChecks = async (userId, page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(
    `${
      HEALTH_CHECK_ENDPOINTS.GET_USER_HEALTH_CHECKS
    }/${userId}/health-checks?${params.toString()}`
  );
};

export const getHealthCheckByAppointment = async (appointmentId) => {
  return apiGet(
    `${HEALTH_CHECK_ENDPOINTS.GET_HEALTH_CHECK_BY_APPOINTMENT}/${appointmentId}`
  );
};

export default {
  createHealthCheck,
  getUserHealthChecks,
  getHealthCheckByAppointment,
};

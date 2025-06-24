import { apiPost, apiGet } from "./api";

const HEALTH_CHECK_ENDPOINTS = {
  CREATE_HEALTH_CHECK: "/v1/health-check",
  GET_USER_HEALTH_CHECKS: "/v1/health-check/users",
};

export const createHealthCheck = async (userId, healthCheckData) => {
  const {
    pulse,
    bloodPressure,
    resultSummary,
    isEligible,
    ineligibleReason,
    bloodTypeId,
  } = healthCheckData;

  const payload = {
    pulse,
    bloodPressure,
    resultSummary,
    isEligible,
    ineligibleReason,
    bloodTypeId,
  };

  return apiPost(
    `${HEALTH_CHECK_ENDPOINTS.CREATE_HEALTH_CHECK}/${userId}`,
    payload
  );
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

export default {
  createHealthCheck,
  getUserHealthChecks,
};

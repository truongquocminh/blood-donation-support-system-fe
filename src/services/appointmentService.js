import { apiPost, apiGet, apiPatch, apiDelete } from "./api";

const APPOINTMENT_ENDPOINTS = {
  CREATE_APPOINTMENT: "/v1/appointment",
  GET_APPOINTMENT_BY_ID: "/v1/appointment",
  DELETE_APPOINTMENT: "/v1/appointment",
  UPDATE_APPOINTMENT_STATUS: "/v1/appointment",
  GET_USER_APPOINTMENTS: "/v1/appointment/user",
  FILTER_APPOINTMENTS: "/v1/appointment/filter",
};

export const createAppointment = async (appointmentData) => {
  const { appointmentDate } = appointmentData;

  const payload = {
    appointmentDate,
  };

  return apiPost(APPOINTMENT_ENDPOINTS.CREATE_APPOINTMENT, payload);
};

export const getAppointmentById = async (id) => {
  return apiGet(`${APPOINTMENT_ENDPOINTS.GET_APPOINTMENT_BY_ID}/${id}`);
};

export const deleteAppointment = async (id) => {
  return apiDelete(`${APPOINTMENT_ENDPOINTS.DELETE_APPOINTMENT}/${id}`);
};

export const updateAppointmentStatus = async (id, status) => {
  const params = new URLSearchParams({
    status: status,
  });

  return apiPatch(
    `${
      APPOINTMENT_ENDPOINTS.UPDATE_APPOINTMENT_STATUS
    }/${id}/status?${params.toString()}`
  );
};


export const getUserAppointments = async (userId, page = 0, size = 10) => {
  const params = new URLSearchParams({
    userId: userId.toString(),
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(
    `${APPOINTMENT_ENDPOINTS.GET_USER_APPOINTMENTS}?${params.toString()}`
  );
};

export const filterAppointments = async (filters = {}) => {
  const { from, to, status, page = 0, size = 10, userId } = filters;

  const params = new URLSearchParams();

  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (status) params.append("status", status);
  params.append("page", page.toString());
  params.append("size", size.toString());
  if (userId) params.append("userId", userId.toString());

  return apiGet(
    `${APPOINTMENT_ENDPOINTS.FILTER_APPOINTMENTS}?${params.toString()}`
  );
};

export default {
  createAppointment,
  getAppointmentById,
  deleteAppointment,
  updateAppointmentStatus,
  getUserAppointments,
  filterAppointments,
};

import { apiPost, apiGet, apiPut, apiDelete } from "./api";

const REMINDER_ENDPOINTS = {
  GET_REMINDERS: "/v1/reminder",
  GET_REMINDER_BY_ID: "/v1/reminder",
  UPDATE_REMINDER: "/v1/reminder",
  DELETE_REMINDER: "/v1/reminder",
  CREATE_REMINDER: "/v1/reminder",
  GET_USER_REMINDERS: "/v1/reminder/user",
};

export const getReminders = async (filters = {}) => {
  const {
    userId,
    sent,
    fromDate,
    toDate,
    reminderType,
    page = 0,
    size = 10,
  } = filters;

  const params = new URLSearchParams();

  if (userId !== undefined) params.append("userId", userId.toString());
  if (sent !== undefined) params.append("sent", sent.toString());
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);
  if (reminderType) params.append("reminderType", reminderType);
  params.append("page", page.toString());
  params.append("size", size.toString());

  return apiGet(`${REMINDER_ENDPOINTS.GET_REMINDERS}?${params.toString()}`);
};

export const getReminderById = async (reminderId) => {
  return apiGet(`${REMINDER_ENDPOINTS.GET_REMINDER_BY_ID}/${reminderId}`);
};

export const updateReminder = async (reminderId, reminderData) => {
  return apiPut(
    `${REMINDER_ENDPOINTS.UPDATE_REMINDER}/${reminderId}`,
    reminderData
  );
};

export const deleteReminder = async (reminderId) => {
  return apiDelete(`${REMINDER_ENDPOINTS.DELETE_REMINDER}/${reminderId}`);
};

export const createReminder = async (reminderData) => {
  const {
    reminderId,
    userId,
    nextDate,
    reminderType,
    message,
    sent = true,
  } = reminderData;

  const payload = {
    reminderId,
    userId,
    nextDate,
    reminderType,
    message,
    sent,
  };

  return apiPost(REMINDER_ENDPOINTS.CREATE_REMINDER, payload);
};

export const getUserReminders = async (userId, page = 0, size = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet(
    `${REMINDER_ENDPOINTS.GET_USER_REMINDERS}/${userId}?${params.toString()}`
  );
};

export default {
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  createReminder,
  getUserReminders,
};

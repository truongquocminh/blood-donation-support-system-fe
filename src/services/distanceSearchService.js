import { apiPost, apiGet } from "./api";

const DISTANCE_SEARCH_ENDPOINTS = {
  SEARCH_NEARBY_DONORS_BY_STAFF: "/v1/distance-search/donor-nearby",
  SEARCH_NEARBY_DONORS: "/v1/distance-search/api/distance-search",
  GET_USER_SEARCH_HISTORY: "/v1/distance-search/api/users",
};

export const searchNearbyStaff = async (searchData) => {
  const { bloodTypeId, latitude, longitude } = searchData;

  const payload = {
    bloodTypeId,
    latitude,
    longitude,
  };

  return apiPost(
    DISTANCE_SEARCH_ENDPOINTS.SEARCH_NEARBY_DONORS_BY_STAFF,
    payload
  );
};

export const searchNearbyDonors = async (searchData) => {
  const { userId, bloodTypeId, latitude, longitude } = searchData;

  const payload = {
    userId,
    bloodTypeId,
    latitude,
    longitude,
  };

  return apiPost(DISTANCE_SEARCH_ENDPOINTS.SEARCH_NEARBY_DONORS, payload);
};

export const getUserSearchHistory = async (userId) => {
  return apiGet(
    `${DISTANCE_SEARCH_ENDPOINTS.GET_USER_SEARCH_HISTORY}/${userId}/distance-search`
  );
};

export default {
  searchNearbyStaff,
  searchNearbyDonors,
  getUserSearchHistory,
};

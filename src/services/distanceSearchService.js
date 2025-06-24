import { apiPost, apiGet } from "./api";

const DISTANCE_SEARCH_ENDPOINTS = {
  SEARCH_NEARBY_DONORS: "/v1/distance-search/api/distance-search",
  GET_USER_SEARCH_HISTORY: "/v1/distance-search/api/users",
};

export const searchNearbyDonors = async (searchData) => {
  const { userId, bloodTypeId, latitude, longitude, distanceKM } = searchData;

  const payload = {
    userId,
    bloodTypeId,
    latitude,
    longitude,
    distanceKM,
  };

  return apiPost(DISTANCE_SEARCH_ENDPOINTS.SEARCH_NEARBY_DONORS, payload);
};

export const getUserSearchHistory = async (userId) => {
  return apiGet(
    `${DISTANCE_SEARCH_ENDPOINTS.GET_USER_SEARCH_HISTORY}/${userId}/distance-search`
  );
};

export default {
  searchNearbyDonors,
  getUserSearchHistory,
};

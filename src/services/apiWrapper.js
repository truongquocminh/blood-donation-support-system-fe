import { STORAGE_KEYS } from "../utils/constants";
import { setToStorage } from "../utils/storage";
import { refreshToken } from "./authService";

export const withTokenRefresh = async (apiFunction, ...args) => {
  try {
    const response = await apiFunction(...args);
    return response;
  } catch (error) {
    console.log("error  wrapper", error);
    if (
      (error.status === 500 &&
        error.response.data === "An error occurred: Access Denied")
      
    ) {
      try {
        const refreshResponse = await refreshToken();
        if (
          refreshResponse.status === 200 &&
          refreshResponse.data?.data?.token
        ) {
          const newToken = refreshResponse.data?.data?.token;
          setToStorage(STORAGE_KEYS.AUTH_TOKEN, newToken);

          const retryResponse = await apiFunction(...args);
          return retryResponse;
        } else {
          throw new Error("Refresh token failed");
        }
      } catch (refreshError) {
        throw refreshError;
      }
    } else {
      throw error;
    }
  }
};

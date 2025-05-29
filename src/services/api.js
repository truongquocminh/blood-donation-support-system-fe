import axios from 'axios';
import toast from 'react-hot-toast';

import { API_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { getStoredAuth, removeStoredAuth, setStoredAuth } from '../utils/storage';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const auth = getStoredAuth();
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    config.headers['X-Request-Time'] = new Date().toISOString();

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              const auth = getStoredAuth();
              if (auth?.refreshToken) {
                const response = await api.post('/auth/refresh', {
                  refreshToken: auth.refreshToken,
                });

                const { token } = response.data;
                setStoredAuth({ ...auth, token });

                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              removeStoredAuth();
              window.location.href = '/auth/login';
              toast.error(ERROR_MESSAGES.UNAUTHORIZED);
            }
          }
          
          removeStoredAuth();
          window.location.href = '/login';
          toast.error(ERROR_MESSAGES.UNAUTHORIZED);
          break;

        case 403:
          toast.error(ERROR_MESSAGES.FORBIDDEN);
          break;

        case 404:
          toast.error(ERROR_MESSAGES.NOT_FOUND);
          break;

        case 422:
          const validationErrors = data.errors;
          if (validationErrors) {
            Object.values(validationErrors).forEach(error => {
              toast.error(error[0]);
            });
          } else {
            toast.error(data.message || ERROR_MESSAGES.VALIDATION_ERROR);
          }
          break;

        case 429:
          toast.error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          toast.error(ERROR_MESSAGES.SERVER_ERROR);
          break;

        default:
          toast.error(data.message || ERROR_MESSAGES.NETWORK_ERROR);
      }
    } else if (error.request) {
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      toast.error(ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const auth = getStoredAuth();
    if (!auth?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
      refreshToken: auth.refreshToken,
    });

    const { token, refreshToken: newRefreshToken } = response.data;
    
    const updatedAuth = {
      ...auth,
      token,
      refreshToken: newRefreshToken,
    };
    
    setStoredAuth(updatedAuth);
    
    return { success: true };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return { success: false };
  }
};

export const apiGet = async (url, config = {}) => {
  return api.get(url, config);
};

export const apiPost = async (url, data = {}, config = {}) => {
  return api.post(url, data, config);
};

export const apiPut = async (url, data = {}, config = {}) => {
  return api.put(url, data, config);
};

export const apiPatch = async (url, data = {}, config = {}) => {
  return api.patch(url, data, config);
};

export const apiDelete = async (url, config = {}) => {
  return api.delete(url, config);
};

export const apiUpload = async (url, file, onProgress = null, config = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(url, formData, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });
};

export const apiBatch = async (requests) => {
  try {
    const responses = await Promise.allSettled(requests);
    
    return responses.map((response, index) => ({
      index,
      success: response.status === 'fulfilled',
      data: response.status === 'fulfilled' ? response.value.data : null,
      error: response.status === 'rejected' ? response.reason : null,
    }));
  } catch (error) {
    console.error('Batch request error:', error);
    throw error;
  }
};

export const apiWithRetry = async (requestFn, maxRetries = API_CONFIG.RETRY_ATTEMPTS) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      
      if (i === maxRetries) {
        break;
      }
      
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log(`Retrying request... Attempt ${i + 2}/${maxRetries + 1}`);
    }
  }
  
  throw lastError;
};

export const createCancelToken = () => {
  return axios.CancelToken.source();
};

export const isCancel = (error) => {
  return axios.isCancel(error);
};

const requestCache = new Map();

export const apiWithCache = async (key, requestFn, cacheTime = 5 * 60 * 1000) => {
  const now = Date.now();
  const cached = requestCache.get(key);
  
  if (cached && (now - cached.timestamp) < cacheTime) {
    return cached.data;
  }
  
  try {
    const response = await requestFn();
    requestCache.set(key, {
      data: response,
      timestamp: now,
    });
    return response;
  } catch (error) {
    if (cached) {
      console.warn('Request failed, returning cached data:', error);
      return cached.data;
    }
    throw error;
  }
};

export const clearApiCache = () => {
  requestCache.clear();
};

export const healthCheck = async () => {
  try {
    const response = await apiGet('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: error.message };
  }
};

export default api;
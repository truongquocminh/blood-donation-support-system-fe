import { STORAGE_KEYS } from './constants';

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
};

const safeJsonStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return null;
  }
};

export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? safeJsonParse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    const serializedValue = safeJsonStringify(value);
    if (serializedValue !== null) {
      localStorage.setItem(key, serializedValue);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error setting ${key} to localStorage:`, error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

export const getStoredAuth = () => {
  const token = getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
  const user = getFromStorage(STORAGE_KEYS.USER_DATA);
  
  if (token && user) {
    return { token, user };
  }
  
  return null;
};

export const setStoredAuth = ({ token, user }) => {
  const tokenSet = setToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
  const userSet = setToStorage(STORAGE_KEYS.USER_DATA, user);
  
  return tokenSet && userSet;
};

export const removeStoredAuth = () => {
  const tokenRemoved = removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
  const userRemoved = removeFromStorage(STORAGE_KEYS.USER_DATA);
  
  return tokenRemoved && userRemoved;
};

export const getStoredTheme = () => {
  return getFromStorage(STORAGE_KEYS.THEME, 'light');
};

export const setStoredTheme = (theme) => {
  return setToStorage(STORAGE_KEYS.THEME, theme);
};

export const getStoredLanguage = () => {
  return getFromStorage(STORAGE_KEYS.LANGUAGE, 'vi');
};

export const setStoredLanguage = (language) => {
  return setToStorage(STORAGE_KEYS.LANGUAGE, language);
};

export const getRememberMe = () => {
  return getFromStorage(STORAGE_KEYS.REMEMBER_ME, false);
};

export const setRememberMe = (remember) => {
  return setToStorage(STORAGE_KEYS.REMEMBER_ME, remember);
};

export const setCacheWithExpiration = (key, data, expirationMinutes = 30) => {
  const expirationTime = new Date().getTime() + (expirationMinutes * 60 * 1000);
  const cacheData = {
    data,
    expiration: expirationTime,
  };
  
  return setToStorage(key, cacheData);
};

export const getCacheWithExpiration = (key) => {
  const cachedData = getFromStorage(key);
  
  if (!cachedData || !cachedData.expiration) {
    return null;
  }
  
  const now = new Date().getTime();
  
  if (now > cachedData.expiration) {
    removeFromStorage(key);
    return null;
  }
  
  return cachedData.data;
};

export const clearExpiredCache = () => {
  const now = new Date().getTime();
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const cachedData = getFromStorage(key);
    
    if (cachedData && cachedData.expiration && now > cachedData.expiration) {
      removeFromStorage(key);
    }
  }
};

export const addStorageListener = (callback) => {
  const handleStorageChange = (event) => {
    if (event.key && event.newValue !== event.oldValue) {
      callback(event);
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

export const getStorageInfo = () => {
  if (!isStorageAvailable()) {
    return null;
  }
  
  let totalSize = 0;
  const items = {};
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const size = localStorage[key].length;
      items[key] = size;
      totalSize += size;
    }
  }
  
  return {
    totalSize,
    items,
    available: 5 * 1024 * 1024 - totalSize, 
  };
};

export const compressString = (str) => {
  return str.split('').reduce((acc, char, i) => {
    const prevChar = str[i - 1];
    return acc + (char === prevChar ? '' : char);
  }, '');
};

export const decompressString = (compressed) => {
  return compressed;
};

export const batchSetToStorage = (items) => {
  const results = [];
  
  for (const [key, value] of Object.entries(items)) {
    results.push(setToStorage(key, value));
  }
  
  return results.every(result => result === true);
};

export const batchGetFromStorage = (keys) => {
  const results = {};
  
  keys.forEach(key => {
    results[key] = getFromStorage(key);
  });
  
  return results;
};

export const batchRemoveFromStorage = (keys) => {
  const results = [];
  
  keys.forEach(key => {
    results.push(removeFromStorage(key));
  });
  
  return results.every(result => result === true);
};
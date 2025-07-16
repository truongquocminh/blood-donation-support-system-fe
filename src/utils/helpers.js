import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  PLASMA_COMPATIBILITY,
  RED_BLOOD_CELL_COMPATIBILITY,
  WHOLE_BLOOD_COMPATIBILITY,
  GENERIC_COMPONENT_COMPATIBILITY,
  BLOOD_COMPONENTS,
  REMINDER_TYPE,
} from "./constants";

/**
 * Combines class names using clsx and tailwind-merge
 * @param {...any} inputs - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: 'DD/MM/YYYY')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = "DD/MM/YYYY") => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY HH:mm":
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case "HH:mm":
      return `${hours}:${minutes}`;
    default:
      return d.toLocaleDateString("vi-VN");
  }
};

/**
 * Formats a number to Vietnamese currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a number with thousand separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (typeof number !== "number") return "0";

  return new Intl.NumberFormat("vi-VN").format(number);
};

/**
 * Truncates text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + "...";
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts a string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return "";
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Generates a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttles a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Checks if a value is empty
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Deep clones an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Gets nested object property safely
 * @param {object} obj - Object to get property from
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @param {any} defaultValue - Default value if property not found
 * @returns {any} Property value or default value
 */
export const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split(".");
  let result = obj;

  for (let key of keys) {
    if (result == null || typeof result !== "object") {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
};

/**
 * Sets nested object property
 * @param {object} obj - Object to set property on
 * @param {string} path - Property path
 * @param {any} value - Value to set
 * @returns {object} Modified object
 */
export const set = (obj, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let current = obj;

  for (let key of keys) {
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  return obj;
};

/**
 * Removes duplicate items from an array
 * @param {Array} array - Array to deduplicate
 * @param {string|Function} key - Key to compare or comparison function
 * @returns {Array} Deduplicated array
 */
export const uniqueBy = (array, key) => {
  if (typeof key === "string") {
    const seen = new Set();
    return array.filter((item) => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }

  if (typeof key === "function") {
    const seen = new Set();
    return array.filter((item) => {
      const val = key(item);
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }

  return [...new Set(array)];
};

/**
 * Groups array items by a key
 * @param {Array} array - Array to group
 * @param {string|Function} key - Key to group by or grouping function
 * @returns {object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = typeof key === "function" ? key(item) : item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

/**
 * Sorts array by multiple criteria
 * @param {Array} array - Array to sort
 * @param {Array} criteria - Array of sort criteria
 * @returns {Array} Sorted array
 */
export const sortBy = (array, criteria) => {
  return array.sort((a, b) => {
    for (let criterion of criteria) {
      let aVal,
        bVal,
        order = "asc";

      if (typeof criterion === "string") {
        aVal = a[criterion];
        bVal = b[criterion];
      } else if (typeof criterion === "object") {
        aVal = a[criterion.key];
        bVal = b[criterion.key];
        order = criterion.order || "asc";
      }

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Calculates age from date of birth
 * @param {Date|string} dateOfBirth - Date of birth
 * @returns {number} Age in years
 */
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Formats file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Generates a random color
 * @returns {string} Random hex color
 */
export const randomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

/**
 * Checks if current device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Scrolls to element smoothly
 * @param {string} elementId - ID of element to scroll to
 * @param {number} offset - Offset from top (default: 0)
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch (err) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

/**
 * Downloads data as file
 * @param {string} data - Data to download
 * @param {string} filename - File name
 * @param {string} type - MIME type
 */
export const downloadFile = (data, filename, type = "text/plain") => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const isCompatible = (receiverType, donorType, component) => {
  switch (component) {
    case BLOOD_COMPONENTS.WHOLE_BLOOD:
      return WHOLE_BLOOD_COMPATIBILITY[receiverType].includes(donorType);
    case BLOOD_COMPONENTS.RED_BLOOD_CELLS:
      return RED_BLOOD_CELL_COMPATIBILITY[receiverType].includes(donorType);
    case BLOOD_COMPONENTS.PLASMA:
      return PLASMA_COMPATIBILITY[receiverType].includes(donorType);
    case BLOOD_COMPONENTS.PLATELETS:
    case BLOOD_COMPONENTS.WHITE_BLOOD_CELLS:
      return GENERIC_COMPONENT_COMPATIBILITY[receiverType].includes(donorType);
    default:
      return false;
  }
};

export const isExpiringSoon = (expiryDate, daysThreshold = 7) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return diffDays <= daysThreshold && diffDays >= 0;
};

export const isExpired = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return expiry < today;
};

export const isLowStock = (quantity, threshold = 5) => {
  return quantity <= threshold;
};

export const getStockStatus = (quantity, expiryDate) => {
  if (isExpired(expiryDate)) {
    return { status: 'expired', color: 'red', label: 'Đã hết hạn' };
  }
  
  if (isExpiringSoon(expiryDate)) {
    return { status: 'expiring', color: 'yellow', label: 'Sắp hết hạn' };
  }
  
  if (isLowStock(quantity)) {
    return { status: 'low-stock', color: 'orange', label: 'Tồn kho thấp' };
  }
  
  return { status: 'normal', color: 'green', label: 'Bình thường' };
};

export const getBloodTypeDisplay = (bloodTypes, typeId) => {
  const type = bloodTypes.find(t => t.bloodTypeId === typeId);
  return type ? type.typeName : 'N/A';
};

export const getBloodComponentDisplay = (bloodComponents, componentId) => {
  const component = bloodComponents.find(c => c.componentId === componentId);
  return component ? component.componentName : 'N/A';
};

export const filterInventories = (inventories, filters) => {
  const { searchTerm = '', bloodType = '', bloodComponent = '', status = '' } = filters;
  
  return inventories.filter(inventory => {
    const matchesSearch = !searchTerm || 
      inventory.donorId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !bloodType || inventory.bloodType.toString() === bloodType;
    
    const matchesComponent = !bloodComponent || inventory.bloodComponent.toString() === bloodComponent;
    
    let matchesStatus = true;
    if (status) {
      const stockStatus = getStockStatus(inventory.quantity, inventory.expiryDate);
      matchesStatus = stockStatus.status === status;
    }
    
    return matchesSearch && matchesType && matchesComponent && matchesStatus;
  });
};

export const calculateInventoryStats = (inventories) => {
  const totalUnits = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
  
  const uniqueTypes = new Set(inventories.map(inv => inv.bloodType)).size;
  
  const expiringSoon = inventories.filter(inv => 
    isExpiringSoon(inv.expiryDate)
  ).length;
  
  const lowStock = inventories.filter(inv => 
    isLowStock(inv.quantity)
  ).length;
  
  const expired = inventories.filter(inv => 
    isExpired(inv.expiryDate)
  ).length;
  
  return {
    totalUnits,
    uniqueTypes,
    expiringSoon,
    lowStock,
    expired
  };
};

export const validateInventoryForm = (formData, bloodTypes, bloodComponents) => {
  const errors = {};
  
  if (!formData.bloodType) {
    errors.bloodType = 'Vui lòng chọn nhóm máu';
  }
  
  if (!formData.bloodComponent) {
    errors.bloodComponent = 'Vui lòng chọn thành phần máu';
  }
  
  if (!formData.quantity || parseInt(formData.quantity) <= 0) {
    errors.quantity = 'Số lượng phải lớn hơn 0';
  }
  
  if (!formData.expiryDate) {
    errors.expiryDate = 'Vui lòng chọn ngày hết hạn';
  } else {
    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    if (expiry <= today) {
      errors.expiryDate = 'Ngày hết hạn phải sau ngày hôm nay';
    }
  }
  
  if (!formData.donorId?.trim()) {
    errors.donorId = 'Vui lòng nhập mã người hiến';
  }
  
  if (formData.bloodType && formData.bloodComponent) {
    const compatible = isCompatible(
      parseInt(formData.bloodType), 
      parseInt(formData.bloodType), 
      parseInt(formData.bloodComponent)
    );
    
    if (!compatible) {
      errors.compatibility = 'Nhóm máu và thành phần máu không tương thích';
    }
  }
  
  return errors;
};

export const sortInventories = (inventories, sortBy = 'id', sortOrder = 'asc') => {
  return [...inventories].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'expiryDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const prepareInventoryExport = (inventories, bloodTypes, bloodComponents) => {
  return inventories.map(inventory => ({
    'ID': inventory.id,
    'Nhóm máu': getBloodTypeDisplay(bloodTypes, inventory.bloodType),
    'Thành phần máu': getBloodComponentDisplay(bloodComponents, inventory.bloodComponent),
    'Số lượng': inventory.quantity,
    'Ngày hết hạn': formatDate(inventory.expiryDate),
    'Mã người hiến': inventory.donorId,
    'Trạng thái': getStockStatus(inventory.quantity, inventory.expiryDate).label
  }));
};

export const getDefaultMessage = (reminderType) => {
    const messages = {
      [REMINDER_TYPE.BLOOD_DONATION]: 'Bạn có đặt lịch hẹn hiến máu, nhớ ăn uống đầy đủ để tiếp tục hành trình cứu người.',
      [REMINDER_TYPE.APPOINTMENT]: 'Nhắc nhở cuộc hẹn khám sức khỏe. Vui lòng đến đúng giờ và mang theo các giấy tờ cần thiết.',
      [REMINDER_TYPE.HEALTH_CHECK]: 'Thời gian kiểm tra sức khỏe định kỳ đã đến. Vui lòng liên hệ để đặt lịch khám.'
    };
    return messages[reminderType] || '';
  };
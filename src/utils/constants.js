export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  MEMBER: 'member',
  GUEST: 'guest',
};

export const PERMISSIONS = {
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  UPDATE_USERS: 'update_users',
  DELETE_USERS: 'delete_users',
  
  VIEW_DONATIONS: 'view_donations',
  CREATE_DONATIONS: 'create_donations',
  UPDATE_DONATIONS: 'update_donations',
  DELETE_DONATIONS: 'delete_donations',
  
  VIEW_APPOINTMENTS: 'view_appointments',
  CREATE_APPOINTMENTS: 'create_appointments',
  UPDATE_APPOINTMENTS: 'update_appointments',
  DELETE_APPOINTMENTS: 'delete_appointments',
  
  VIEW_REPORTS: 'view_reports',
  GENERATE_REPORTS: 'generate_reports',
  
  MANAGE_SETTINGS: 'manage_settings',
  BACKUP_DATA: 'backup_data',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.STAFF]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_DONATIONS,
    PERMISSIONS.CREATE_DONATIONS,
    PERMISSIONS.UPDATE_DONATIONS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENTS,
    PERMISSIONS.UPDATE_APPOINTMENTS,
    PERMISSIONS.VIEW_REPORTS,
  ],
  [ROLES.MEMBER]: [
    PERMISSIONS.VIEW_DONATIONS,
    PERMISSIONS.CREATE_APPOINTMENTS,
    PERMISSIONS.UPDATE_APPOINTMENTS,
  ],
  [ROLES.GUEST]: [],
};

export const BLOOD_TYPES = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
};

export const BLOOD_COMPATIBILITY = {
  [BLOOD_TYPES.O_NEGATIVE]: Object.values(BLOOD_TYPES),
  [BLOOD_TYPES.O_POSITIVE]: [
    BLOOD_TYPES.O_POSITIVE,
    BLOOD_TYPES.A_POSITIVE,
    BLOOD_TYPES.B_POSITIVE,
    BLOOD_TYPES.AB_POSITIVE,
  ],
  [BLOOD_TYPES.A_NEGATIVE]: [
    BLOOD_TYPES.A_NEGATIVE,
    BLOOD_TYPES.A_POSITIVE,
    BLOOD_TYPES.AB_NEGATIVE,
    BLOOD_TYPES.AB_POSITIVE,
  ],
  [BLOOD_TYPES.A_POSITIVE]: [
    BLOOD_TYPES.A_POSITIVE,
    BLOOD_TYPES.AB_POSITIVE,
  ],
  [BLOOD_TYPES.B_NEGATIVE]: [
    BLOOD_TYPES.B_NEGATIVE,
    BLOOD_TYPES.B_POSITIVE,
    BLOOD_TYPES.AB_NEGATIVE,
    BLOOD_TYPES.AB_POSITIVE,
  ],
  [BLOOD_TYPES.B_POSITIVE]: [
    BLOOD_TYPES.B_POSITIVE,
    BLOOD_TYPES.AB_POSITIVE,
  ],
  [BLOOD_TYPES.AB_NEGATIVE]: [
    BLOOD_TYPES.AB_NEGATIVE,
    BLOOD_TYPES.AB_POSITIVE,
  ],
  [BLOOD_TYPES.AB_POSITIVE]: [
    BLOOD_TYPES.AB_POSITIVE,
  ],
};

export const DONATION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+84|0)[0-9]{9,10}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MIN_AGE: 18,
  MAX_AGE: 65,
  MIN_WEIGHT: 45,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  REMEMBER_ME: 'remember_me',
};

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const LANGUAGES = {
  VI: 'vi',
  EN: 'en',
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  MEMBER_DASHBOARD: '/member',
  MEMBER_PROFILE: '/member/profile',
  MEMBER_HISTORY: '/member/history',
  MEMBER_APPOINTMENTS: '/member/appointments',
  MEMBER_REWARDS: '/member/rewards',
  
  STAFF_DASHBOARD: '/staff',
  STAFF_APPOINTMENTS: '/staff/appointments',
  STAFF_DONATIONS: '/staff/donations',
  STAFF_DONORS: '/staff/donors',
  STAFF_INVENTORY: '/staff/inventory',
  
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_STAFF: '/admin/staff',
  ADMIN_DONATIONS: '/admin/donations',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_LOCATIONS: '/admin/locations',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy trang này.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  REQUIRED_FIELD: 'Trường này là bắt buộc.',
  INVALID_EMAIL: 'Email không hợp lệ.',
  INVALID_PHONE: 'Số điện thoại không hợp lệ.',
  PASSWORD_TOO_SHORT: `Mật khẩu phải có ít nhất ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} ký tự.`,
  PASSWORD_WEAK: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt.',
  PASSWORDS_NOT_MATCH: 'Mật khẩu xác nhận không khớp.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  CREATE_SUCCESS: 'Tạo mới thành công!',
  APPOINTMENT_BOOKED: 'Đặt lịch hẹn thành công!',
  DONATION_COMPLETED: 'Hiến máu thành công!',
};

export const CHART_COLORS = {
  PRIMARY: '#ef4444',
  SECONDARY: '#ec4899',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  DANGER: '#ef4444',
  LIGHT: '#f8fafc',
  DARK: '#1e293b',
};

export const CONTACT_INFO = {
  HOTLINE: '1900 1234',
  EMAIL: 'support@bloodconnect.vn',
  ADDRESS: '123 Đường ABC, Quận 1, TP.HCM',
  WORKING_HOURS: 'Thứ 2 - Thứ 7: 7:00 - 17:00',
  EMERGENCY_HOTLINE: '115',
};

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/bloodconnect',
  INSTAGRAM: 'https://instagram.com/bloodconnect',
  TWITTER: 'https://twitter.com/bloodconnect',
  YOUTUBE: 'https://youtube.com/bloodconnect',
  LINKEDIN: 'https://linkedin.com/company/bloodconnect',
};

export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_CHAT_SUPPORT: false,
  ENABLE_REWARDS_SYSTEM: true,
  ENABLE_MOBILE_APP_DOWNLOAD: false,
};

export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  DONATION_HISTORY: 'donation_history',
  APPOINTMENTS: 'appointments',
  BLOOD_INVENTORY: 'blood_inventory',
  STATISTICS: 'statistics',
};

export const CACHE_DURATION = {
  SHORT: 5,
  MEDIUM: 30,
  LONG: 60,
  VERY_LONG: 24 * 60, 
};
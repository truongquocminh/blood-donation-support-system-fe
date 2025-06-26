export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  MEMBER: "MEMBER",
  GUEST: "GUEST",
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+84|0)[0-9]{9,10}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MIN_AGE: 18,
  MAX_AGE: 65,
  MIN_WEIGHT: 45,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  THEME: "theme_preference",
  LANGUAGE: "language_preference",
  REMEMBER_ME: "remember_me",
};

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const LANGUAGES = {
  VI: "vi",
  EN: "en",
};

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  MEMBER_DASHBOARD: "/member/dashboard",
  MEMBER_PROFILE: "/member/profile",
  MEMBER_HISTORY: "/member/history",
  MEMBER_APPOINTMENTS: "/member/appointments",
  MEMBER_REWARDS: "/member/rewards",
  MEMBER_DONATIONS: "/member/donations",
  MEMBER_REMINDERS: "/member/reminders",

  STAFF_DASHBOARD: "/staff/dashboard",
  STAFF_APPOINTMENTS: "/staff/appointments",
  STAFF_DONATIONS: "/staff/donations",
  STAFF_DONORS: "/staff/donors",
  STAFF_INVENTORIES: "/staff/inventories",
  STAFF_REMINDERS: "/staff/reminders",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_STAFF: "/admin/staff",
  ADMIN_DONATIONS: "/admin/donations",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_LOCATIONS: "/admin/locations",
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại.",
  UNAUTHORIZED: "Bạn không có quyền truy cập.",
  FORBIDDEN: "Truy cập bị từ chối.",
  NOT_FOUND: "Không tìm thấy trang này.",
  SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
  REQUIRED_FIELD: "Trường này là bắt buộc.",
  INVALID_EMAIL: "Email không hợp lệ.",
  INVALID_PHONE: "Số điện thoại không hợp lệ.",
  PASSWORD_TOO_SHORT: `Mật khẩu phải có ít nhất ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} ký tự.`,
  PASSWORD_WEAK:
    "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt.",
  PASSWORDS_NOT_MATCH: "Mật khẩu xác nhận không khớp.",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Đăng nhập thành công!",
  REGISTER_SUCCESS: "Đăng ký thành công!",
  LOGOUT_SUCCESS: "Đăng xuất thành công!",
  UPDATE_SUCCESS: "Cập nhật thành công!",
  DELETE_SUCCESS: "Xóa thành công!",
  CREATE_SUCCESS: "Tạo mới thành công!",
  APPOINTMENT_BOOKED: "Đặt lịch hẹn thành công!",
  DONATION_COMPLETED: "Hiến máu thành công!",
};

export const CHART_COLORS = {
  PRIMARY: "#ef4444",
  SECONDARY: "#ec4899",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  INFO: "#3b82f6",
  DANGER: "#ef4444",
  LIGHT: "#f8fafc",
  DARK: "#1e293b",
};

export const CONTACT_INFO = {
  HOTLINE: "1900 1234",
  EMAIL: "support@bloodconnect.vn",
  ADDRESS: "123 Đường ABC, Quận 1, TP.HCM",
  WORKING_HOURS: "Thứ 2 - Thứ 7: 7:00 - 17:00",
  EMERGENCY_HOTLINE: "115",
};

export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/bloodconnect",
  INSTAGRAM: "https://instagram.com/bloodconnect",
  TWITTER: "https://twitter.com/bloodconnect",
  YOUTUBE: "https://youtube.com/bloodconnect",
  LINKEDIN: "https://linkedin.com/company/bloodconnect",
};

export const REMINDER_TYPE = {
  BLOOD_DONATION: "BLOOD_DONATION",
  APPOINTMENT: "APPOINTMENT",
  HEALTH_CHECK: "HEALTH_CHECK",
};

export const URGENCY_LEVELS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
  EMERGENCY: "EMERGENCY",
};

export const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const BLOOD_TYPES = {
  O_NEGATIVE: 0,
  O_POSITIVE: 1,
  A_NEGATIVE: 2,
  A_POSITIVE: 3,
  B_NEGATIVE: 4,
  B_POSITIVE: 5,
  AB_NEGATIVE: 6,
  AB_POSITIVE: 7,
};

export const BLOOD_COMPONENTS = {
  WHOLE_BLOOD: 0,
  RED_BLOOD_CELLS: 1,
  PLATELETS: 2,
  PLASMA: 3,
  WHITE_BLOOD_CELLS: 4,
};

// bảng tương thích hợp lệ giữa blood type và blood component
export const WHOLE_BLOOD_COMPATIBILITY = {
  [BLOOD_TYPES.O_NEGATIVE]: [BLOOD_TYPES.O_NEGATIVE],
  [BLOOD_TYPES.O_POSITIVE]: [BLOOD_TYPES.O_POSITIVE],
  [BLOOD_TYPES.A_NEGATIVE]: [BLOOD_TYPES.A_NEGATIVE],
  [BLOOD_TYPES.A_POSITIVE]: [BLOOD_TYPES.A_POSITIVE],
  [BLOOD_TYPES.B_NEGATIVE]: [BLOOD_TYPES.B_NEGATIVE],
  [BLOOD_TYPES.B_POSITIVE]: [BLOOD_TYPES.B_POSITIVE],
  [BLOOD_TYPES.AB_NEGATIVE]: [BLOOD_TYPES.AB_NEGATIVE],
  [BLOOD_TYPES.AB_POSITIVE]: [BLOOD_TYPES.AB_POSITIVE],
};

export const RED_BLOOD_CELL_COMPATIBILITY = {
  [BLOOD_TYPES.O_NEGATIVE]: [BLOOD_TYPES.O_NEGATIVE],
  [BLOOD_TYPES.O_POSITIVE]: [BLOOD_TYPES.O_NEGATIVE, BLOOD_TYPES.O_POSITIVE],
  [BLOOD_TYPES.A_NEGATIVE]: [BLOOD_TYPES.O_NEGATIVE, BLOOD_TYPES.A_NEGATIVE],
  [BLOOD_TYPES.A_POSITIVE]: [
    BLOOD_TYPES.O_NEGATIVE,
    BLOOD_TYPES.O_POSITIVE,
    BLOOD_TYPES.A_NEGATIVE,
    BLOOD_TYPES.A_POSITIVE,
  ],
  [BLOOD_TYPES.B_NEGATIVE]: [BLOOD_TYPES.O_NEGATIVE, BLOOD_TYPES.B_NEGATIVE],
  [BLOOD_TYPES.B_POSITIVE]: [
    BLOOD_TYPES.O_NEGATIVE,
    BLOOD_TYPES.O_POSITIVE,
    BLOOD_TYPES.B_NEGATIVE,
    BLOOD_TYPES.B_POSITIVE,
  ],
  [BLOOD_TYPES.AB_NEGATIVE]: [
    BLOOD_TYPES.O_NEGATIVE,
    BLOOD_TYPES.A_NEGATIVE,
    BLOOD_TYPES.B_NEGATIVE,
    BLOOD_TYPES.AB_NEGATIVE,
  ],
  [BLOOD_TYPES.AB_POSITIVE]: [0, 1, 2, 3, 4, 5, 6, 7],
};

export const PLASMA_COMPATIBILITY = {
  [BLOOD_TYPES.O_NEGATIVE]: [BLOOD_TYPES.O_NEGATIVE, BLOOD_TYPES.O_POSITIVE],
  [BLOOD_TYPES.O_POSITIVE]: [BLOOD_TYPES.O_POSITIVE],
  [BLOOD_TYPES.A_NEGATIVE]: [
    BLOOD_TYPES.A_NEGATIVE,
    BLOOD_TYPES.A_POSITIVE,
    BLOOD_TYPES.AB_NEGATIVE,
    BLOOD_TYPES.AB_POSITIVE,
  ],
  [BLOOD_TYPES.A_POSITIVE]: [BLOOD_TYPES.A_POSITIVE, BLOOD_TYPES.AB_POSITIVE],
  [BLOOD_TYPES.B_NEGATIVE]: [
    BLOOD_TYPES.B_NEGATIVE,
    BLOOD_TYPES.B_POSITIVE,
    BLOOD_TYPES.AB_NEGATIVE,
    BLOOD_TYPES.AB_POSITIVE,
  ],
  [BLOOD_TYPES.B_POSITIVE]: [BLOOD_TYPES.B_POSITIVE, BLOOD_TYPES.AB_POSITIVE],
  [BLOOD_TYPES.AB_NEGATIVE]: [BLOOD_TYPES.AB_NEGATIVE, BLOOD_TYPES.AB_POSITIVE],
  [BLOOD_TYPES.AB_POSITIVE]: [BLOOD_TYPES.AB_POSITIVE],
};

//PLATELETS & WHITE_BLOOD_CELLS
export const GENERIC_COMPONENT_COMPATIBILITY = {
  [BLOOD_TYPES.O_NEGATIVE]: [BLOOD_TYPES.O_NEGATIVE],
  [BLOOD_TYPES.O_POSITIVE]: [BLOOD_TYPES.O_NEGATIVE, BLOOD_TYPES.O_POSITIVE],
  [BLOOD_TYPES.A_NEGATIVE]: [BLOOD_TYPES.A_NEGATIVE],
  [BLOOD_TYPES.A_POSITIVE]: [BLOOD_TYPES.A_NEGATIVE, BLOOD_TYPES.A_POSITIVE],
  [BLOOD_TYPES.B_NEGATIVE]: [BLOOD_TYPES.B_NEGATIVE],
  [BLOOD_TYPES.B_POSITIVE]: [BLOOD_TYPES.B_NEGATIVE, BLOOD_TYPES.B_POSITIVE],
  [BLOOD_TYPES.AB_NEGATIVE]: [BLOOD_TYPES.AB_NEGATIVE],
  [BLOOD_TYPES.AB_POSITIVE]: [BLOOD_TYPES.AB_NEGATIVE, BLOOD_TYPES.AB_POSITIVE],
};

import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateEmail = (email) => {
  if (!email) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }
  return true;
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validatePhone = (phone) => {
  if (!phone) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (!VALIDATION_RULES.PHONE_REGEX.test(phone)) {
    return ERROR_MESSAGES.INVALID_PHONE;
  }
  return true;
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validatePassword = (password) => {
  if (!password) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }
  
  if (!VALIDATION_RULES.PASSWORD_REGEX.test(password)) {
    return ERROR_MESSAGES.PASSWORD_WEAK;
  }
  
  return true;
};

/**
 * Validates password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Password confirmation
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
  }
  
  return true;
};

/**
 * Validates name field
 * @param {string} name - Name to validate
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateName = (name) => {
  if (!name) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return `Tên phải có ít nhất ${VALIDATION_RULES.NAME_MIN_LENGTH} ký tự`;
  }
  
  if (trimmedName.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return `Tên không được vượt quá ${VALIDATION_RULES.NAME_MAX_LENGTH} ký tự`;
  }
  
  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    return 'Tên chỉ được chứa chữ cái và khoảng trắng';
  }
  
  return true;
};

/**
 * Validates age
 * @param {Date|string} dateOfBirth - Date of birth
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateAge = (dateOfBirth) => {
  if (!dateOfBirth) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  const today = new Date();
  const birth = new Date(dateOfBirth);
  
  if (birth > today) {
    return 'Ngày sinh không thể ở tương lai';
  }
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < VALIDATION_RULES.MIN_AGE) {
    return `Bạn phải ít nhất ${VALIDATION_RULES.MIN_AGE} tuổi để hiến máu`;
  }
  
  if (age > VALIDATION_RULES.MAX_AGE) {
    return `Tuổi hiến máu tối đa là ${VALIDATION_RULES.MAX_AGE} tuổi`;
  }
  
  return true;
};

/**
 * Validates weight
 * @param {number} weight - Weight in kg
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateWeight = (weight) => {
  if (!weight) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  const numWeight = parseFloat(weight);
  
  if (isNaN(numWeight)) {
    return 'Cân nặng phải là một số';
  }
  
  if (numWeight < VALIDATION_RULES.MIN_WEIGHT) {
    return `Cân nặng tối thiểu để hiến máu là ${VALIDATION_RULES.MIN_WEIGHT}kg`;
  }
  
  if (numWeight > 200) {
    return 'Vui lòng nhập cân nặng hợp lệ';
  }
  
  return true;
};

/**
 * Validates required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateRequired = (value, fieldName = '') => {
  if (value === null || value === undefined) {
    return fieldName ? `${fieldName} là bắt buộc` : ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return fieldName ? `${fieldName} là bắt buộc` : ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return fieldName ? `${fieldName} là bắt buộc` : ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  return true;
};

/**
 * Validates blood type
 * @param {string} bloodType - Blood type to validate
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateBloodType = (bloodType) => {
  if (!bloodType) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  if (!validBloodTypes.includes(bloodType)) {
    return 'Nhóm máu không hợp lệ';
  }
  
  return true;
};

/**
 * Validates ID card/passport number
 * @param {string} idNumber - ID number to validate
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateIdNumber = (idNumber) => {
  if (!idNumber) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  const trimmedId = idNumber.trim();
  
  const idRegex = /^[0-9]{9}$|^[0-9]{12}$/;
  
  if (!idRegex.test(trimmedId)) {
    return 'Số CMND/CCCD phải có 9 hoặc 12 chữ số';
  }
  
  return true;
};

/**
 * Validates address
 * @param {string} address - Address to validate
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateAddress = (address) => {
  if (!address) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  const trimmedAddress = address.trim();
  
  if (trimmedAddress.length < 10) {
    return 'Địa chỉ phải có ít nhất 10 ký tự';
  }
  
  if (trimmedAddress.length > 200) {
    return 'Địa chỉ không được vượt quá 200 ký tự';
  }
  
  return true;
};

/**
 * Validates file upload
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateFile = (file, options = {}) => {
  if (!file) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  const {
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  } = options;
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `Kích thước file không được vượt quá ${maxSizeMB}MB`;
  }
  
  if (!allowedTypes.includes(file.type)) {
    return `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`;
  }
  
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return `Phần mở rộng file không được hỗ trợ. Chỉ chấp nhận: ${allowedExtensions.join(', ')}`;
  }
  
  return true;
};

/**
 * Validates date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return 'Cả ngày bắt đầu và ngày kết thúc đều bắt buộc';
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    return 'Ngày bắt đầu không thể sau ngày kết thúc';
  }
  
  return true;
};

/**
 * Validates appointment date
 * @param {Date|string} appointmentDate - Appointment date
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateAppointmentDate = (appointmentDate) => {
  if (!appointmentDate) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  const appointment = new Date(appointmentDate);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); 
  
  today.setHours(0, 0, 0, 0);
  appointment.setHours(0, 0, 0, 0);
  
  if (appointment < today) {
    return 'Ngày hẹn không thể ở quá khứ';
  }
  
  if (appointment > maxDate) {
    return 'Ngày hẹn không thể quá 3 tháng từ hôm nay';
  }
  
  return true;
};

/**
 * Validates medical history
 * @param {string} medicalHistory - Medical history text
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateMedicalHistory = (medicalHistory) => {
  if (!medicalHistory) return true;
  
  const trimmed = medicalHistory.trim();
  
  if (trimmed.length > 1000) {
    return 'Tiền sử bệnh không được vượt quá 1000 ký tự';
  }
  
  return true;
};

/**
 * Validates emergency contact
 * @param {object} contact - Emergency contact object
 * @returns {boolean|string} True if valid, error message if invalid
 */
export const validateEmergencyContact = (contact) => {
  if (!contact) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  const { name, phone, relationship } = contact;
  
  if (!name || !phone || !relationship) {
    return 'Tên, số điện thoại và mối quan hệ của người liên hệ khẩn cấp là bắt buộc';
  }
  
  const nameValidation = validateName(name);
  if (nameValidation !== true) return nameValidation;
  
  const phoneValidation = validatePhone(phone);
  if (phoneValidation !== true) return phoneValidation;
  
  return true;
};

/**
 * Comprehensive form validation
 * @param {object} data - Form data to validate
 * @param {object} rules - Validation rules
 * @returns {object} Validation result with errors
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    for (const rule of fieldRules) {
      let result;
      
      switch (rule.type) {
        case 'required':
          result = validateRequired(value, rule.message || field);
          break;
        case 'email':
          result = validateEmail(value);
          break;
        case 'phone':
          result = validatePhone(value);
          break;
        case 'password':
          result = validatePassword(value);
          break;
        case 'passwordConfirmation':
          result = validatePasswordConfirmation(data.password, value);
          break;
        case 'name':
          result = validateName(value);
          break;
        case 'age':
          result = validateAge(value);
          break;
        case 'weight':
          result = validateWeight(value);
          break;
        case 'bloodType':
          result = validateBloodType(value);
          break;
        case 'idNumber':
          result = validateIdNumber(value);
          break;
        case 'address':
          result = validateAddress(value);
          break;
        case 'file':
          result = validateFile(value, rule.options);
          break;
        case 'dateRange':
          result = validateDateRange(data[rule.startField], data[rule.endField]);
          break;
        case 'appointmentDate':
          result = validateAppointmentDate(value);
          break;
        case 'medicalHistory':
          result = validateMedicalHistory(value);
          break;
        case 'emergencyContact':
          result = validateEmergencyContact(value);
          break;
        case 'custom':
          result = rule.validator(value, data);
          break;
        case 'minLength':
          if (value && value.length < rule.min) {
            result = rule.message || `Tối thiểu ${rule.min} ký tự`;
          } else {
            result = true;
          }
          break;
        case 'maxLength':
          if (value && value.length > rule.max) {
            result = rule.message || `Tối đa ${rule.max} ký tự`;
          } else {
            result = true;
          }
          break;
        case 'min':
          if (value && parseFloat(value) < rule.min) {
            result = rule.message || `Giá trị tối thiểu là ${rule.min}`;
          } else {
            result = true;
          }
          break;
        case 'max':
          if (value && parseFloat(value) > rule.max) {
            result = rule.message || `Giá trị tối đa là ${rule.max}`;
          } else {
            result = true;
          }
          break;
        case 'pattern':
          if (value && !rule.pattern.test(value)) {
            result = rule.message || 'Định dạng không hợp lệ';
          } else {
            result = true;
          }
          break;
        default:
          result = true;
      }
      
      if (result !== true) {
        errors[field] = result;
        isValid = false;
        break; 
      }
    }
  }
  
  return { isValid, errors };
};

/**
 * Validation rules for common forms
 */
export const FORM_VALIDATION_RULES = {
  register: {
    firstName: [
      { type: 'required' },
      { type: 'name' }
    ],
    lastName: [
      { type: 'required' },
      { type: 'name' }
    ],
    email: [
      { type: 'required' },
      { type: 'email' }
    ],
    password: [
      { type: 'required' },
      { type: 'password' }
    ],
    confirmPassword: [
      { type: 'required' },
      { type: 'passwordConfirmation' }
    ],
    phone: [
      { type: 'required' },
      { type: 'phone' }
    ],
    dateOfBirth: [
      { type: 'required' },
      { type: 'age' }
    ],
    bloodType: [
      { type: 'required' },
      { type: 'bloodType' }
    ],
    weight: [
      { type: 'required' },
      { type: 'weight' }
    ],
    address: [
      { type: 'required' },
      { type: 'address' }
    ],
    emergencyContact: [
      { type: 'required' },
      { type: 'emergencyContact' }
    ],
    agreeToTerms: [
      { 
        type: 'custom',
        validator: (value) => value === true ? true : 'Bạn phải đồng ý với điều khoản sử dụng'
      }
    ]
  },
  
  login: {
    email: [
      { type: 'required' },
      { type: 'email' }
    ],
    password: [
      { type: 'required' }
    ]
  },
  
  profile: {
    firstName: [
      { type: 'required' },
      { type: 'name' }
    ],
    lastName: [
      { type: 'required' },
      { type: 'name' }
    ],
    phone: [
      { type: 'required' },
      { type: 'phone' }
    ],
    address: [
      { type: 'required' },
      { type: 'address' }
    ],
    weight: [
      { type: 'required' },
      { type: 'weight' }
    ]
  },
  
  appointment: {
    appointmentDate: [
      { type: 'required' },
      { type: 'appointmentDate' }
    ],
    timeSlot: [
      { type: 'required', message: 'Vui lòng chọn khung giờ' }
    ],
    location: [
      { type: 'required', message: 'Vui lòng chọn địa điểm hiến máu' }
    ],
    notes: [
      { type: 'maxLength', max: 500 }
    ]
  },
  
  contact: {
    name: [
      { type: 'required' },
      { type: 'name' }
    ],
    email: [
      { type: 'required' },
      { type: 'email' }
    ],
    subject: [
      { type: 'required' },
      { type: 'minLength', min: 5 },
      { type: 'maxLength', max: 100 }
    ],
    message: [
      { type: 'required' },
      { type: 'minLength', min: 10 },
      { type: 'maxLength', max: 1000 }
    ]
  },
  
  changePassword: {
    currentPassword: [
      { type: 'required' }
    ],
    newPassword: [
      { type: 'required' },
      { type: 'password' }
    ],
    confirmPassword: [
      { type: 'required' },
      { type: 'passwordConfirmation' }
    ]
  }
};

/**
 * Real-time validation for form fields
 * @param {string} fieldName - Name of the field
 * @param {any} value - Current value
 * @param {object} formData - Complete form data
 * @param {object} rules - Validation rules for the field
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (fieldName, value, formData, rules) => {
  if (!rules[fieldName]) return null;
  
  const fieldRules = rules[fieldName];
  
  for (const rule of fieldRules) {
    let result;
    
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message || ERROR_MESSAGES.REQUIRED_FIELD;
        }
        break;
      case 'email':
        if (value) {
          result = validateEmail(value);
          if (result !== true) return result;
        }
        break;
      case 'password':
        if (value) {
          result = validatePassword(value);
          if (result !== true) return result;
        }
        break;
      case 'passwordConfirmation':
        if (value && formData.password) {
          result = validatePasswordConfirmation(formData.password, value);
          if (result !== true) return result;
        }
        break;
      case 'minLength':
        if (value && value.length < rule.min) {
          return rule.message || `Tối thiểu ${rule.min} ký tự`;
        }
        break;
      case 'maxLength':
        if (value && value.length > rule.max) {
          return rule.message || `Tối đa ${rule.max} ký tự`;
        }
        break;
    }
  }
  
  return null;
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
  validateAge,
  validateWeight,
  validateRequired,
  validateBloodType,
  validateIdNumber,
  validateAddress,
  validateFile,
  validateDateRange,
  validateAppointmentDate,
  validateMedicalHistory,
  validateEmergencyContact,
  validateForm,
  validateField,
  FORM_VALIDATION_RULES
};
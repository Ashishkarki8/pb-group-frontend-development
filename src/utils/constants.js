// ========================================
// APP CONSTANTS
// ========================================

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';
export const HIDDEN_LOGIN_PATH = import.meta.env.VITE_HIDDEN_LOGIN_PATH || 'x7k9p2m';

// ========================================
// USER ROLES
// ========================================
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  NORMAL_ADMIN: 'normal_admin',
};

// ========================================
// ADMIN STATUS
// ========================================
export const ADMIN_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  LOCKED: 'locked',
};

// ========================================
// ACCOUNT LOCK DURATION
// ========================================
export const LOCK_DURATION_HOURS = 2;
export const MAX_LOGIN_ATTEMPTS = 5;

// ========================================
// TOKEN & CACHE SETTINGS
// ========================================
export const TOKEN_EXPIRY_HOURS = 8;
export const CACHE_TIME = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 10 * 60 * 1000,    // 10 minutes
  LONG: 30 * 60 * 1000,      // 30 minutes
};

// ========================================
// ROUTE PATHS (✅ FIXED - HIDDEN LOGIN URL!)
// ========================================
export const ROUTES = {
  // Public
  HOME: '/',
  
  // ✅ HIDDEN LOGIN URL (matches backend hidden path)
  LOGIN: `/auth/${HIDDEN_LOGIN_PATH}/login`,
  
  // Admin Dashboard
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROFILE: '/admin/profile',
  
  // Super Admin Only
  ADMIN_LIST: '/admin/users',
  ADMIN_CREATE: '/admin/users/create',
  ADMIN_STATS: '/admin/stats',
  
  // Error Pages
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
};

// ========================================
// API ENDPOINT NAMES (for React Query keys)
// ========================================
export const API_KEYS = {
  // Auth
  AUTH_USER: 'auth-user',
  AUTH_VERIFY: 'auth-verify',
  
  // Admin Management
  ADMIN_LIST: 'admin-list',
  ADMIN_DETAIL: 'admin-detail',
  ADMIN_STATS: 'admin-stats',
};

// ========================================
// PAGINATION
// ========================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// ========================================
// TOAST MESSAGES
// ========================================
export const TOAST_MESSAGES = {
  // Success
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  ADMIN_CREATED: 'Admin created successfully',
  ADMIN_UPDATED: 'Admin updated successfully',
  ADMIN_DELETED: 'Admin deleted successfully',
  PASSWORD_RESET: 'Password reset successfully',
  
  // Error
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
};

// ========================================
// REGEX PATTERNS
// ========================================
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// ========================================
// PASSWORD REQUIREMENTS
// ========================================
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
};

// ========================================
// DATE FORMATS
// ========================================
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY hh:mm A',
  API: 'YYYY-MM-DD',
};
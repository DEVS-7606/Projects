export const INVOICE_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  OVERDUE: 'overdue',
  NEEDS_REVIEW: 'needs_review',
} as const;

export const INVOICE_SOURCE = {
  EMAIL: 'email',
  MANUAL: 'manual',
  API: 'api',
} as const;

export const DUPLICATE_STATUS = {
  SUSPECTED: 'suspected',
  CONFIRMED: 'confirmed',
  IGNORED: 'ignored',
} as const;

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  INPUT: 'yyyy-MM-dd',
  FULL: 'dd MMM yyyy, HH:mm',
} as const;

export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGIN_ERROR: 'Invalid email or password',
    SIGNUP_SUCCESS: 'Account created successfully',
    SIGNUP_ERROR: 'Failed to create account',
    LOGOUT_SUCCESS: 'Successfully logged out',
  },
  INVOICE: {
    CREATE_SUCCESS: 'Invoice created successfully',
    UPDATE_SUCCESS: 'Invoice updated successfully',
    DELETE_SUCCESS: 'Invoice deleted successfully',
    MARK_PAID_SUCCESS: 'Invoice marked as paid',
    ERROR: 'Failed to process invoice',
  },
  VENDOR: {
    CREATE_SUCCESS: 'Vendor created successfully',
    UPDATE_SUCCESS: 'Vendor updated successfully',
    DELETE_SUCCESS: 'Vendor deleted successfully',
    ERROR: 'Failed to process vendor',
  },
  GENERAL: {
    LOADING: 'Loading...',
    NO_DATA: 'No data available',
    ERROR: 'Something went wrong',
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  INVOICES: '/invoices',
  INVOICE_DETAIL: '/invoices/:id',
  VENDORS: '/vendors',
  SETTINGS: '/settings',
} as const;

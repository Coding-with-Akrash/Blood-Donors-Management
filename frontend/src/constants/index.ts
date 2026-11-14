import type {
  BloodGroup,
  UrgencyLevel,
  DonationStatus,
  RequestStatus,
  EligibilityStatus,
  ComponentType,
  UserRole,
} from '../types';

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const URGENCY_LEVELS: UrgencyLevel[] = ['Normal', 'Urgent', 'Critical'];

export const DONATION_STATUSES: DonationStatus[] = [
  'Pending',
  'Accepted',
  'Rejected',
  'Tested',
  'Available',
  'Used',
  'Expired',
];

export const REQUEST_STATUSES: RequestStatus[] = [
  'Pending',
  'Under Review',
  'Approved',
  'Searching for Donor',
  'Donor Found',
  'Fulfilled',
  'Cancelled',
  'Rejected',
];

export const ELIGIBILITY_STATUSES: EligibilityStatus[] = [
  'Pending Medical Review',
  'Eligible',
  'Temporarily Deferred',
  'Permanently Deferred',
];

export const COMPONENT_TYPES: ComponentType[] = [
  'Whole Blood',
  'Red Cells',
  'Plasma',
  'Platelets',
];

export const GENDERS = ['Male', 'Female', 'Other'] as const;

export const ROLES = ['donor', 'recipient', 'staff', 'admin'] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  donor: 'Donor',
  recipient: 'Recipient',
  staff: 'Staff',
  admin: 'Admin',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  donor: 'I want to donate blood and save lives',
  recipient: 'I need blood for myself or a loved one',
  staff: 'I work at a blood center or hospital',
  admin: 'I manage the system',
};

export const ROLE_ICONS: Record<UserRole, string> = {
  donor: 'heart',
  recipient: 'droplet',
  staff: 'users',
  admin: 'shield',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  donor: 'bg-blood-light text-blood-red dark:bg-blood-muted/50 dark:text-blood-light',
  recipient: 'bg-info-light text-info dark:bg-info-light/30 dark:text-info',
  staff: 'bg-success-light text-success dark:bg-success-light/30 dark:text-success',
  admin: 'bg-warning-light text-warning dark:bg-warning-light/30 dark:text-warning',
};

// Semantic color classes for inline use (without dark: variants)
export const ROLE_COLORS_INLINE: Record<UserRole, string> = {
  donor: 'bg-blood-light text-blood-red',
  recipient: 'bg-info-light text-info',
  staff: 'bg-success-light text-success',
  admin: 'bg-warning-light text-warning',
};

// Urgency colors
export const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  Critical: 'bg-destructive/10 text-destructive border-destructive',
  Urgent: 'bg-warning/10 text-warning border-warning',
  Normal: 'bg-info/10 text-info border-info',
};

// Status colors
export const STATUS_COLORS: Record<string, string> = {
  // Donation statuses
  Pending: 'bg-warning/10 text-warning',
  Accepted: 'bg-success/10 text-success',
  Rejected: 'bg-destructive/10 text-destructive',
  Tested: 'bg-info/10 text-info',
  Available: 'bg-success/10 text-success',
  Used: 'bg-muted/50 text-muted-foreground',
  Expired: 'bg-destructive/10 text-destructive',
  
  // Request statuses
  'Under Review': 'bg-info/10 text-info',
  Approved: 'bg-success/10 text-success',
  'Searching for Donor': 'bg-warning/10 text-warning',
  'Donor Found': 'bg-success/10 text-success',
  Fulfilled: 'bg-success/10 text-success',
  Cancelled: 'bg-muted/50 text-muted-foreground',
  
  // Eligibility statuses
  'Pending Medical Review': 'bg-info/10 text-info',
  Eligible: 'bg-success/10 text-success',
  'Temporarily Deferred': 'bg-warning/10 text-warning',
  'Permanently Deferred': 'bg-destructive/10 text-destructive',
  
  // Generic
  Active: 'bg-success/10 text-success',
  Inactive: 'bg-muted/50 text-muted-foreground',
  Deactivated: 'bg-destructive/10 text-destructive',
  healthy: 'bg-success/10 text-success',
  unhealthy: 'bg-destructive/10 text-destructive',
};

// Semantic background colors for stats/icons
export const STAT_COLORS = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
  destructive: 'bg-destructive/10 text-destructive',
} as const;

export const ROLE_STAT_COLORS: Record<UserRole, string> = {
  donor: 'bg-primary/10 text-primary',
  recipient: 'bg-info/10 text-info',
  staff: 'bg-success/10 text-success',
  admin: 'bg-warning/10 text-warning',
};

export const BLOOD_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};

export const API_ENDPOINTS = {
  auth: {
    login: '/neon-auth/login',
    register: '/api/jwt/auth/register',
    logout: '/neon-auth/logout',
    me: '/api/jwt/users/me',
    refresh: '/api/auth/refresh',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verify: '/neon-auth/verify',
  },
  donors: {
    list: '/api/jwt/donors',
    get: (id: string) => `/api/jwt/donors/${id}`,
    match: (bloodGroup: string) => `/api/jwt/donors/match/${bloodGroup}`,
  },
  recipients: {
    list: '/api/jwt/recipients',
    get: (id: string) => `/api/jwt/recipients/${id}`,
  },
  donations: {
    list: '/api/jwt/donations',
    get: (id: string) => `/api/jwt/donations/${id}`,
    create: '/api/jwt/donations',
  },
  requests: {
    list: '/api/jwt/blood-requests',
    get: (id: string) => `/api/jwt/blood-requests/${id}`,
    create: '/api/jwt/blood-requests',
    update: (id: string) => `/api/jwt/blood-requests/${id}`,
    search: '/api/jwt/blood-requests/search',
  },
  inventory: {
    list: '/api/jwt/inventory',
    get: (id: string) => `/api/jwt/inventory/${id}`,
    create: '/api/jwt/inventory',
    update: (id: string) => `/api/jwt/inventory/${id}`,
  },
  bloodCompatibility: {
    get: (bloodGroup: string) => `/api/jwt/blood-compatibility/${bloodGroup}`,
  },
  admin: {
    stats: '/api/admin/stats',
    users: '/api/admin/users',
    auditLogs: '/api/admin/audit-logs',
    settings: '/api/admin/settings',
  },
  reports: {
    donations: '/api/reports/donations',
    requests: '/api/reports/requests',
    inventory: '/api/reports/inventory',
    donors: '/api/reports/donors',
  },
  notifications: {
    list: '/api/notifications',
    markRead: (id: string) => `/api/notifications/${id}/read`,
    markAllRead: '/api/notifications/read-all',
  },
} as const;

export const STORAGE_KEYS = {
  authToken: 'lifeblood_auth_token',
  refreshToken: 'lifeblood_refresh_token',
  user: 'lifeblood_user',
  theme: 'lifeblood_theme',
  draftRegistration: 'lifeblood_draft_registration',
} as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100,
};

export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  },
  phone: {
    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
} as const;

export const DATE_FORMATS = {
  display: 'MMM d, yyyy',
  displayWithTime: 'MMM d, yyyy h:mm a',
  api: 'yyyy-MM-dd',
  apiDateTime: "yyyy-MM-dd'T'HH:mm:ss",
} as const;
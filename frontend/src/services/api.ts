import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS, API_ENDPOINTS } from '../constants';
import type { ApiResponse, PaginatedResponse, FilterParams } from '../types';
import type {
  User,
  DonorProfile,
  RecipientProfile,
  Donation,
  BloodRequest,
  BloodInventory,
  Notification,
  AuditLog,
  UrgencyLevel,
  BloodGroup,
  DashboardStats,
} from '../types';

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.authToken);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
      if (!refreshToken) throw new Error('No refresh token');

      const response = await axios.post<ApiResponse<{ accessToken: string }>>(
        `${this.client.defaults.baseURL}${API_ENDPOINTS.auth.refresh}`,
        { refreshToken }
      );

      const newToken = response.data.data.accessToken;
      localStorage.setItem(STORAGE_KEYS.authToken, newToken);
      return newToken;
    })();

    try {
      return await this.refreshTokenPromise;
    } finally {
      this.refreshTokenPromise = null;
    }
  }

  private clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
  }

  async get<T>(url: string, params?: FilterParams): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data.data;
  }

  async getPaginated<T>(url: string, params?: FilterParams): Promise<PaginatedResponse<T>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<T>>>(url, { params });
    return response.data.data;
  }

  setAuthToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.authToken);
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const api = new ApiClient();

export const authService = {
  // Neon Auth login (form-based for traditional login page)
  login: (email: string, password: string, rememberMe: boolean) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>(API_ENDPOINTS.auth.login, {
      email,
      password,
      rememberMe,
    }),

  // Neon Auth register - redirects to hosted UI
  register: (data: Record<string, unknown>) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>(API_ENDPOINTS.auth.register, data),

  logout: () => api.post(API_ENDPOINTS.auth.logout),

  getMe: () => api.get<User>(API_ENDPOINTS.auth.me),

  verifyToken: (token: string) =>
    api.post<{ valid: boolean; user?: User }>(API_ENDPOINTS.auth.verify, { token }),

  forgotPassword: (email: string) =>
    api.post(API_ENDPOINTS.auth.forgotPassword, { email }),

  resetPassword: (token: string, password: string) =>
    api.post(API_ENDPOINTS.auth.resetPassword, { token, password }),
};

export const donorService = {
  getList: (params?: FilterParams) =>
    api.getPaginated<DonorProfile>(API_ENDPOINTS.donors.list, params),

  getById: (id: string) =>
    api.get<DonorProfile>(API_ENDPOINTS.donors.get(id)),

  getMatch: (bloodGroup: string) =>
    api.get<DonorProfile[]>(API_ENDPOINTS.donors.match(bloodGroup)),
};

export const recipientService = {
  getList: (params?: FilterParams) =>
    api.getPaginated<RecipientProfile>(API_ENDPOINTS.recipients.list, params),

  getById: (id: string) =>
    api.get<RecipientProfile>(API_ENDPOINTS.recipients.get(id)),
};

export const donationService = {
  getList: (params?: FilterParams) =>
    api.getPaginated<Donation>(API_ENDPOINTS.donations.list, params),

  getById: (id: string) =>
    api.get<Donation>(API_ENDPOINTS.donations.get(id)),

  create: (data: Partial<Donation>) =>
    api.post<Donation>(API_ENDPOINTS.donations.create, data),
};

export const requestService = {
  getList: (params?: FilterParams) =>
    api.getPaginated<BloodRequest>(API_ENDPOINTS.requests.list, params),

  getById: (id: string) =>
    api.get<BloodRequest>(API_ENDPOINTS.requests.get(id)),

  create: (data: Partial<BloodRequest>) =>
    api.post<BloodRequest>(API_ENDPOINTS.requests.create, data),

  update: (id: string, data: Partial<BloodRequest>) =>
    api.put<BloodRequest>(API_ENDPOINTS.requests.update(id), data),

  search: (params: { bloodGroup: BloodGroup; city: string; urgency?: UrgencyLevel }) =>
    api.post<BloodRequest[]>(API_ENDPOINTS.requests.search, params),
};

export const inventoryService = {
  getList: (params?: FilterParams) =>
    api.getPaginated<BloodInventory>(API_ENDPOINTS.inventory.list, params),

  getById: (id: string) =>
    api.get<BloodInventory>(API_ENDPOINTS.inventory.get(id)),

  create: (data: Partial<BloodInventory>) =>
    api.post<BloodInventory>(API_ENDPOINTS.inventory.create, data),

  update: (id: string, data: Partial<BloodInventory>) =>
    api.put<BloodInventory>(API_ENDPOINTS.inventory.update(id), data),
};

export const bloodCompatibilityService = {
  get: (bloodGroup: BloodGroup) =>
    api.get<{ can_donate_to: BloodGroup[]; can_receive_from: BloodGroup[] }>(API_ENDPOINTS.bloodCompatibility.get(bloodGroup)),
};

export const adminService = {
  getStats: () =>
    api.get<DashboardStats>(API_ENDPOINTS.admin.stats),

  getUsers: (params?: FilterParams) =>
    api.getPaginated<User>(API_ENDPOINTS.admin.users, params),

  getAuditLogs: (params?: FilterParams) =>
    api.getPaginated<AuditLog>(API_ENDPOINTS.admin.auditLogs, params),

  getSettings: () =>
    api.get<Record<string, unknown>>(API_ENDPOINTS.admin.settings),

  updateSettings: (data: Record<string, unknown>) =>
    api.put(API_ENDPOINTS.admin.settings, data),
};

export const reportService = {
  getDonations: (params?: FilterParams) =>
    api.get(API_ENDPOINTS.reports.donations, params),

  getRequests: (params?: FilterParams) =>
    api.get(API_ENDPOINTS.reports.requests, params),

  getInventory: (params?: FilterParams) =>
    api.get(API_ENDPOINTS.reports.inventory, params),

  getDonors: (params?: FilterParams) =>
    api.get(API_ENDPOINTS.reports.donors, params),
};

export const notificationService = {
  getList: (params?: FilterParams) =>
    api.getPaginated<Notification>(API_ENDPOINTS.notifications.list, params),

  markRead: (id: string) =>
    api.post(API_ENDPOINTS.notifications.markRead(id)),

  markAllRead: () =>
    api.post(API_ENDPOINTS.notifications.markAllRead),
};
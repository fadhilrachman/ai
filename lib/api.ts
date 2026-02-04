import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sso.arnatech.id/api';

/**
 * Token Service to handle localStorage operations
 */
const TokenService = {
  getAccessToken: () => (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null),
  getRefreshToken: () => (typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null),
  setAccessToken: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('access_token', token);
  },
  setRefreshToken: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('refresh_token', token);
  },
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
};

/**
 * Auth instance for requests that don't need base interceptors (login, refresh)
 */
export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Main API instance
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variables to handle refreshing state
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Force redirect to login on 403 Forbidden (Permission denied)
    if (error.response?.status === 403) {
      TokenService.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized (Expired token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = TokenService.getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        TokenService.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await authApi.post('/auth/token/refresh/', {
          refresh: refreshToken,
        });

        const { access } = response.data;
        TokenService.setAccessToken(access);

        // Update headers and retry all failed requests
        api.defaults.headers.common.Authorization = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;

        processQueue(null, access);
        return api(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        TokenService.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

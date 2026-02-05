import axios from 'axios';

const chatApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHAT_API_URL || 'https://noc-rag-poc.arnatech.id/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

chatApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

chatApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for unexpected HTML responses (usually 500 errors from proxy/Nginx)
    if (
      error.response?.status === 500 &&
      !error.response?.headers?.["content-type"]?.includes("application/json")
    ) {
      throw new Error(`Unexpected HTML response from server`);
    }

    // Force redirect to login on 403 Forbidden
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Token expired on Chat API, attempting to refresh...");

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return chatApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

      if (!refreshToken) {
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        // We use the SSO API URL for refreshing
        const ssoBaseUrl = process.env.NEXT_PUBLIC_SSO_API_URL || 'https://sso.arnatech.id/api';
        const response = await axios.post(`${ssoBaseUrl}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        console.log("Chat API refresh response:", response.data);

        const { access, refresh } = response.data;

        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access);
          if (refresh) {
            localStorage.setItem('refresh_token', refresh);
          }
        }

        chatApi.defaults.headers.common.Authorization = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;

        processQueue(null, access);
        isRefreshing = false;

        return chatApi(originalRequest);
      } catch (err: any) {
        console.error("Error during Chat API token refresh:", err);
        processQueue(err, null);
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default chatApi;

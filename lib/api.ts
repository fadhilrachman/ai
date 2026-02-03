import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sso.arnatech.id/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Check if we have a token (this is a placeholder for actual token storage implementation)
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 updates or other global errors here
    return Promise.reject(error);
  }
);

export default api;

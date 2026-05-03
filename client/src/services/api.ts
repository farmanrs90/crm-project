import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token from localStorage to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Global response handler: on 401 remove token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      // simple redirect — router not available here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
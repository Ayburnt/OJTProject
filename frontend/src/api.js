// api.js
import axios from "axios";

export const ACCESS_TOKEN = "access"; 
export const REFRESH_TOKEN = "refresh";

// Create Axios instance with base URL from env or fallback
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
  "http://127.0.0.1:8000/api",
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

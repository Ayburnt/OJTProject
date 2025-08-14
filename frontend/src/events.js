// src/api.js
import axios from "axios";

export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";

const api = axios.create({
  baseURL: //import.meta.env.VITE_API_URL || 
  "http://127.0.0.1:8000/events",
});

// Request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is a 401 Unauthorized and if we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const response = await axios.post(
            `${//import.meta.env.VITE_API_URL || 
              "http://127.0.0.1:8000/api"}/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );
          
          // Store the new access token
          localStorage.setItem(ACCESS_TOKEN, response.data.access);

          // Update the header of the original request and retry it
          api.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If the refresh token is also invalid, log out the user
          console.error("Refresh token is invalid or expired. Logging out.");
          localStorage.clear();
          window.location.href = "/login"; // Redirect to the login page
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, so clear the access token and log out
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
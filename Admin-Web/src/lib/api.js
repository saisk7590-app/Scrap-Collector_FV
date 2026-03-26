import axios from "axios";
import { getAuthToken } from "./auth";

// Prefer explicit API base URL; fall back to proxy target (dev) or default backend port.
const proxyTarget = import.meta.env.VITE_API_PROXY_TARGET || "http://localhost:8081";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (proxyTarget.endsWith("/api") ? proxyTarget : `${proxyTarget}/api`);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Return data directly if successful
    if (response.data && response.data.data !== undefined) {
      if (response.data.success === false) {
        return Promise.reject(new Error(response.data.message || "Request failed"));
      }
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Map standard response to API structure if any
    const message = error.response?.data?.message || error.message || "Request failed";
    const err = new Error(message);
    err.status = error.response?.status;
    err.body = error.response?.data;
    return Promise.reject(err);
  }
);

export const api = {
  get: (path, options) => axiosInstance.get(path, options),
  post: (path, body, options) => axiosInstance.post(path, body, options),
  put: (path, body, options) => axiosInstance.put(path, body, options),
  del: (path, options) => axiosInstance.delete(path, options),
};

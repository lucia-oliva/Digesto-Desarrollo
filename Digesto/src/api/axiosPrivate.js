import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../services/authservices";
import { getGlobalLogout } from "../context/globalLogout";

export const API_BASE = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config || {};
    const status = err.response?.status;
    const isAuthRequest =
    originalRequest?.url?.includes("/auth/login") ||
    originalRequest?.url?.includes("/auth/refresh-token") ||
    originalRequest?.url?.includes("/auth/logout");

  const hasRetried = originalRequest?._retry;

  if (status === 401 && !hasRetried && !isAuthRequest) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (token) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      isRefreshing = true;
      try {
        const { data } = await api.post("/auth/refresh-token");
        const newToken = data.accessToken;

        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        const logout = getGlobalLogout?.();
        if (typeof logout === "function") {
          try {
            await logout(true);
          } catch (logoutError) {
            console.error("Error during global logout:", logoutError);
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;

import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../services/authservices";
import { setGlobalLogout } from "../context/globalLogout";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // importante para enviar cookie con refresh token
});

let isRefreshing = false;
let failedQueue = [];

// Esta funcion se ejecuta cuando se recibe una respuesta con un status 401
// y no hay token en la cookie , y se intenta refrescar el token o se rechaza todo
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Esta funcion se ejecuta antes de cada solicitud para
// agregar el token de autorización , si hay un token en los cookies
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Esta funcion se ejecuta después de cada solicitud para
// manejar errores de refresco de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;
    const isLoginRequest = originalRequest?.url?.includes("/auth/login");
    const hasRetried = originalRequest?._retry;

    // Si es un error 401 y no es una solicitud de login, intentamos refrescar
    if (isUnauthorized && !hasRetried && !isLoginRequest) {
      originalRequest._retry = true;

      // Si ya estamos refrescando el token, encolamos la solicitud
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        // Reintentar solicitud original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, limpiamos y forzamos logout
        processQueue(refreshError, null);
        clearAccessToken();
        setGlobalLogout(true);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Si no es un 401 o no califica para refresh, rechazamos normalmente
    return Promise.reject(error);
  }
);

export default api;

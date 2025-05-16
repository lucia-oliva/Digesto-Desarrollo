import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from '../services/authservices';
import { setGlobalLogout } from '../context/globalLogout';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Si ya estamos refrescando un token, devolvemos la promesa de la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;


      // Intentamos refrescar el token , si falla, devolvemos la promesa de la cola
      try {
        const res = await axios.post('http://localhost:3000/api/auth/refresh-token', {}, { withCredentials: true });
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAccessToken();
        setGlobalLogout(true);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

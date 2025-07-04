import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../services/authservices";
import { jwtDecode } from "jwt-decode";
import { setGlobalLogout } from "./globalLogout";
import api from "../api/axiosPrivate";

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    loading: true,
    sessionExpired: false,
  });

  const logout = (expired = false) => {
    clearAccessToken();
    setAuth({ user: null, loading: false, sessionExpired: expired });
  };

  const login = async (email, password) => {
    const res = await api.post(
      "http://localhost:3000/api/auth/login",
      { email, password },
      { withCredentials: true }
    );

    const { accessToken } = res.data;
    setAccessToken(accessToken);

    const { user } = jwtDecode(accessToken);
    setAuth({ user, loading: false, sessionExpired: false });

    return res.data; // for messages or navigation
  };

  useEffect(() => {
    setGlobalLogout(logout);

    const initAuth = async () => {
      let token = getAccessToken();
      console.log("initAuth: token desde storage:", token);

      if (!token) {
        try {
          const res = await api.post(
            "http://localhost:3000/api/auth/refresh-token",
            {},
            { withCredentials: true }
          );
          token = res.data.accessToken;
          setAccessToken(token);
          console.log("initAuth: token nuevo desde refresh:", token);
        } catch (err) {
          console.warn("No se pudo refrescar token");
          return logout(true);
        }
      }

      try {
        const { user } = jwtDecode(token);
        console.log("initAuth: usuario decodificado:", user);
        setAuth({ user, loading: false, sessionExpired: false });
      } catch (err) {
        console.error("Token inválido al decodificar");
        logout(true);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

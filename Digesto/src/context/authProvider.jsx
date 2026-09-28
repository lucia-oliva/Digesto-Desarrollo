import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { setAccessToken, clearAccessToken } from "../services/authservices";
import { setGlobalLogout } from "./globalLogout";
import api from "../api/axiosPrivate";

const HAD_SESSION_KEY = "digesto:had-session";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    loading: true,
    sessionExpired: false,
  });

  const hardLogout = async (expired = false) => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Aunque el endpoint falle, se limpia el estado local de sesión.
    }

    localStorage.removeItem(HAD_SESSION_KEY);
    clearAccessToken();
    setAuth({ user: null, loading: false, sessionExpired: expired });
  };

  const logout = () => {
    hardLogout(false);
  };

  const login = async (email, password) => {
    const { data } = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    setAccessToken(data.accessToken);
    localStorage.setItem(HAD_SESSION_KEY, "true");
    setAuth({ user: data.user, loading: false, sessionExpired: false });

    return data;
  };

  useEffect(() => {
    setGlobalLogout(hardLogout);
  }, []);

  useEffect(() => {
    (async () => {
      const hadSession = localStorage.getItem(HAD_SESSION_KEY) === "true";

      if (!hadSession) {
        clearAccessToken();
        setAuth({ user: null, loading: false, sessionExpired: false });
        return;
      }

      try {
        const { data } = await api.post("/auth/refresh-token");
        setAccessToken(data.accessToken);
        localStorage.setItem(HAD_SESSION_KEY, "true");

        setAuth({ user: data.user, loading: false, sessionExpired: false });
      } catch (error) {
        const status = error?.response?.status;

        localStorage.removeItem(HAD_SESSION_KEY);
        clearAccessToken();
        setAuth({
          user: null,
          loading: false,
          sessionExpired: status !== 401,
        });
      }
    })();
  }, []);

  const value = { auth, logout, login, api };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

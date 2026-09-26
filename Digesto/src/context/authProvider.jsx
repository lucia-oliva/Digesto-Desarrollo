import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { setAccessToken, clearAccessToken } from "../services/authservices";
import { setGlobalLogout } from "./globalLogout";
import api from "../api/axiosPrivate";

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
      return null;
    }
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
    setAuth({ user: data.user, loading: false, sessionExpired: false });

    return data;
  };

  useEffect(() => {
    setGlobalLogout(hardLogout);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post("/auth/refresh-token");
        setAccessToken(data.accessToken);

        setAuth({ user: data.user, loading: false, sessionExpired: false });
      } catch {
        clearAccessToken();
        setAuth({ user: null, loading: false, sessionExpired: true });
      }
    })();
  }, []);

  const value = { auth, logout, login, api };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

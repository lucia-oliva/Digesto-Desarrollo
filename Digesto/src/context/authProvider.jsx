import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { setAccessToken, clearAccessToken } from "../services/authservices";
import { setGlobalLogout } from "./globalLogout";
import api, { refreshClient } from "../api/axiosPrivate";

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    loading: true,
    sessionExpired: false,
  });

  const hardLogout = async (expired = false) => {
    try {
      await refreshClient.post("/auth/logout");
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
        const { data } = await refreshClient.post("/auth/refresh-token");
        setAccessToken(data.accessToken);

        setAuth({ user: data.user, loading: false, sessionExpired: false });
      } catch {
        clearAccessToken();
        setAuth({ user: null, loading: false, sessionExpired: true });
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      auth,
      logout,
      login,
      api,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

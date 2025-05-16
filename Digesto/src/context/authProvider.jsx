// src/context/AuthProvider.jsx
import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { getAccessToken, setAccessToken, clearAccessToken } from '../services/authservices';
import { jwtDecode } from 'jwt-decode';
import { setGlobalLogout } from './globalLogout';
import api from '../api/axiosPrivate';

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true, sessionExpired: false });

  const logout = (expired = false) => {
    clearAccessToken();
    setAuth({ user: null, loading: false, sessionExpired: expired });
  };

  useEffect(() => {
    setGlobalLogout(logout);

    const initAuth = async () => {
      let token = getAccessToken();

      if (!token) {
        try {
          const res = await api.post('http://localhost:3000/api/auth/refresh-token', {}, { withCredentials: true });
          token = res.data.accessToken;
          setAccessToken(token);
        } catch {
          return logout(true);
        }
      }

      try {
        const { user } = jwtDecode(token);
        setAuth({ user, loading: false, sessionExpired: false });
      } catch {
        logout(true);
      }
    };

    initAuth();
  }, []);

  return <AuthContext.Provider value={{ auth, logout }}>{children}</AuthContext.Provider>;
};

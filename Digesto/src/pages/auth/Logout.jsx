import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth";
import axiosPrivate from "../../api/axiosPrivate";

const Logout = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await axiosPrivate.post("/auth/logout", {}, { withCredentials: true });
        logout();
      } catch (error) {
        console.error(error?.response?.data);
      } finally {
        navigate("/login", { replace: true });
      }
    };
    doLogout();
  }, [navigate, logout]);
  return null; // O puedes mostrar un spinner o mensaje de "Cerrando sesión..."
};

export default Logout;

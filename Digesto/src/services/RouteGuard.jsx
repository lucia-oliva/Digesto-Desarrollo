/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";

const RouteGuard = ({
  mode = "auth",
  redirectTo = "/login",
  redirectTo2 = "/consejo-superior",
  fallbackTo = "/admin",
}) => {
  const { auth } = useAuth();
  const isLoggedIn = !!auth.user;

  if (auth.loading) {
    return <div className="text-gray-600 text-center p-8">Cargando...</div>;
  }

  // Si el modo es "guest", redirigimos si el usuario está autenticado
  if (mode === "guest" && isLoggedIn) {
    return <Navigate to={fallbackTo} replace />;
  }
  // Si el modo es "auth", redirigimos si el usuario no está autenticado
  if (mode === "auth" && !isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si el modo es "consejo", redirigimos si el usuario no está autenticado
  if (mode === "consejo") {
    const tipo = auth?.user?.tipo_usuario;
    const depName = auth?.user?.dependencia; 
    const isSuperAdmin = tipo === "SuperAdministrador";
    const isSupervisorCS =
      (tipo === "Supervisor" || tipo === "Administrador de Dependencia") &&
      depName === "Consejo Superior";
    if (!(isSuperAdmin || isSupervisorCS)) {
      return <Navigate to={redirectTo2} replace />;
    }
  }


  return <Outlet />;
};

export default RouteGuard;

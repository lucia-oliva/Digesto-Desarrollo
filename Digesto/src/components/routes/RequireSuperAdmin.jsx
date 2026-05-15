import { Navigate, Outlet } from "react-router"; 
import { useAuth } from "../../context/useAuth";

function RequireSuperAdmin() {
  const { auth } = useAuth();
  const tipoUser = auth?.user?.tipo_usuario;
  console.log("usuarioooooooooo",auth);

  if (tipoUser !== "SuperAdministrador") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default RequireSuperAdmin;

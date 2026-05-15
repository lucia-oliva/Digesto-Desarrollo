import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/useAuth";

function RequireConsejoSuperior() {
  const { auth } = useAuth();

  const tipoUser = auth?.user?.tipo_usuario;
  const dependencia = auth?.user?.dependencia;

  const puedeAcceder =
    tipoUser === "SuperAdministrador" ||
    dependencia === "Consejo Superior";

  if (!puedeAcceder) {
    return <Navigate to="/consejo-superior" replace />;
  }

  return <Outlet />;
}

export default RequireConsejoSuperior;
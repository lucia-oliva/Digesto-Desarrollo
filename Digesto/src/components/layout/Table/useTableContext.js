//Este archivo define los Contextos segun las rutas.
import { useLocation } from "react-router";

export const useTableContext = () => {
  const location = useLocation();

  const isAdminPath = location.pathname === "/administracion";
  const isNuevaNormativa = isAdminPath &&
    new URLSearchParams(location.search).get("option") === "Nueva Normativa";
  const isBusqueda = location.pathname === "/busqueda";

  const isAdminList = isAdminPath;
  const ocultarVisitas = isBusqueda || isNuevaNormativa;

  const getAccionContextual = () => {
    if (isNuevaNormativa) return "seleccionar";
    if (isAdminList) return "admin";
    return "ver";
  };

  return {
    isNuevaNormativa,
    isAdminList,
    ocultarVisitas,
    accion: getAccionContextual(),
  };
};

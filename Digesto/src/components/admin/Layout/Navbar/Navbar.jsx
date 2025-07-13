import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const routeTitles = {
  "/NuevaNormativa": "Nueva Normativa",
  "/ListadoNormativa": "Listado de Normativas",
  "/ListadoNormativa?filter=deleted": "Normativas Eliminadas",
  "/ListadoNormativa?filter=unpublish": "Normativas Despublicadas",
  "/NuevoUsuario": "Crear Usuario",
  "/ListadoUsuarios": "Listado de Usuarios",
  "/NuevaDependencia": "Nueva Dependencia",
  "/ListadoDependencias": "Listado de Dependencias",
  "/NuevoEmisor": "Nuevo Emisor",
  "/ListadoEmisores": "Listado de Emisores",
  "/AuditoriaUsuariosIngresosEgresos": "Auditoría de Ingresos/Egresos",
  "/AuditoriaUsuariosVisitas": "Auditoría de Visitas",
  "/AuditoriaNormativas": "Auditoría de Normativas",
  "/NuevaPalabraClave": "Nueva Palabra Clave",
  "/ListadoPalabrasClave": "Listado Palabras Clave",
  "/ConsejoSuperior": "Consejo Superior",
};

function Navbar() {
  const location = useLocation();
  const [title, setTitle] = useState("");

  useEffect(() => {
    const path = location.pathname + location.search;
    setTitle(routeTitles[path] || "Panel Principal");
  }, [location]);

  return (
    <div className="navbar bg-base-100 flex md:justify-between justify-end  shadow-md sticky top-0 z-40 px-4">
      <div className="md:block hidden">
        <h1 className="text-xl  font-bold text-primary">{title}</h1>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <FaUserCircle className="text-2xl" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/perfil">Perfil</a>
            </li>
            <li>
              <a href="/logout">Cerrar sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

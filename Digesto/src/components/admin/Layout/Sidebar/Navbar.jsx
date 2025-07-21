import { Link, useLocation } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import {routeTitles} from "./routeTitles";

export default function Navbar() {
  const location = useLocation();
  const fullPath = location.pathname + location.search;
  const pageTitle = routeTitles[fullPath] || "Digesto - Administración";
  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Título del sistema */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-primary">{pageTitle}</h1>{" "}
      </div>

      {/* Menú de perfil */}
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <FaUserCircle className="text-2xl" />
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="./logout">Cerrar sesión</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// src/pages/NotFound.jsx
import { Link, useLocation } from "react-router";
export default function NotFound() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const regresar = isAdminRoute ? "/admin" : "/";

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Contenido */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="card max-w-lg w-full bg-base-100 shadow-xl">
          <div className="card-body items-center text-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Página no encontrada
            </h1>
            <p className="py-2 text-base-content/70">
              La ruta que intentas visitar no existe o fue movida. Revisa la URL
              o vuelve al inicio.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
              <Link to={regresar} className="btn btn-primary w-full sm:w-auto">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

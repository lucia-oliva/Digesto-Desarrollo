import { Outlet } from "react-router";
import Sidebar from "./Layout/Sidebar/Sidebar";
import Navbar from "./Layout/Sidebar/Navbar";

export default function AdminLayout() {
  return (
    <div className="drawer lg:drawer-open">
      {/* Toggle del drawer */}
      <input id="drawer-sidebar" type="checkbox" className="drawer-toggle" />

      {/* Botón hamburguesa FIXEADO, totalmente fuera del flujo */}
      <label
        htmlFor="drawer-sidebar"
        className="btn btn-primary fixed top-4 left-4 z-50 drawer-button lg:hidden"
      >
        ☰
      </label>

      {/* Contenido principal */}
      <div className="drawer-content flex flex-col h-screen">
        {/* Navbar superior (ya no es empujado hacia abajo) */}
        <Navbar />

        {/* Contenido dinámico */}
        <main className="flex-1 overflow-y-auto p-4 pt-4">
          <Outlet />
        </main>
      </div>

      {/* Sidebar lateral */}
      <div className="drawer-side">
        <label htmlFor="drawer-sidebar" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
}

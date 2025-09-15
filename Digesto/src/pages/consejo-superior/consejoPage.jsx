import { Outlet, NavLink } from "react-router";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { IoIosMenu, IoIosClose } from "react-icons/io";

const LOGO_UNLAR = "/src/assets/UnlarLogo.png";

const BASE_LINKS = [
  { to: "/consejo-superior", label: "Inicio", end: true },
  { to: "/consejo-superior/integrantes", label: "Integrantes" },
  { to: "/consejo-superior/comisiones", label: "Comisiones" },
  { to: "/consejo-superior/reglamento", label: "Reglamento" },
  { to: "/consejo-superior/normativas", label: "Normativas" }, 
  { to: "/consejo-superior/sesiones", label: "Sesiones" },
   
];

const ADMIN_LINKS = [
  { to: "/consejo-superior/addsesion", label: "Agregar Sesión" },
];



function ConsejoPage() {
  const { auth } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
const links = useMemo(() => {
  const tipo = auth.user?.tipo_usuario;
  const depName = auth.user?.dependencia; 

  const isSuperAdmin = tipo === "SuperAdministrador";
  const isSupervisorCS =
    (tipo === "Supervisor" || tipo === "Administrador de Dependencia") &&
    depName === "Consejo Superior";

  if (isSuperAdmin || isSupervisorCS) {
    return [...BASE_LINKS, { type: "separator" }, ...ADMIN_LINKS];
  }
  return BASE_LINKS;
}, [auth.user?.tipo_usuario, auth.user?.dependencia]);
  

  const linkClasses = ({ isActive }) =>
    `hover:text-blue-400 transition-colors ${
      isActive ? "text-blue-400 font-semibold" : ""
    }`;

  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  return (
    <main id="main" className="bg-white text-primary-content min-h-screen">
     
      <header className="bg-primary shadow-sm border-gray-200 fixed top-0 w-full z-30">
     
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden border-b-1 sm:flex items-center h-16"
          aria-label="Navegación principal del Consejo Superior"
        >
   
          <div className="flex items-center">
            <NavLink
              className="flex flex-row justify-center items-center"
              to="/"
            >
              <img src={LOGO_UNLAR} alt="Unlar" className="h-10 w-auto" />
            </NavLink>
          </div>

        
          <ul className="flex-1 flex justify-center gap-6 text-sm sm:text-base font-medium text-white font-sans">
            {links.map((item, idx) => {
              if (item.type === "separator") {
                return (
                  <li
                    key={`sep-${idx}`}
                    role="separator"
                    aria-hidden="true"
                    className="select-none text-gray-300"
                  >
                    |
                  </li>
                );
              }
              const { to, label, end } = item;
              return (
                <li key={to}>
                  <NavLink to={to} end={end} className={linkClasses}>
                    {label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

   
          <div className="w-8" />
        </nav>

        
        <nav className="sm:hidden px-4 h-16 flex items-center justify-between">
          {/* Izquierda: Logo */}
          <NavLink to="/" onClick={closeMobile}>
            <img src={LOGO_UNLAR} alt="Unlar" className="h-8 w-auto" />
          </NavLink>

         
          <button
            className="p-2 rounded-md border border-gray-200"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={toggleMobile}
          >
            {mobileOpen ? <IoIosClose size={26} /> : <IoIosMenu size={26} />}
          </button>
        </nav>

     
        <div
          id="mobile-menu"
          className={`sm:hidden overflow-hidden transition-[max-height] duration-300 bg-white border-t border-gray-200 ${
            mobileOpen ? "max-h-[70vh]" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col py-2">
            {links.map((item) => {
              if (item.type === "separator") {
                return;
              }
              const { to, label, end } = item;
              return (
                <li key={`m-${to}`}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `block px-6 py-3 text-base ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-gray-800"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

    
      <section className="min-h-[60vh]">
        <Outlet />
      </section>
    </main>
  );
}

export default ConsejoPage;

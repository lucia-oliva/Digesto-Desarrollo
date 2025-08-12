import { Outlet, Link, useLocation } from "react-router";
import { useAuth } from "../../context/useAuth";

const NAV_LINKS = [
  { to: "/consejo-superior", label: "Inicio" },
  { to: "/consejo-superior/normativas", label: "Normativas" },
  { to: "/consejo-superior/sesiones", label: "Sesiones" },
  { to: "/consejo-superior/integrantes", label: "Integrantes" },
  { to: "/consejo-superior/reglamento", label: "Reglamento" },
  { to: "/consejo-superior/comisiones", label: "Comisiones" },
];

function ConsejoPage() {
  const location = useLocation();
  const { auth } = useAuth();
  console.log(auth);
  

  return (
    <main id="main" className="bg-white" >
      <header className="bg-white shadow-sm border-b border-gray-200 hidden sm:block">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap justify-center gap-6 py-3 text-sm sm:text-base font-medium text-gray-800 font-sans">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`hover:text-primary transition-colors ${
                    location.pathname === to ? "text-primary font-semibold" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section className="min-h-[60vh]">
        <Outlet />
      </section>

      
    </main>
  );
}

export default ConsejoPage;

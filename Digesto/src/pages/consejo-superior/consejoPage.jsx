import { Outlet, Link } from "react-router";


function ConsejoPage() {
  return (
  <main id="main">
      <div className="bg-white shadow-sm border-b border-gray-200 not-sm:hidden">
  <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ul className="flex flex-wrap justify-center gap-6 py-3 text-sm sm:text-base font-medium text-gray-800 font-sans ">
      <li>
        <Link to="/consejo-superior" className="hover:text-primary transition-colors">
          Inicio
        </Link>
      </li>
      <li>
        <Link to="/consejo-superior/normativas" className="hover:text-primary transition-colors">
          Normativas
        </Link>
      </li>
      <li>
        <Link to="/consejo-superior/sesiones" className="hover:text-primary transition-colors">
          Sesiones
        </Link>
      </li>
      <li>
        <Link to="/consejo-superior/integrantes" className="hover:text-primary transition-colors">
          Integrantes
        </Link>
      </li>
      <li>
        <Link to="/consejo-superior/reglamento" className="hover:text-primary transition-colors">
          Reglamento
        </Link>
      </li>
      <li>
        <Link to="/consejo-superior/comisiones" className="hover:text-primary transition-colors">
          Comisiones
        </Link>
      </li>
    </ul>
  </nav>
</div>

      <Outlet/>
      <footer className="footer footer-horizontal footer-center bg-primary text-primary-content font-sans p-11">
  <aside className="flex flex-col items-center">
    <p className="font-medium text-xs md:text-xs lg:text-base text-center pl-10">
      Consejo Superior | UNLaR
    </p>
  </aside>
</footer>
    </main>
  );
}

export default ConsejoPage;

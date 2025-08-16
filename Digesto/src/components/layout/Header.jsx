import { Outlet, useLocation, Link } from "react-router";
import { IoIosMenu, IoIosClose, IoIosHelpCircleOutline } from "react-icons/io";

function Header() {
  const location = useLocation();

  // Si estás en cualquier ruta que comience con "/consejo-superior", no mostramos navbar
  if (location.pathname.startsWith("/consejo-superior")) {
    return (
      <div className="mx-auto">
        <Outlet />
      </div>
    );
  }

  const navLinks = [
    { name: "Inicio", href: "/", active: location.pathname === "/" },
    {
      name: "Normativas",
      href: "/busqueda",
      active: location.pathname.startsWith("/busqueda"),
    },
    {
      name: "Sobre Digesto",
      href: "/about",
      active: location.pathname.startsWith("/about"),
    },
    {
      name: "Consejo Superior",
      href: "/consejo-superior",
      active: location.pathname.startsWith("/consejo-superior"),
    },
    { name: "Ayuda", href: "#" },
  ];

  return (
    <>
      <div className="navbar bg-primary z-50 fixed top-0 flex items-center justify-between px-4 max-h-18 w-full">
        {/* Izquierda: Logo */}
        <div className="navbar-start">
          <Link to="/" className="hover:opacity-80 transition duration-300">
            <img
              src="/src/assets/UnlarLogo.png"
              alt="UNLaR Logo"
              className="object-cover max-h-15 mask mask-squircle"
            />
          </Link>
        </div>

        {/* Centro: Menú desktop */}
        <div className="navbar-center hidden md:block">
          <ul className="menu menu-horizontal gap-4">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.href}
                  className={`text-primary-content text-lg hover:bg-primary ${
                    link.active ? "menu-active" : "after-line"
                  }`}
                >
                  {link.name === "Ayuda" ? (
                    <IoIosHelpCircleOutline size={30} />
                  ) : (
                    link.name
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Derecha: Menú mobile general */}
        <div className="navbar-end md:hidden">
          <div className="dropdown dropdown-end dropdown-bottom">
            <div
              className="btn my-4 group transition-all duration-200"
              role="button"
              tabIndex={0}
            >
              <IoIosMenu size={30} className=" group-focus:hidden " />
              <IoIosClose size={30} className="hidden group-focus:block" />
            </div>
            <ul className="bg-primary text-primary-content menu dropdown-content w-screen -mr-4">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className={`${
                      link.active ? "menu-active" : "after-line"
                    } text-2xl pl-20 `}
                  >
                    | {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="mx-auto mt-18">
        <Outlet />
      </div>
    </>
  );
}

export default Header;

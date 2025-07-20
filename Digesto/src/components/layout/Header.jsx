import { Outlet, useLocation } from "react-router";
import { Link } from "react-router";
import { IoIosMenu, IoIosClose, IoIosHelpCircleOutline } from "react-icons/io";

function Header() {
  const location = useLocation();
  const navLinks = [
    {
      name: "Inicio",
      href: "/",
      active: location.pathname === "/" ? true : false,
    },
    {
      name: "Consejo",
      href: "/consejo-superior",
      active: location.pathname === "/consejo-superior",
    },
    {
      name: "Normativas",
      href: "/busqueda",
      active: location.pathname === "/busqueda" ? true : false,
    },
    {
      name: "Sobre Digesto",
      href: "/about",
      active: location.pathname === "/about" ? true : false,
    },
    {
      name: "Ayuda",
      href: "#",
    },
    {
      name: "Normativas",
      href: "/consejo-superior/normativas",
      mobileConsejo: true,
    },
    {
      name: "Sesiones",
      href: "/consejo-superior/sesiones",
      mobileConsejo: true,
    },
    {
      name: "Integrantes",
      href: "/consejo-superior/integrantes",
      mobileConsejo: true,
    },
    {
      name: "Reglamento",
      href: "/consejo-superior/reglamento",
      mobileConsejo: true,
    },
    {
      name: "Comisiones",
      href: "/consejo-superior/comisiones",
      mobileConsejo: true,
    },
    {
      name: "Inico",
      href: "/consejo-superior/inicio",
      mobileConsejo: true,
    }
  ];

  return (
    <>
      <div className="navbar bg-primary z-50 fixed top-0 flex items-center justify-between px-4 max-h-18">
        <div className="navbar-start">
          <Link to="/" className="hover:opacity-80 transition duration-300">
            <img
              src="/src/assets/UnlarLogo.png"
              alt="UNLaR Logo"
              className="object-cover max-h-15 mask mask-squircle"
            />
          </Link>
        </div>

        {/* Desktop */}
        <div className="navbar-center hidden md:block">
          {location.pathname.startsWith("/consejo-superior") ? (
            <div className="h-full flex items-center">
              <img
                src="/src/assets/consejoblue.png"
                alt="Consejo Superior Logo"
                className="max-h-16 object-contain"
              />
            </div>
          ) : (
            <ul className="menu menu-horizontal gap-4">
              {navLinks
                .filter(
                  (link) => !link.mobileConsejo && link.name !== "Consejo"
                )
                .map((link, index) => (
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
          )}
        </div>

        {/* Mobile*/}
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
              {navLinks.map((link, index) => {
                if (location.pathname.startsWith("/consejo-superior")) {
                  if (link.mobileConsejo) {
                    return (
                      <li key={index}>
                        <Link to={link.href} className="text-2xl pl-20">
                          | {link.name}
                        </Link>
                      </li>
                    );
                  }
                  return null;
                }
                if (!link.mobileConsejo && link.name !== "Consejo") {
                  return (
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
                  );
                }
                return null;
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-18">
        <Outlet />
      </div>
    </>
  );
}

export default Header;

import { Outlet } from "react-router";
import { Link } from "react-router";
import { IoIosMenu, IoIosClose, IoIosHelpCircleOutline } from "react-icons/io";
import { useLocation } from "react-router";
import { FaUserAlt } from "react-icons/fa";
import { IconContext } from "react-icons/lib";



function Header() {
  const location = useLocation();
  console.log(location);

  if(location.pathname === "/admin"){
    return (
      <>
        <div className="navbar bg-primary z-60 fixed top-0 flex items-center justify-between px-4 max-h-18">
          <div className="navbar-start">
            <Link to="/" className="hover:opacity-80 transition duration-300">
              <img
                src="/src/assets/UnlarLogo.png"
                alt="UNLaR Logo"
                className="object-cover max-h-15 mask mask-squircle"
              />
            </Link>
                <h1 className="text-white cls font-sans">Digesto - Administracion</h1>
          </div>
          <div className="navbar-center hidden md:block">

          </div>
             <ul className="menu menu-horizontal gap-4">
              
              <li className={`menu-item ${location.pathname === "/admin" ? "active" : ""}`}> 
                <Link to="/admin" className="text-white hover:text-gray-400 transition duration-300">
                <IconContext.Provider value={{ size: 20, color: "#ffffff"}}>
                <FaUserAlt/>
                </IconContext.Provider></Link>
              </li>
              
             </ul>
        </div>
        <div className="mx-auto mt-18">
        <Outlet />
        </div>
      </>
    )
  }

  const navLinks = [
    {
      name: "Inicio",
      href: "/",
      active: location.pathname === "/" ? true : false,
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

        {/* Mobile Menu Toggle */}
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
      {/* Mobile */}

      <div className="mx-auto mt-18">
        <Outlet />
      </div>
    </>
  );
}

export default Header;

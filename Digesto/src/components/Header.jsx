import { useState } from "react";
import { Outlet } from "react-router";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navLinks = [
    { name: "Inicio", href: "#" },
    { name: "Búsqueda Avanzada", href: "#" },
    { name: "Portal Web UNLaR", href: "#" },
    { name: "Contacto", href: "#" },
    { name: "Ayuda", href: "#" },
    { name:"Sobre Digesto", href:"#" }
  ];

  return (
    <>
      <div className="navbar fixed z-10 bg-[#1B5B98] shadow-sm  h-0 px-4 lg:h-15">
        <div className="flex-1">
          <img
            src="https://scontent.firj1-1.fna.fbcdn.net/v/t39.30808-6/471075368_988473086645323_6248816904898158674_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=MzAEWlqv0fsQ7kNvgFXin7g&_nc_oc=AdhWQ9utiV5kMG6hPBMKWGLA01jg0X9270GctGt0-eS7JkdXb9xKvIyBmtTZzJJT-1c&_nc_zt=23&_nc_ht=scontent.firj1-1.fna&_nc_gid=AI3e4X20wOMnJDD8nZItPf5&oh=00_AYBdWHDKYOuhpHwVaxAQoEPMfp4gniWfXw7jMSt0AsBNyg&oe=67CF9089"
            className="object-cover max-h-15 mask mask-squircle lg:max-h-15"
          />
        </div>
        
        {/* Desktop */}
        <div className="hidden md:flex">
          <ul className="menu menu-horizontal px-1">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a className="font-[Montserrat] text-white transition duration-300 ease-in-out 
                             hover:bg-blue-900 
                             px-4 py-2 rounded lg:text-base xl:text-md" href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="md:hidden btn btn-circle bg-[#1B5B98] border-1-blue flex items-center justify-center"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M6.225 4.811a.75.75 0 0 1 1.06 0L12 9.525l4.715-4.714a.75.75 0 1 1 1.06 1.06L13.06 10.585l4.715 4.715a.75.75 0 0 1-1.06 1.06L12 11.645l-4.715 4.715a.75.75 0 1 1-1.06-1.06l4.715-4.715L6.225 5.87a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75Zm0 5.25A.75.75 0 0 1 3.75 12h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd"/>
            </svg>
          )}
        </button>
      </div>

      {/* Movil */}
      <ul className={`menu bg-[#1B5B98] w-auto transition-all duration-300 ${menuOpen ? "block" : "hidden"}  md:hidden`}>
        {navLinks.map((link, index) => (
          <li key={index}>
            <a className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent" href={link.href}>
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      <Outlet />
    </>
  );
}

export default Header;

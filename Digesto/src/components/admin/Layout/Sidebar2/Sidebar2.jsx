import { useState } from "react";
import { Link, useLocation } from "react-router";
import { menuItems } from "./MenuItems";

export default function Sidebar2() {
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();

  const toggleSection = (title) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  return (
    <div className="menu  bg-primary text-base-100 justify-around p-4 w-3/4 sm:w-1/2 md:w-1/4 lg:w-52 min-h-full"
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={() => setOpenSection(null)}

    >
      {/* Logo */}
      <Link to="/admin" className="mb-4 text-xl font-bold">
        Digesto UNLaR
      </Link>

      {/* Recorrer menú dinámicamente */}
      {menuItems.map((item) => {
        const hasChildren = Array.isArray(item.children);
        const isOpen = openSection === item.title;

        if (!hasChildren) {
          return (
            <li key={item.title} className="mt-2">
              <Link
                to={item.path}
                className={`flex items-center gap-2 btn btn-ghost justify-start w-full ${
                  location.pathname === item.path ? "bg-primary text-white font-semibold" : ""
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          );
        }

        return (
          <div key={item.title} className="w-full">
            {/* Botón del ítem padre */}
            <button
              onClick={() => toggleSection(item.title)}
              className={`w-full text-left btn btn-ghost flex items-center justify-between px-2 py-2 mb-1 ${
                isOpen ? "bg-base-200 text-black" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.title}
              </span>
              <span className="text-sm">{isOpen ? "▾" : "▸"}</span>
            </button>

            {/* Submenú animado */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="menu menu-sm pl-6 mb-2">
                {item.children.map((child) => (
                  <li key={child.path}>
                    <Link
                      to={child.path}
                      className={`btn btn-ghost justify-start w-full text-left ${
                        location.pathname === child.path ? "bg-base-300 text-primary font-semibold" : ""
                      }`}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

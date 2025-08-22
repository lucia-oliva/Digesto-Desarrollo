import { useState } from "react";
import { Link, useLocation } from "react-router";
import { menuItems } from "./MenuItems";
import { useAuth } from "../../../../context/useAuth";

export default function Sidebar() {
  const { auth } = useAuth();
  const rol = auth.user.tipo_usuario || {};
  const [openSection, setOpenSection] = useState(null);
  const { pathname } = useLocation();
  const itemPath = pathname
    .split("/")
    .slice(1, 3)
    .join("/")
    .replace("admin", ".");

  const toggleSection = (title) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  const canAccess = (roles) => !roles || roles.includes(rol);

  return (
    <div
      className="menu  bg-primary text-base-100 justify-around p-4 w-3/4 sm:w-1/2 md:w-1/4 lg:w-52 min-h-full "
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
        const itemDisabled = !canAccess(item.roles);

        if (!hasChildren) {
          return (
            <li key={item.title} className="mt-2">
              <Link
                to={itemDisabled ? "#" : item.path}
                className={`flex items-center gap-2 justify-start w-full ${
                  item.children?.some((child) => child.path).includes(itemPath)
                    ? "bg-base-300 text-primary font-semibold"
                    : ""
                }  ${
                  itemDisabled
                    ? "pointer-events-none cursor-not-allowed"
                    : "btn btn-ghost bg-amber-400"
                }`}
                tabIndex={itemDisabled ? -1 : 0}
                aria-disabled={itemDisabled}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          );
        }

        // Children
        return (
          <div key={item.title} className="w-full">
            <button
              onClick={() => !itemDisabled && toggleSection(item.title)}
              className={`w-full text-left btn btn-ghost flex items-center justify-between px-2 py-2 mb-1 ${
                isOpen ? "bg-base-200 text-black" : ""
              } ${itemDisabled ? " cursor-not-allowed" : ""}`}
              disabled={itemDisabled}
              tabIndex={itemDisabled ? -1 : 0}
              aria-disabled={itemDisabled}
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.title}
              </span>
              <span className="text-sm">{isOpen ? "▾" : "▸"}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="menu menu-sm pl-6 mb-2">
                {item.children.map((child) => {
                  const childDisabled = !canAccess(child.roles || item.roles);
                  return (
                    <li key={child.path}>
                      <Link
                        to={childDisabled ? "#" : child.path}
                        className={`justify-start w-full text-left ${
                          itemPath === child.path
                            ? "bg-base-300 text-primary font-semibold"
                            : ""
                        } ${
                          childDisabled
                            ? "!bg-blue-900 !text-blue-200 pointer-events-none cursor-not-allowed"
                            : "btn btn-ghost"
                        }`}
                        tabIndex={childDisabled ? -1 : 0}
                        aria-disabled={childDisabled}
                      >
                        {child.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

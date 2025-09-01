// components/layout/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { menuItems } from "./MenuItems";
import { useAuth } from "../../../../context/useAuth";
import { FaLock } from "react-icons/fa6";

export default function Sidebar() {

  const { auth } = useAuth();
  const rol = auth.user?.tipo_usuario || {};
  const [openSection, setOpenSection] = useState(null);
  const { pathname } = useLocation();
  const itemPath = pathname.split("/").slice(1, 3).join("/").replace("admin", ".");

  function canAccess(roles) {
    if (!roles) {
      return true;
    }
    return roles.includes(rol);
  }

  const handleParentClick = (title, disabled) => {
    if (disabled) return;

    if (openSection === title) {
      setOpenSection(null);
    } else {
      setOpenSection(title);
    }
  };

  return (
    <div
      className="menu bg-primary text-base-100 font-[Montserrat] justify-around p-4 w-3/4 sm:w-1/2 md:w-1/4 lg:w-52 min-h-full"
      onClick={(e) => e.stopPropagation()}
    >
    
      <Link to="/admin" className="mb-4 text-xl font-bold">
        Digesto UNLaR
      </Link>

      
      {menuItems.map((item) => {
        
        const hasChildren = Array.isArray(item.children);
        const isOpen = openSection === item.title;
        const itemDisabled = !canAccess(item.roles);

        if (!hasChildren) {
          return (
            <li key={item.title} className="mt-2">
              <Link
                to={itemDisabled ? "#" : item.path}
                className={[
                  "group flex items-center gap-3 justify-start w-full px-3 py-2 rounded-md transition",
                  "border border-transparent hover:bg-white/5 hover:border-white/10",
                  itemDisabled
                    ? "opacity-60 pointer-events-none"
                    : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                ].join(" ")}
                tabIndex={itemDisabled ? -1 : 0}
                aria-disabled={itemDisabled}
              >
                {itemDisabled && (
                  <FaLock className="text-xs opacity-70" aria-hidden />
                )}
                <span className="inline-flex w-5 justify-center">
                  {item.icon}
                </span>
                <span className="truncate">{item.title}</span>
              </Link>
            </li>
          );
        }

        return (
          <div key={item.title} className="w-full">
            <button
              onClick={() => handleParentClick(item.title, itemDisabled)}
              className={[
                "w-full text-left flex items-center justify-between px-3 py-2 mb-1 rounded-md transition",
                isOpen ? "bg-white/10" : "hover:bg-white/5",
                itemDisabled
                  ? "opacity-60 "
                  : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
              ].join(" ")}
              disabled={itemDisabled}
              tabIndex={itemDisabled ? -1 : 0}
              aria-disabled={itemDisabled}
            >
              <span className="flex items-center gap-3">
                {itemDisabled && (
                  <FaLock className="text-xs opacity-70" aria-hidden />
                )}
                <span className="inline-flex w-5 justify-center">
                  {item.icon}
                </span>
                {item.title}
              </span>
              {!itemDisabled && (
                <span className="text-sm">{isOpen ? "▾" : "▸"}</span>
              )}
            </button>

          
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="menu menu-sm pl-3 mb-2">
                {item.children.map((child) => {
                  const childDisabled = !canAccess(child.roles || item.roles);
                  const childActive = itemPath === child.path;

                  return (
                    <li key={child.path} className="mt-1">
                      <Link
                        to={childDisabled ? "#" : child.path}
                        className={[
                          "relative flex items-center justify-start w-full text-left px-3 py-2 rounded-md transition",
                          childActive ? "bg-white/10" : "hover:bg-white/5",
                          childDisabled
                            ? "opacity-60 pointer-events-none cursor-not-allowed"
                            : "btn-ghost",
                        ].join(" ")}
                        tabIndex={childDisabled ? -1 : 0}
                        aria-disabled={childDisabled}
                      >
                        {childActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-sm bg-white/80" />
                        )}
                        {childDisabled && (
                          <FaLock
                            className="mr-2 text-xs opacity-70"
                            aria-hidden
                          />
                        )}
                        <span className="truncate">{child.name}</span>
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

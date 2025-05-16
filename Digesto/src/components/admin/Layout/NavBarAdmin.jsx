import SidebarMenuContent from "./Sidebar/SideBarContent";
import { useState, useRef } from "react";

function NavbarPrivate() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  return (
    <>
      <div className="navbar bg-primary text-base-100 fixed top-0 left-0 w-full z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Administracion Digesto</a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex-none md:hidden">
          <button
            className="btn btn-ghost"
            onClick={() => setOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Fixed, full-width animated dropdown */}
      <div
        ref={menuRef}
        className={`fixed left-0 top-[4rem] w-screen bg-primary text-white z-40 overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <SidebarMenuContent className="p-4" />
      </div>
    </>
  );
}

export default NavbarPrivate;

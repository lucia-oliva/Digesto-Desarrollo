import { useState } from "react";
import SideBar from "./Sidebar";

function SideBarWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div onMouseLeave={() => setOpenMenu(null)}>
      {/* Botón hamburguesa (visible solo en móvil) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-900 text-white rounded"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <SideBar
        isOpen={isOpen}
        closeSidebar={closeSidebar}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
    </div>
  );
}

export default SideBarWrapper;

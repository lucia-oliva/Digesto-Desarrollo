import SidebarMenuContent from "./SideBarContent";
import PropTypes from "prop-types";

function SideBar({ isOpen, closeSidebar }) {
  return (
    <div className="flex flex-col bg-base-100 gap-4 cursor-default h-screen">
    {/* Logo */}

    <div className="flex items-center justify-center h-16">
      <h1 className="text-2xl font-bold p-8">Digesto</h1>
    </div>

    <aside
      className={`
    group fixed top-0 left-0 z-50 bg-blue-900 text-white pt-10
    transition-all duration-300 rounded-tr-[8rem]
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 md:relative md:block
    w-60 hover:w-60 md:w-24 md:hover:w-60
    h-screen
  `}
    >
      <SidebarMenuContent className="p-4" />

      {/* Botón de cerrar en móvil */}
      <button
        className="absolute top-4 right-4 text-white md:hidden"
        onClick={closeSidebar}
      >
        ✕
      </button>
    </aside>
    </div>
  );
}

SideBar.propTypes = {
  isOpen: PropTypes.bool,
  closeSidebar: PropTypes.func,
};

export default SideBar;

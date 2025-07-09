import SidebarMenuContent from "./SideBarContent";
import PropTypes from "prop-types";

function SideBar({ isOpen, closeSidebar }) {
  return (
    
    <div className="flex flex-col bg-base-100 gap-4 cursor-default h-screen">
      {/* Logo */}
      <div>
        <img
      src="/src/assets/unlar-oscuro.png"
      alt="UNLaR Logo"
      className="object-cover max-h-14 mt-1"
    />
      </div>

  

   

    <aside
      className={`
    group fixed top-0 left-0 z-50 bg-blue-900 text-white pt-10
    transition-all duration-300 md:rounded-tr-4xl
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 md:relative md:block
    w-60 hover:w-60 md:w-30 md:hover:w-60
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

import SidebarMenuContent from "./SideBarContent";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { useIsTouchDevice } from "./hook/useIstouchDevice";

function SideBar({
  isOpen,
  closeSidebar,
  openMenu,
  setOpenMenu,
  activeItem,
  setActiveItem,
}) {
  const navigate = useNavigate();
  const isTouch = useIsTouchDevice();

  const handleToggle = (title) => {
    setOpenMenu((prev) => (prev === title ? null : title));
    setActiveItem(title);
  };

  const handleSubItemClick = (subitem) => {
    setActiveItem(subitem.name || subitem.title);
    if (window.innerWidth < 768) {
      closeSidebar();
    }
    navigate(subitem.path);
    setOpenMenu(null);
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 bg-blue-900 text-white
        transition-all duration-300 ease-in-out group
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:block
        w-full h-screen overflow-y-auto py-4
        ${isTouch ? "md:w-56" : "md:w-24 md:hover:w-56 lg:w-20 lg:hover:w-60"}
        group
      `}
    >
      {/* Logo */}
      <div
        onClick={() => {
          if (window.innerWidth >= 768) {
            navigate("/admin");
          }
        }}
        className="px-4 flex items-center gap-2 transition-all duration-300 cursor-default md:cursor-pointer"
      >
        <img
          src="/src/assets/UnlarLogo.png"
          alt="UNLaR Logo"
          className="object-contain max-h-10 transition-all duration-300"
        />
        <span
          className={`
    text-xl font-bold whitespace-nowrap transition-all duration-300
    ${isTouch ? "inline" : "hidden md:group-hover:inline md:inline"}
  `}
        >
          Digesto
        </span>
      </div>

      <SidebarMenuContent
        className="p-4"
        openMenu={openMenu}
        activeItem={activeItem}
        handleToggle={handleToggle}
        handleSubItemClick={handleSubItemClick}
        isTouch={isTouch}
      />

      <button
        className="absolute top-4 right-4 text-white md:hidden"
        onClick={closeSidebar}
      >
        ✕
      </button>
    </aside>
  );
}

SideBar.propTypes = {
  isOpen: PropTypes.bool,
  closeSidebar: PropTypes.func,
  openMenu: PropTypes.string,
  setOpenMenu: PropTypes.func,
  activeItem: PropTypes.string,
  setActiveItem: PropTypes.func,
};

export default SideBar;

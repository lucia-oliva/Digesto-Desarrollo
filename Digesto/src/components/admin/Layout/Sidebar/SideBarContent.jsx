import { menuItems } from "./MenuItems";
import { SideBarItem } from "./SideBarItems";
import PropTypes from "prop-types";

function SidebarMenuContent({
  className = "",
  openMenu,
  activeItem,
  handleToggle,
  handleSubItemClick,
  isTouch,
}) {
  return (
    <ul className={`menu ${className} flex flex-col flex-nowrap h-full space-y-4`}>
      {menuItems.map((item) => (
        <SideBarItem
          key={item.title}
          item={item}
          activeItem={activeItem}
          openMenu={openMenu}
          handleToggle={handleToggle}
          handleSubItemClick={handleSubItemClick}
          isTouch={isTouch}
        />
      ))}
    </ul>
  );
}

export default SidebarMenuContent;

SidebarMenuContent.propTypes = {
  className: PropTypes.string,
  openMenu: PropTypes.string,
  activeItem: PropTypes.string,
  handleToggle: PropTypes.func.isRequired,
  handleSubItemClick: PropTypes.func.isRequired,
  isTouch: PropTypes.bool.isRequired,
};

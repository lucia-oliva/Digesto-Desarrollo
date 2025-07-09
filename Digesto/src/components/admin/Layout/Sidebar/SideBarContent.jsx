import { useState } from "react";
import { useNavigate } from "react-router";
import { menuItems } from "./MenuItems";
import { SideBarItem } from "./SideBarItems";
import PropTypes from "prop-types";


function SidebarMenuContent({ className = ""}) {
  const [activeItem, setActiveItem] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (title) => {
    setOpenMenu((prev) => (prev === title ? null : title));
    setActiveItem(title);
  };

  const handleSubItemClick = (subitem) => {
    setActiveItem(subitem.name || subitem.title);
    if (subitem.path) navigate(subitem.path);
  };

  return (
    <ul className={`menu ${className} flex flex-col justify-around h-full `}>
      {menuItems.map((item) => (
        <SideBarItem
          key={item.title}
          item={item}
          activeItem={activeItem}
          openMenu={openMenu}
          handleToggle={handleToggle}
          handleSubItemClick={handleSubItemClick}
        />
      ))}
    </ul>
  );
}

export default SidebarMenuContent;


SidebarMenuContent.propTypes= {
    className: PropTypes.string
};
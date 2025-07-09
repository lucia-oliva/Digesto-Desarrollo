import PropTypes from "prop-types";
import { useState } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

export const SideBarItem = ({ item, activeItem, handleSubItemClick }) => {
  const hasChildren = item.children?.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    if (hasChildren) {
      setIsOpen((prev) => !prev);
    } else {
      handleSubItemClick(item);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <li className="relative">
      <div onMouseLeave={closeMenu} className="w-full">
        <button
          onClick={toggleMenu}
          className={`flex items-center gap-3 w-full text-left py-2 rounded transition-colors
            ${
              activeItem === item.title
                ? "bg-primary-focus font-semibold"
                : "hover:bg-primary-focus"
            }
          `}
        >
          {/* Icon */}
          <span className="text-xl">{item.icon}</span>

          {/* Label (only visible in expanded view) */}
          <span
            className="truncate transition-all duration-300 
  opacity-100 ml-0 
  md:opacity-0 md:group-hover:opacity-100 
  md:ml-[-20%] md:group-hover:ml-0 
  whitespace-nowrap"
          >
            {item.title}
          </span>
          {/* Agrega una flecha */}
          {hasChildren && (
            <IoMdArrowDropright
              className="text-xl transition-all duration-300 
      opacity-100 ml-0 
      md:opacity-0 md:group-hover:opacity-100 
      md:ml-[-20%] md:group-hover:ml-0"
            />
          )}
        </button>

        {/* Submenu */}
        {hasChildren && isOpen && (
          <div
            className="absolute top-0 left-full z-10 w-48
                       bg-primary shadow-lg rounded
                       transition-opacity duration-300 opacity-100"
          >
            <ul className="menu p-2">
              {item.children.map((subitem) => (
                <li key={subitem.name}>
                  <button
                    onClick={() => {
                      handleSubItemClick(subitem);
                      closeMenu();
                    }}
                    className={`w-full text-left px-2 py-1 rounded transition-colors text-sm
                      ${
                        activeItem === subitem.name
                          ? "bg-base-200 text-primary font-semibold"
                          : "hover:bg-primary-content hover:text-primary"
                      }
                    `}
                  >
                    {subitem.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
};

SideBarItem.propTypes = {
  item: PropTypes.object.isRequired,
  activeItem: PropTypes.string,
  handleSubItemClick: PropTypes.func.isRequired,
};

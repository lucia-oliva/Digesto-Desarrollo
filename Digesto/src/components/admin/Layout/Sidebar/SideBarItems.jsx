import propTypes from "prop-types";
import { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";

export const SideBarItem = ({
  item,
  activeItem,
  openMenu,
  handleToggle,
  handleSubItemClick,
}) => {
  const hasChildren = item.children?.length > 0;
  const isOpen = openMenu === item.title;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
    else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <li className="relative">
      <button
        className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded transition-colors
          ${activeItem === item.title ? "bg-primary-focus font-semibold" : "hover:bg-primary-focus"}
        `}
        onClick={() =>
          hasChildren ? handleToggle(item.title) : handleSubItemClick(item)
        }
      >
        {/* Icon */}
        <span className="text-xl">{item.icon}</span>

        {/* Label (only visible on expand) */}
        <span className="truncate transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:ml-0 ml-[-100%] whitespace-nowrap">
          {item.title}
        </span>

        {/* Arrow icon if has children */}
        {hasChildren &&
          (isOpen ? (
            <IoMdArrowDropdown className="ml-auto text-xl hidden group-hover:inline" />
          ) : (
            <IoMdArrowDropright className="ml-auto text-xl hidden group-hover:inline" />
          ))}
      </button>

      {/* Submenu */}
      {hasChildren && (
        <div
          className={`ml-3 overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {visible && (
            <ul className="menu pl-6">
              {item.children.map((subitem) => (
                <li key={subitem.name}>
                  <button
                    className={`w-full text-left px-2 py-1 rounded transition-colors text-sm
                      ${activeItem === subitem.name
                        ? "bg-base-100 text-primary font-semibold"
                        : "hover:bg-primary-content hover:text-primary"}
                    `}
                    onClick={() => handleSubItemClick(subitem)}
                  >
                    {subitem.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

SideBarItem.propTypes = {
  item: propTypes.object.isRequired,
  activeItem: propTypes.string,
  openMenu: propTypes.string,
  handleToggle: propTypes.func.isRequired,
  handleSubItemClick: propTypes.func.isRequired,
};

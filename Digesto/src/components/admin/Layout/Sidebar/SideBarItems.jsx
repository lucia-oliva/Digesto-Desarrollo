import propTypes from "prop-types";
import { useEffect, useState } from "react";

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

  // Control submenu mount for animation
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <li>
      {/* Main item */}
      <button
        className={`w-full text-left px-3 py-2 rounded transition-colors ${
          activeItem === item.title
            ? "bg-primary-focus font-semibold"
            : "hover:bg-primary-focus"
        }`}
        onClick={() =>
          hasChildren ? handleToggle(item.title) : handleSubItemClick(item)
        }
      >
        {item.title}
      </button>

      {/* Submenu */}
      {hasChildren && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ml-3 navbar-menu ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {visible && (
            <ul className="menu">
              {item.children.map((subitem) => (
                <li key={subitem.name}>
                  <button
                    className={`w-full text-left px-3 py-1 rounded transition-colors ${
                      activeItem === subitem.name
                        ? "bg-base-100 text-primary font-semibold"
                        : "hover:bg-primary-content hover:text-primary"
                    }`}
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

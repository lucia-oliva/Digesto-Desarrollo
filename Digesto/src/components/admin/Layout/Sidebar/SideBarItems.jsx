import PropTypes from "prop-types";
import { useRef, useEffect, useState } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

export const SideBarItem = ({
  item,
  activeItem,
  openMenu,
  handleToggle,
  handleSubItemClick,
  isTouch,
}) => {
  const hasChildren = item.children?.length > 0;
  const isOpen = openMenu === item.title;
  const submenuRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");
  

  useEffect(() => {
    if (isOpen && submenuRef.current) {
      setMaxHeight(`${submenuRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

  return (
    <li className="w-full">
      <button
        onClick={() => handleToggle(item.title)}
        className={`btn btn-ghost w-full justify-between text-sm px-3 py-2 rounded ${
          activeItem === item.title ? "bg-primary text-white font-semibold" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{item.icon}</span>
          <span
            className={`
    truncate transition-all duration-300
    ${isTouch ? "inline" : "hidden md:group-hover:inline md:inline"}
  `}
          >
            {item.title}
          </span>
        </div>
        {hasChildren &&
          (isOpen ? (
            <IoMdArrowDropdown
              className={`text-lg transition-all duration-300
    ${isTouch ? "inline" : "hidden md:group-hover:inline md:inline"}
  `}
            />
          ) : (
            <IoMdArrowDropright
              className={`text-lg transition-all duration-300
    ${isTouch ? "inline" : "hidden md:group-hover:inline md:inline"}
  `}
            />
          ))}
      </button>

      {hasChildren && (
        <div
          ref={submenuRef}
          style={{
            maxHeight,
            overflow: "hidden",
            transition: "max-height 0.3s ease, opacity 0.3s ease",
            backgroundColor: "var(--bg-base-primary)",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <ul className="menu menu-sm pl-6 py-1 space-y-1 bg-base-100 rounded-box">
            {item.children.map((subitem) => (
              <li key={subitem.name}>
                <button
                  onClick={() => handleSubItemClick(subitem)}
                  className={`w-full text-left text-sm px-2 py-1.5 text-primary font-medium rounded btn-ghost justify-start ${
                    activeItem === subitem.name
                      ? "bg-base-200 text-primary font-semibold"
                      : "hover:bg-base-300"
                  }`}
                >
                  {subitem.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

SideBarItem.propTypes = {
  item: PropTypes.object.isRequired,
  activeItem: PropTypes.string,
  openMenu: PropTypes.string,
  handleToggle: PropTypes.func.isRequired,
  handleSubItemClick: PropTypes.func.isRequired,
  isTouch: PropTypes.bool.isRequired,
};

import PropTypes from "prop-types";
import { IoClose, IoExit } from "react-icons/io5";
import { useEffect, useState } from "react";

export const Loading = () => {
  return (
    <div className="flex flex-row bg-transparent">
      <span className="loading loading-bars self-center w-30 bg-gradient-to-r from-emerald-500 via-cyan-500 to-primary" />
    </div>
  );
};

export const Alert = ({ message, title, error, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Show animation on mount
  useEffect(() => {
    const entry = setTimeout(() => setFadeIn(true), 50); // trigger fade-in
    const exit = setTimeout(() => setFadeIn(false), duration - 300); // start fade-out before unmount
    const final = setTimeout(() => setVisible(false), duration);

    return () => {
      clearTimeout(entry);
      clearTimeout(exit);
      clearTimeout(final);
    };
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={`alert transition-opacity duration-300 ease-in-out
        ${error ? "alert-error" : "alert-success"}
        border-0 w-fit self-center py-4 px-8 relative
        ${fadeIn ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* Manual close */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-base-200 hover:text-base-content"
      >
        <IoClose size={20} />
      </button>

      <div className="flex flex-col pr-6">
        <h1
          className={`${
            error ? "text-error-content" : "text-success-content"
          } text-lg font-semibold`}
        >
          {title}
        </h1>
        <p className="text-base-200">{message}</p>
      </div>

      <IoExit size={30} className="text-base-200 ml-2" />
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  error: PropTypes.bool,
  duration: PropTypes.number, // auto-dismiss time in ms
};

Alert.defaultProps = {
  title: "Aviso",
  error: false,
  duration: 5000, // 5 seconds
};

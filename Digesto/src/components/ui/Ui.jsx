import PropTypes from "prop-types";
import { IoExit } from "react-icons/io5";

export const Loading = () => {
  return (
    <div className="flex flex-row">
      <span className="loading loading-bars self-center w-30 bg-gradient-to-r from-emerald-500 via-cyan-500 to-primary" />
    </div>
  );
};

export const Alert = ({ message, title, error }) => {
  return (
    <div
      role="alert"
      className={`alert ${
        !error ? "alert-error" : "alert-success"
      } border-0 w-fit self-center py-4 px-8 `}
    >
      <div className=" flex flex-col ">
        <h1
          className={`${
            !error ? "text-error-content" : "text-success-content"
          } text-lg font-semibold`}
        >
          {" "}
          {title}{" "}
        </h1>
        <p className="text-base-200"> {message} </p>
      </div>
      <IoExit size={30} className="text-base-200" />
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  title: PropTypes.string,
  error: PropTypes.bool,
};

import { useEffect } from "react";
import PropTypes from "prop-types";

export const ConfirmDialog = ({
  title = "Confirmar acción",
  message = "¿Estás seguro de continuar?",
  onConfirm,
  onCancel,
  isOpen,
  setIsOpen,
}) => {
  // Cierra con tecla Escape
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 text-center">
        <h2 className="text-xl font-semibold text-primary mb-2">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              onConfirm();
              setIsOpen(false);
            }}
            className="btn bg-primary text-white hover:bg-primary-focus border-none px-6"
          >
            Confirmar
          </button>

          <button
            onClick={() => {
              onCancel?.();
              setIsOpen(false);
            }}
            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 border-none px-6"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

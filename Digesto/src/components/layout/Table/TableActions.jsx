//Este compononente se encarga de los botones de la tabla, asignandolas segun un contexto(ruta)
import { useTableContext } from "./useTableContext";
import PropTypes from "prop-types";

function TableActions({ normativa, isSelected, onSelect, onDeselect, onEdit, onDelete }) {
  const { accion } = useTableContext();

  return (
    <div className="flex justify-center mt-4">
      {accion === "seleccionar" ? (
        isSelected(normativa.id) ? (
          <button
            onClick={() => onDeselect(normativa.id)}
            className="btn btn-primary btn-md hover:bg-primary hover:text-white py-6"
          >
            Deseleccionar
          </button>
        ) : (
          <button
            onClick={() =>
              onSelect({
                id: normativa.id,
                titulo: normativa.titulo,
                numero: normativa.numero,
              })
            }
            className="btn btn-outline btn-md py-6 hover:bg-primary hover:text-white"
          >
            Seleccionar
          </button>
        )
      ) : accion === "admin" ? (
        <div className="flex flex-col items-center gap-2">
          <a
            href={`document/${normativa.id}`}
            className="btn btn-primary btn-md"
          >
            Ver Normativa
          </a>
          <button
            onClick={() => onEdit(normativa)}
            className="btn btn-secondary btn-md px-11 m-1"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(normativa.id)}
            className="btn btn-error btn-md px-9 m-1"
          >
            Eliminar
          </button>
        </div>
      ) : (
        <a
          href={`/document/${normativa.id}`}
          className="btn btn-outline btn-md hover:bg-primary hover:text-white py-6"
        >
          Ver Normativa
        </a>
      )}
    </div>
  );
}

export default TableActions;

TableActions.propTypes = {
  normativa: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titulo: PropTypes.string.isRequired,
    numero: PropTypes.string, // necesario para el modal
  }).isRequired,
  isSelected: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDeselect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

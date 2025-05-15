//Este componente es la visualizacion en Mobile de Table.
import PropTypes from "prop-types";
import TableActions from "./TableActions";
import { useTableContext } from "./useTableContext";

function TableMobile({
  normativas,
  isSelected,
  onSelect,
  onDeselect,
  onEdit,
  onDelete,
}) {
  const { ocultarVisitas } = useTableContext();

  return (
    <div className="grid grid-cols-1 md:hidden gap-4">
      {normativas?.map((normativa) => (
        <div
          key={normativa.id}
          className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {normativa.titulo}
          </h2>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600">
              <strong>Número:</strong> {normativa.numero}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fecha:</strong> {normativa.fecha}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Dependencia:</strong> {normativa.dependencia}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Emisor:</strong> {normativa.emisor}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Tipo:</strong> {normativa.tipo_normativa}
            </p>
            {!ocultarVisitas && (
              <p className="text-sm text-gray-600">
                <strong>Visitas:</strong> {normativa.visitas}
              </p>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <TableActions
              normativa={normativa}
              isSelected={isSelected}
              onSelect={onSelect}
              onDeselect={onDeselect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

TableMobile.propTypes = {
  normativas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      numero: PropTypes.string.isRequired,
      titulo: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      dependencia: PropTypes.string.isRequired,
      emisor: PropTypes.string.isRequired,
      tipo_normativa: PropTypes.string.isRequired,
      visitas: PropTypes.number,
    })
  ).isRequired,
  isSelected: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDeselect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TableMobile;
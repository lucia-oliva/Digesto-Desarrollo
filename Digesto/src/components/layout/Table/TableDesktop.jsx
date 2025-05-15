//Este componente es la visualizacion en Desktop de Table
import PropTypes from "prop-types";
import TableActions from "./TableActions";
import { useTableContext } from "./useTableContext";
import TableColumns from "./TableColumns"

function TableDesktop({
  normativas,
  isSelected,
  onSelect,
  onDeselect,
  onEdit,
  onDelete,
}) {
  const {ocultarVisitas} = useTableContext();

  return (
    <div className="overflow-x-auto hidden md:block rounded-box border border-base-content/5 bg-base-100">
      <table className="table-md">
       <TableColumns />
        <tbody>
          {normativas?.map((normativa) => (
            <tr
              className="hover:bg-primary-content odd:bg-[#F7F6FE]"
              key={normativa.id}
            >
              <td className="py-9">{normativa.numero}</td>
              <td className="py-9">{normativa.titulo}</td>
              <td className="py-9">{normativa.fecha}</td>
              <td className="py-9">{normativa.dependencia}</td>
              <td className="py-9">{normativa.emisor}</td>
              <td className="py-9">{normativa.tipo_normativa}</td>
              {!ocultarVisitas && (
                <td className="py-9">{normativa.visitas}</td>
              )}
              <td>
                <TableActions
                  normativa={normativa}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  onDeselect={onDeselect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TableDesktop.propTypes = {
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

export default TableDesktop;

// components/GenericTable/GenericTable.jsx
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TablePagination from "./TablePagination";

function GenericTable({
  data,
  columns,
  actions = [],
  page,
  totalPages,
  onPageChange,
  showActions = true,
   emptyMessage = "No se encontraron resultados. Intentá cambiando los filtros."
}) {
  const items = Array.isArray(data) ? data : [];
  const cols = Array.isArray(columns) ? columns : [];
  const hasActions = actions.length > 0 && !!showActions;
  const colSpan = (cols.length || 0) + (hasActions ? 1 : 0);

  return (
    <div className="overflow-x-auto md:block rounded-box border border-base-content/30 bg-base-100  mt-3 mb-3 shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200">
      <table className="table w-full ">
        <thead>
          <TableHeader columns={columns} showActions={actions.length > 0 && showActions} />
        </thead>
         <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow
                key={item.id || item.id_sesion || JSON.stringify(item)}
                item={item}
                columns={cols}
                actions={actions}
              />
            ))
          ) : (
            <tr>
              <td colSpan={colSpan || 1} className="py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default GenericTable;

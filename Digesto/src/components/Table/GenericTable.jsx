/* eslint-disable react/prop-types */
// components/GenericTable/GenericTable.jsx
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TablePagination from "./TablePagination";
import MobileCardList from "./MobileCardList";

function GenericTable({
  data,
  columns,
  actions = [],
  page,
  totalPages,
  onPageChange,
  showActions = true,
   emptyMessage = "No se encontraron resultados. Intentá cambiando los filtros.",
   headerProps={},
}) {
  const items = Array.isArray(data) ? data : [];
  const cols = Array.isArray(columns) ? columns : [];
  const hasActions = actions.length > 0 && !!showActions;
  const colSpan = (cols.length || 0) + (hasActions ? 1 : 0);

  return (
<div className="overflow-x-auto rounded-xl border border-blue-200 bg-white mt-3 mb-3 shadow-lg hover:shadow-xl transition-all duration-200">

      <div className="hidden min-[979px]:block overflow-x-auto">
      <table className="table w-full ">
        <thead>
          <TableHeader columns={columns} showActions={actions.length > 0 && showActions} {...headerProps} />
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


{/* Mobile / ≤978px */}
<div className="block min-[979px]:hidden p-2">
  <MobileCardList
    data={items}
    columns={cols}
    actions={actions}
    page={page}
    totalPages={totalPages}
    onPageChange={onPageChange}
    emptyMessage={emptyMessage}
  />
</div>

    </div>



  );
}

export default GenericTable;

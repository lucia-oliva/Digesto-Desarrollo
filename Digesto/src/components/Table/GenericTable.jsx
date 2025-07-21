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
}) {
  return (
    <div className="overflow-x-auto md:block rounded-box border border-base-content/30 bg-base-100  mt-3 mb-3 shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200">
      <table className="table w-full ">
        <thead>
          <TableHeader columns={columns} showActions={actions.length > 0 && showActions} />
        </thead>
        <tbody>
          {data?.map((item) => (
            <TableRow
              key={item.id || item.id_sesion}
              item={item}
              columns={columns}
              actions={actions}
            />
          ))}
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

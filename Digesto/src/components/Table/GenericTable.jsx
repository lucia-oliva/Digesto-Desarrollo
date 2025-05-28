// components/GenericTable/GenericTable.jsx
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TablePagination from "./TablePagination";

function GenericTable({ data, columns, actions = [], page, totalPages, onPageChange }) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <TableHeader columns={columns} />
        </thead>
        <tbody>
          {data.map((item) => (
            <TableRow key={item.id} item={item} columns={columns} actions={actions} />
          ))}
        </tbody>
      </table>

      {totalPages && (
        <TablePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}

export default GenericTable;

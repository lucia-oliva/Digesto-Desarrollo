function TablePagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex justify-end mt-4">
      <button
        className="btn btn-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </button>
      <span className="mx-2">Página {page} de {totalPages}</span>
      <button
        className="btn btn-sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}

export default TablePagination;

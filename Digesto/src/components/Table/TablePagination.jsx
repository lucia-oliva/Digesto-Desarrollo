/* eslint-disable react/prop-types */
import { MdOutlineLastPage } from "react-icons/md";
import { MdOutlineFirstPage } from "react-icons/md";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

function TablePagination({ page, totalPages, onPageChange }) {
  const blockSize = 5;
  const currentBlock = Math.floor((page - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  const pagesToShow = [];
  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  return (
    <div className="table-pagination flex flex-wrap justify-center items-center mt-4 mb-2 gap-2 w-full">
    
<div className="flex max-[360px]:flex min-[768px]:hidden items-center justify-between gap-1 px-2">
  <div className="flex items-center gap-1">
    <button
      className="btn btn-sm border border-gray-300"
      disabled={page <= 1}
      onClick={() => onPageChange(1)}
      aria-label="Primera página"
      title="Primera página"
    >
      <MdOutlineFirstPage className="size-4" />
    </button>
    <button
      className="btn btn-sm border border-gray-300"
      disabled={page <= 1}
      onClick={() => onPageChange(page - 1)}
      aria-label="Página anterior"
      title="Página anterior"
    >
      <GrFormPrevious className="size-4" />
    </button>
  </div>


  <div className="flex items-center gap-1">
    <span className="sr-only">Página</span>
    <input
      type="number"
      min={1}
      max={Math.max(1, totalPages)}
      value={page}
      onChange={(e) => {
        const v = Number(e.target.value || 1);
        const clamped = Math.min(Math.max(1, v), Math.max(1, totalPages));
        onPageChange(clamped);
      }}
      className="input input-bordered input-sm w-14 text-center no-spinner"
      aria-label="Ir a página"
    />
  </div>

  <div className="flex items-center gap-1">
    <button
      className="btn btn-sm border border-gray-300"
      disabled={page >= totalPages}
      onClick={() => onPageChange(page + 1)}
      aria-label="Página siguiente"
      title="Página siguiente"
    >
      <MdOutlineNavigateNext className="size-4" />
    </button>
    <button
      className="btn btn-sm border border-gray-300"
      disabled={page >= totalPages}
      onClick={() => onPageChange(totalPages)}
      aria-label="Última página"
      title="Última página"
    >
      <MdOutlineLastPage className="size-4" />
    </button>
  </div>
</div>


      <div className="hidden min-[768px]:flex flex-wrap justify-end items-center mr-6 gap-1 mb-4">
        <button
          className="btn btn-m shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200 border border-gray-300 "
          disabled={page === 1}
          onClick={() => onPageChange(1)}
        >
          <MdOutlineFirstPage className="size-5" />
        </button>
        <button
          className="btn btn-md shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200 border border-gray-300"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <GrFormPrevious className="size-5" />
        </button>

        <div className="join">
          {pagesToShow.map((p) => (
            <button
              key={p}
              className={`join-item btn btn-md btn-square shadow-md hover:shadow-lg transition-all duration-200 border border-gray-300 ${
                p === page ? "bg-primary text-white" : ""
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          className="btn btn-md shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200 border border-gray-300"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <MdOutlineNavigateNext className="size-5" />
        </button>
        <button
          className="btn btn-md shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200 border border-gray-300"
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <MdOutlineLastPage className="size-5" />
        </button>
      </div>
    </div>
  );
}
export default TablePagination;

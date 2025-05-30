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
    <div className="flex flex-wrap justify-center items-center mt-4 mb-2 gap-1">
      <button
        className="btn btn-md "
        disabled={page === 1}
        onClick={() => onPageChange(1)}
      >
        <MdOutlineFirstPage className="size-5" />
      </button>
      <button
        className="btn btn-md"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <GrFormPrevious className="size-5" />
      </button>

      <div className="join">
        {pagesToShow.map((p) => (
          <button
            key={p}
            className={`join-item btn btn-md btn-square ${
              p === page ? "bg-primary text-white" : ""
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        className="btn btn-md"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <MdOutlineNavigateNext className="size-5" />
      </button>
      <button
        className="btn btn-md"
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        <MdOutlineLastPage className="size-5" />
      </button>
    </div>
  );
}
export default TablePagination;

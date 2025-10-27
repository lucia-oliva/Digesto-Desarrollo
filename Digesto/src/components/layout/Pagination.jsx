import { useState } from 'react';
import PropTypes from 'prop-types';
import { MdOutlineLastPage } from "react-icons/md";
import { MdOutlineFirstPage } from "react-icons/md";

function Pagination({ currentPage, totalResults, resultsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const maxPageButtons = 10;
  const [pageGroup, setPageGroup] = useState(Math.floor((currentPage - 1) / maxPageButtons));

  const startPage = pageGroup * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleNextGroup = () => {
    if (endPage < totalPages) {
      setPageGroup(pageGroup + 1);
      handlePageChange(startPage + maxPageButtons);
    }
  };

  const handlePreviousGroup = () => {
    if (startPage > 1) {
      setPageGroup(pageGroup - 1);
      handlePageChange(startPage - maxPageButtons);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={(event) => {
            event.preventDefault();
            handlePageChange(i);
          }}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            i === currentPage
              ? "bg-primary text-white"
              : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
          } focus:z-20 focus:outline-offset-0 cursor-pointer`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(1)} 
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Primera
        </button>
        <button
          onClick={handlePreviousGroup}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Anterior
        </button>
        <button
          onClick={handleNextGroup}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Siguiente
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Última
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-700">
            Mostrando
            <span className="font-medium">
              {" "}
              {Math.min(
                (currentPage - 1) * resultsPerPage + 1,
                totalResults
              )}{" "}
            </span>
            al
            <span className="font-medium">
              {" "}
              {Math.min(currentPage * resultsPerPage, totalResults)}{" "}
            </span>
            de
            <span className="font-medium"> {totalResults} </span>
            resultados
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-xs"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(1)} 
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Primera</span>
              <MdOutlineFirstPage className='size-5'/>
            </button>
            <button
              onClick={handlePreviousGroup}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Anterior</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {renderPageButtons()}
            <button
              onClick={handleNextGroup}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Siguiente</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
            >
              <span className="sr-only">Última</span>
              <MdOutlineLastPage className='size-5'/>              
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
  resultsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;

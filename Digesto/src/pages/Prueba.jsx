import React, { useState, useEffect } from 'react';
import Table from '../components/layout/Table';
import Pagination from '../components/layout/Pagination';
import useAxios from 'axios-hooks';

function NormativasContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const [{ data, loading, error }, refetch] = useAxios({
    url: `http://localhost:3000/api/normativa/search?page=${currentPage}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      numero: '',
      emisor: '',
      documento: '',
      anio: '',
    },
  });

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const normativas = data?.normativas || [];
  const totalResults = data?.totalResults || 0;

  return (
    <div className="w-screen min-h-screen p-10 flex justify-center items-center">
      <div className="w-auto bg-gray-100 text-neutral text-center p-10 rounded-lg shadow-md">
        <h1 className="mb-4 text-lg font-semibold font-[Montserrat]">
          Normativas Mas Buscadas
        </h1>
        <Table normativas={normativas} />
        <Pagination
          currentPage={currentPage}
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default NormativasContainer;


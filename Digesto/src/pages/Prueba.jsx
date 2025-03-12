import React, { useState, useEffect } from 'react';
import Table from '../components/layout/Table';
import Pagination from '../components/layout/Pagination';

async function fetchNormativas(page, limit) {
  const response = await fetch(
    `http://localhost:3000/api/normativa/search?page=${page}&limit=${limit}`,
   
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numero: "",
        emisor: "",
        documento: "",
        anio: "",
        limite: limit,
      }),
    }
  );
  const data = await response.json();
  return data;
}

function NormativasContainer() {
  const [normativas, setNormativas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    async function loadNormativas() {
      try {
        const data = await fetchNormativas(currentPage, resultsPerPage);
        console.log('Fetched data:', data); // Debugging log
        setNormativas(data.normativas);
        setTotalResults(data.totalResults);
      } catch (error) {
        console.error('Error fetching normativas:', error);
      }
    }
    loadNormativas();
  }, [currentPage]);

  console.log('Normativas:', normativas);
  console.log('Total Results:', totalResults);



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

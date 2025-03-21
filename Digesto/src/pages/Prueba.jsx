import { useState, useEffect } from 'react';
import Table from '../components/layout/Table';
import Pagination from '../components/layout/Pagination';
import useAxios from 'axios-hooks';
import SearchBar from '../components/layout/SearchBar';

function NormativasContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tags, setTags] = useState("");
  const resultsPerPage = 10;

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: `http://localhost:3000/api/normativa/search?page=${currentPage}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        numero: "",
        emisor: "",
        documento: "",
        anio: "",
        dependencia: "",
        tags: tags
        // Enviar los tags seleccionados
      },
    },
    { manual: true } // Evita ejecutar automáticamente la petición al inicio
  );

  useEffect(() => {
    refetch();
  }, [currentPage, tags, refetch]);

  const handleSearch = (selectedTags) => {
    setTags(selectedTags);
    setCurrentPage(1); // Reiniciar la paginación al filtrar
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const normativas = data?.normativas || [];
  const totalResults = data?.totalResults || 0;

  return (
    <div className="w-screen min-h-screen p-10 flex justify-center items-center">
      <div className="w-auto bg-gray-100 text-neutral text-center p-10 rounded-lg shadow-lg">
        <div className='flex justify-between gap-4'>
          <h1 className="mb-4 text-lg font-semibold font-[Montserrat]">
            Normativas
          </h1>
          <SearchBar onSearch={handleSearch} />
        </div>
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

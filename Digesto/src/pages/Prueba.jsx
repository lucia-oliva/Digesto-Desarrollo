import { useState, useEffect } from 'react';
import Table from '../components/layout/Table';
import Pagination from '../components/layout/Pagination';
import useAxios from 'axios-hooks';
import SearchBar from '../components/layout/SearchBar';
import Form from '../components/layout/Form';
import { useLocation } from 'react-router-dom'; 
  
function NormativasContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tags, setTags] = useState("");
  const resultsPerPage = 10;
  const location = useLocation();
  const [numero, setNumero] = useState(""); // Nuevo estado para 'numero'
  const [emisor, setEmisor] = useState(""); 
  const [documento, setDocumento] = useState("");
  const [anio, setAnio] = useState("");
  const [newDependencia, setDependencia] = useState("");

  const params = new URLSearchParams(location.search);
  const dependencia = params.get("dependencia");
  console.log(dependencia)
  

 
  
  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: `http://localhost:3000/api/normativa/search?page=${currentPage}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        numero: numero,
        emisor: emisor,
        documento: documento,
        anio: anio,
        dependencia: newDependencia,
        tags: tags
       
      },
    },
    { manual: true } 
  );

  useEffect(() => {
    refetch({
      numero,
      emisor,
      documento,
      anio,
      dependencia: newDependencia,
      tags,
    });
  }, [currentPage, tags, numero, emisor, documento,anio, newDependencia, refetch]);

  const handleFormChange = (formData) => {
    // Actualizar los estados según los datos que el formulario pase.
    setNumero(formData.numero || "");
    setEmisor(formData.emisor || "");
    setDocumento(formData.documento || "");
    setAnio(formData.anio || "");
    setDependencia(formData.dependencia || dependencia); // Si no se pasa dependencia, se usa la de la URL
  };

  const handleSearch = (selectedTags) => {
    setTags(selectedTags);
    setCurrentPage(1); // Reiniciar la paginación al filtrar
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const normativas = data?.normativas || [];
  const totalResults = data?.totalResults || 0;

  return (
    
      
    <div className="w-screen min-h-screen p-8 flex justify-center items-center">
      <div className="w-auo bg-gray-100 text-neutral text-center p-10 rounded-lg shadow-lg">
      <Form dependencia={dependencia}
            onFormChange={handleFormChange}
      />
      <div className="flex flex-wrap justify-between items-center border-b pb-4 mb-4">
      <h1 className="text-2xl font-bold font-[Montserrat]">Resultados de normativas</h1>
      <div className="w-full md:w-auto mt-1 md:mt-0">
    <SearchBar onSearch={handleSearch} />
    </div>
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

import { useState, useEffect } from "react";
import Table from "../components/layout/Table";
import Pagination from "../components/layout/Pagination";
import useAxios from "axios-hooks";
import SearchBar from "../components/layout/SearchBar";
import Form from "../components/layout/Form";
import { useLocation } from "react-router";
//TODO: La paginacion mueve el focus del screen hacia arriba en cada clickeo a los botones, dejar que se actualice pero que la vista quede estatica en el lugar donde se pueda seguir viendo la paginacion.
//TODO: Hay que corregir el front-end de tabla y paginacion.

function NormativasContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tags, setTags] = useState("");
  const resultsPerPage = 10;

  const location = useLocation();

  //Estados de los filtros
  const [numero, setNumero] = useState("");
  const [emisor, setEmisor] = useState("");
  const [documento, setDocumento] = useState("");
  const [anio, setAnio] = useState("");
  const [newDependencia, setDependencia] = useState("");

  const params = new URLSearchParams(location.search);
  const dependencia = params.get("dependencia");

  const dependenciaMap = {
    Exactas: "2",
    Aplicadas: "1",
    Salud: "3",
    Sociales: "4",
    Humanas: "5",
    "C. Superior": "20",
    Chepes: "22",
    "Villa Union": "26",
    Chamical: "25",
    Aimogasta: "24",
    Catuna: "23",
  };

  //Carga desde el
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dependenciaFromURL = params.get("dependencia"); // Ej: "salud"
    if (dependenciaFromURL && dependenciaMap[dependenciaFromURL]) {
      setDependencia(dependenciaMap[dependenciaFromURL]);
    } else {
      setDependencia("");
    }
  }, [location.search]);

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: `http://localhost:3000/api/normativa/search`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page: currentPage,},
      data: {
        numero: numero,
        emisor: emisor,
        documento: documento,
        anio: anio,
        dependencia: newDependencia,
        tags: tags,
      },
    },
    { manual: true }
  );

  useEffect(() => {
    try {
      refetch({
        numero,
        emisor,
        documento,
        anio,
        dependencia: newDependencia,
        tags,
      });  
    } catch (error) {
      console.error("Error al buscar normativas:", error.message);
    }
    
  }, [
    currentPage,
    tags,
    numero,
    emisor,
    documento,
    anio,
    newDependencia,
    refetch,
  ]);

  const handleFormChange = (formData) => {
    setNumero(formData.numero || "");
    setEmisor(formData.emisor || "");
    setDocumento(formData.documento || "");
    setAnio(formData.anio || "");
    setDependencia(formData.dependencia || newDependencia);
  };

  const handleSearch = (selectedTags) => {
    setTags(selectedTags);
    setCurrentPage(1);
  };

 

  const normativas = data?.normativas || [];
  const totalResults = data?.totalResults || 0;

  return (
    <div className="w-screen min-h-screen p-8 flex justify-center items-center">
      <div className="w-auto bg-gray-100 text-neutral text-center p-10 rounded-lg shadow-lg">
        <Form
          dependencia={dependencia}
          onFormChange={handleFormChange}
          dependenciaMap={dependenciaMap}
          anio={anio}
          documento={documento}
          emisor={emisor}
          numero={numero}
        />
        
        <div className="flex flex-wrap justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">Resultados de Normativas</h2>
          <SearchBar  onSearch={handleSearch}/>
        </div>

        {loading ? (
          <div>
            <p>Cargando resultados</p>  
            <span className="loading loading-dots loading-xl"></span>
          </div>
        ) : error ? (
          <div className="text-white bg-primary p-4 rounded-lg my-4">
            Tu búsqueda no arrojó resultados. Ajustá los filtros y/o tags e intentá nuevamente.
          </div>
        ) : (
          <>
            <Table normativas={normativas} />
            <Pagination
              currentPage={currentPage}
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default NormativasContainer;

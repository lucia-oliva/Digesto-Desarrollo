import { useState } from "react";
import SearchBar from "../components/layout/SearchBar";
import ContactModal from "../components/layout/Contact";
import NormativaTable from "../components/Table/NormativasTable";
import GenericFilterSearch from "../components/SearchFilter/SearchFilter";
import { useSearchParams } from "react-router";

function NormativasContainer({ isAdmin = false }) {

    const [params] = useSearchParams();
    const initial = {
      dependencia: params.get("dependencia") || "",
    };
   const [filtrosGenericos, setFiltrosGenericos] = useState({});
 
   const dependenciaIdToNombre = {
  "1": "Aplicadas",
  "2": "Exactas",
  "3": "Salud",
  "4": "Sociales",
  "5": "Humanas",
  "20": "C. Superior",
  "22": "Chepes",
  "26": "Villa Union",
  "25": "Chamical",
  "24": "Aimogasta",
  "23": "Catuna",
};

const dependenciaSeleccionada =
  filtrosGenericos?.dependenciaNombre ||         
  filtrosGenericos?.dependenciaLabel  ||         
  dependenciaIdToNombre?.[String(filtrosGenericos?.dependencia || "")] || 
  "";
  const [tags, setTags] = useState("");
  const type = "ListadoNormativa";
  const handleSearchTags = (selectedTags) => {
    setTags(selectedTags || "");
  };
  const handleSearch = (filtersFromGeneric) => {
    setFiltrosGenericos(filtersFromGeneric || {});
  };
  const filtros = { ...filtrosGenericos, tags };
  const modo = "busqueda";

  return (
    <div
      className={`min-h-screen p-5 flex justify-center items-start ${
        isAdmin ? "w-full" : "w-screen items-center"
      }`}
    >
      <div className="w-auto bg-gray-100 text-neutral text-center p-5 rounded-lg shadow-lg">
       <GenericFilterSearch
          type={type}
          scope="public"
          initialState={initial}
          autoSearch
          onSearch={handleSearch}
        />
        <div className="flex flex-wrap justify-between items-center border-b pb-4 mb-4 mt-4">
          <h2 className="text-xl font-bold mb-2">Resultados de Normativas</h2>
          <SearchBar onSearch={handleSearchTags} />
        </div>
        <NormativaTable type={type} filtros={filtros} modo={modo} />
      </div>

      {!isAdmin && <ContactModal dependencia={dependenciaSeleccionada}/>}
    </div>
  );
}

export default NormativasContainer;

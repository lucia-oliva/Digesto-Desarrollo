// components/Search/GenericFilterSearch.jsx
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { filterConfig } from "./configFilters";
import AbecedarioFiltro from "./AlphabetFilter";


//BUG: Cuando clickeo en una pagina alta (ej pagina 50) y luego cambio a listados cortos por ejemplo usuarios, carga tags(???)
//BUG: los filtros aplicados no se borran y se aplican en otras tablas que no tienen que ver (si coincide el filtro capaz.)

function GenericFilterSearch({ type, onSearch }) {
  const filters = useMemo(() => filterConfig[type] || [], [type]);
  const [formState, setFormState] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [selectedLetter, setSelectedLetter] = useState("");
  
  const handleLetterSelect = (letra) => {
    setSelectedLetter(letra);
    const updatedState = { ...formState, letra };
    setFormState(updatedState);
    onSearch(updatedState); // ejecuta la búsqueda con la letra
  };

  useEffect(() => {
    const fetchOptions = async () => {
      const updatedOptions = {};
      for (const filter of filters) {
        if (filter.async && filter.endpoint) {
          try {
            const { data } = await axios.get(filter.endpoint);
            updatedOptions[filter.name] = data.map((item) => ({
              label: item[filter.key],
              value: item[filter.key],
            }));
          } catch (error) {
            console.error(`Error al cargar ${filter.name}:`, error);
          }
        }
      }
      setDynamicOptions(updatedOptions);
    };

    fetchOptions();
  }, [filters]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleBuscar = () => {
    onSearch(formState);
    setFormState({});
  };

  return (
    <div className="p-4 rounded-box border mb-4">
      <h2 className="text-lg font-bold mb-4">Filtros de búsqueda</h2>
      {/*Abecedario*/}
      {filters.some((f) => f.name === "letra") && (
      <div className="mb-4">
        <label className="block font-medium mb-1">Empieza con</label>
        <AbecedarioFiltro
          selectedLetter={selectedLetter}
          onSelect={handleLetterSelect}
        />
      </div>
    )}


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filters
        .filter((filter) => filter.name !== "letra") 
        .map((filter) => {
          if (filter.type === "text") {
            return(
              <div key={filter.name} className="flex flex-col">
                <label className="mb-1 font-medium">{filter.label}</label>
                <input
                  type="text"
                  name={filter.name}
                  value={formState[filter.name] || ""}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
            );
          }

          if (filter.type === "select") {
            const options = filter.async
              ? dynamicOptions[filter.name] || []
              : filter.options || [];

            return (
              <div key={filter.name} className="flex flex-col">
                <label className="mb-1 font-medium">{filter.label}</label>
                <select
                  name={filter.name}
                  value={formState[filter.name] || ""}
                  onChange={handleChange}
                  className="select select-bordered"
                >
                  <option value="">Seleccionar</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return null;
        })}

        <div className="flex items-end">
          <button className="btn btn-primary w-full" onClick={handleBuscar}>
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}

GenericFilterSearch.propTypes = {
  type: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default GenericFilterSearch;

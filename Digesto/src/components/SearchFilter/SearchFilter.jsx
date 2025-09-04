// components/Search/GenericFilterSearch.jsx
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { filterConfig } from "./configFilters";
import AbecedarioFiltro from "./AlphabetFilter";
import { dependenciaOptions } from "../../pages/admin/Carga/config/mapeo.js";
import { useAuth } from "../../context/useAuth.jsx";

const DEP_BY_NAME = new Map(
  dependenciaOptions.map((d) => [String(d.label).trim(), String(d.value)])
);

function GenericFilterSearch({ type, onSearch, scope = "public" }) {
  const filters = useMemo(() => filterConfig[type] || [], [type]);
  const [formState, setFormState] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [selectedLetter, setSelectedLetter] = useState("");

  const { auth } = useAuth();
  const user = auth?.user;
  const isSuperAdmin = user?.tipo_usuario === "SuperAdministrador";
  const userDepNombre = (user?.dependencia ?? "").trim();
  const lockedDepValue = !isSuperAdmin
    ? DEP_BY_NAME.get(userDepNombre) ?? ""
    : "";
  const isAdminScope = scope === "admin";
  const canLockDep = isAdminScope && !isSuperAdmin && !!lockedDepValue;

  const handleLetterSelect = (letra) => {
    setSelectedLetter(letra);
    const updatedState = { ...formState, letra };
    setFormState(updatedState);
    onSearch(updatedState); // ejecuta la búsqueda con la letra
  };

  useEffect(() => {
    const hasDependencia = filters.some((f) => f.name === "dependencia");
    if (hasDependencia && canLockDep) {
      setFormState((prev) => ({ ...prev, dependencia: lockedDepValue }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, lockedDepValue]);

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
    const { name, value } = e.target;
    if (name === "dependencia" && canLockDep) return;
    setFormState({ ...formState, [name]: value });
  };

  const handleBuscar = () => {
    onSearch(formState);
    // eslint-disable-next-line no-unused-vars
    setFormState((prev) => (canLockDep ? { dependencia: lockedDepValue } : {}));
  };

  return (
    <div className="p-6 rounded-2xl shadow-md border border-gray-200 bg-base-100 mb-4 hover:shadow-lg transition-shadow ">
      <h2 className="text-lg font-bold mb-4 max-[426px]:text-sm">Filtros de búsqueda</h2>
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
              return (
                <div key={filter.name} className="flex flex-col">
                  <label className="mb-1 font-medium max-[426px]:text-xs">{filter.label}</label>
                  <input
                    type="text"
                    name={filter.name}
                    value={formState[filter.name] || ""}
                    onChange={handleChange}
                    className="input input-bordered max-[426px]:input-sm"
                  />
                </div>
              );
            }

            if (filter.type === "select") {
              const options = filter.async
                ? dynamicOptions[filter.name] || []
                : filter.options || [];
              const isDependencia = filter.name === "dependencia";
              const disabled = isDependencia && canLockDep;

              return (
                <div key={filter.name} className="flex flex-col">
                  <label className="mb-1 font-medium max-[426px]:text-xs">{filter.label}</label>
                  <select
                    name={filter.name}
                    value={
                      isDependencia && canLockDep
                        ? lockedDepValue
                        : formState[filter.name] ?? ""
                    }
                    onChange={handleChange}
                    className="select select-bordered max-[425px]:select-sm"
                    disabled={disabled}
                  >
                    <option value="" disabled>
                      Seleccionar
                    </option>
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
  scope: PropTypes.oneOf(["admin", "public"]),
};

export default GenericFilterSearch;

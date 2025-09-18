// components/Search/GenericFilterSearch.jsx
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { filterConfig } from "./configFilters";
import AbecedarioFiltro from "./AlphabetFilter";
import { dependenciaOptions } from "../../pages/admin/Carga/config/mapeo.js";
import { useAuth } from "../../context/useAuth.jsx";
import {useLocation} from "react-router"

const DEP_BY_NAME = new Map(
  dependenciaOptions.map((d) => [String(d.label).trim(), String(d.value)])
);

function GenericFilterSearch({
  type,
  onSearch,
  scope = "public",
  initialState = {},
  autoSearch = false,
}) {
  const filters = useMemo(() => filterConfig[type] || [], [type]);
  const [formState, setFormState] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState({});
  const location = useLocation();

  const { auth } = useAuth();
  const user = auth?.user;
  const isSuperAdmin = user?.tipo_usuario === "SuperAdministrador";
  const userDepNombre = (user?.dependencia ?? "").trim();
  const lockedDepValue = !isSuperAdmin ? DEP_BY_NAME.get(userDepNombre) ?? "" : "";
  const isAdminScope = scope === "admin";
  const canLockDep = isAdminScope && !isSuperAdmin && !!lockedDepValue;

  useEffect(() => {
  console.log("🔍 Estado actual de filtros:", formState);
}, [formState]);

  useEffect(() => {
    setFormState({});
    setDynamicOptions({});
  }, [location.pathname, type]);

  useEffect(() => {
    const hasInitial = initialState && Object.keys(initialState).length > 0;
    if (!hasInitial) return;

    setFormState((prev) => {
      const next = { ...prev, ...initialState };
      if (autoSearch) onSearch(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialState), autoSearch]);

  // Mantener dependencia bloqueada en admin cuando corresponda
  useEffect(() => {
    const hasDependencia = filters.some((f) => f.name === "dependencia");
    if (hasDependencia && canLockDep) {
      setFormState((prev) => ({ ...prev, dependencia: lockedDepValue }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, lockedDepValue]);

  // Carga de opciones async
  useEffect(() => {
    const fetchOptions = async () => {
      const updatedOptions = {};
      for (const filter of filters) {
        if (filter.async && filter.endpoint) {
          try {
            const response = await axios.get(filter.endpoint);
            const arrayData = response.data;
            updatedOptions[filter.name] = arrayData.data.map((item) => ({
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

  const handleLetterSelect = (letra) => {
    setFormState((prev) => {
      const next = { ...prev, letra };
      onSearch(next); // búsqueda inmediata al tocar letra
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dependencia" && canLockDep) return;
    setFormState({ ...formState, [name]: value });
  };

  const handleBuscar = () => {
    onSearch(formState);
    // mantener tus cambios nuevos: limpiar letra y respetar dependencia bloqueada
    setFormState(() =>
      canLockDep ? { dependencia: lockedDepValue, letra: "" } : { letra: "" }
    );
  };

  return (
    <div className="p-6 rounded-2xl shadow-md border border-gray-200 bg-base-100 mb-4 hover:shadow-lg transition-shadow ">
      <h2 className="text-lg font-bold mb-4 max-[426px]:text-sm">Filtros de búsqueda</h2>

      {/* Abecedario */}
      {filters.some((f) => f.name === "letra") && (
        <div className="mb-4">
          <label className="block font-medium mb-1">Empieza con</label>
          <AbecedarioFiltro
            value={formState.letra ?? ""}  
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
                  <label className="mb-1 font-medium max-[426px]:text-xs">
                    {filter.label}
                  </label>
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
                  <label className="mb-1 font-medium max-[426px]:text-xs">
                    {filter.label}
                  </label>
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
  initialState: PropTypes.object,
  autoSearch: PropTypes.bool,
};

export default GenericFilterSearch;

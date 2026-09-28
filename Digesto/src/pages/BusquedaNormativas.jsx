import PropTypes from "prop-types";
import ContactModal from "../components/layout/Contact";
import NormativaTable from "../components/Table/NormativasTable";
import GenericFilterSearch from "../components/SearchFilter/SearchFilter";
import { useSearchParams } from "react-router";
import { useNamespacedFilters } from "../hooks/useNamespacedFilters";

function NormativasContainer({ isAdmin = false }) {
  const [params] = useSearchParams();
  const initial = {
    dependencia: params.get("dependencia") || "",
    emisor: params.get("emisor") || "",
  };

  const tags = "";
  const type = "ListadoNormativa";
  const modo = "busqueda";

  const { state, setFilters } = useNamespacedFilters({
    scope: "public",
    type: "ListadoNormativa",
    initial,
    urlSync: true,
    nsStrategy: "byPath",
    persist: true,
    requireQueryToPersist: true,
    ignoreStorageIfNoQuery: true,
    resetOnUnmount: true,
    clearStorageOnUnmount: true,
  });

  const handleSearch = (filtersFromGeneric) => {
    const next = { ...(filtersFromGeneric || {}), tags };
    setFilters(next);
  };

  const dependenciaIdToNombre = {
    1: "Aplicadas",
    2: "Exactas",
    3: "Salud",
    4: "Sociales",
    5: "Humanas",
    20: "C. Superior",
    22: "Chepes",
    26: "Villa Union",
    25: "Chamical",
    24: "Aimogasta",
    23: "Catuna",
  };

  const filtrosGenericos = state.filters || {};
  const dependenciaSeleccionada =
    filtrosGenericos?.dependenciaNombre ||
    filtrosGenericos?.dependenciaLabel ||
    dependenciaIdToNombre?.[String(filtrosGenericos?.dependencia || "")] ||
    "";

  const filtros = { ...filtrosGenericos, tags };

  return (
    <div
      className={`min-h-screen p-5 flex justify-center items-start ${
        isAdmin ? "w-full" : "w-screen items-center"
      }`}
    >
      <div className="w-auto gap-4 bg-gray-100 text-neutral text-center p-5 rounded-lg shadow-lg">
        <GenericFilterSearch
          type="ListadoNormativa"
          scope="public"
          initialState={state.filters}
          autoSearch
          onSearch={handleSearch}
        />

        <div className="items-center border-b pb-4 mb-4 mt-4 gap-3">
          <h2 className="text-xl font-bold mb-2">Resultados de Normativas</h2>
        </div>

        <NormativaTable type={type} filtros={filtros} modo={modo} />
      </div>

      {!isAdmin && <ContactModal dependencia={dependenciaSeleccionada} />}
    </div>
  );
}

NormativasContainer.propTypes = {
  isAdmin: PropTypes.bool,
};

export default NormativasContainer;

import NormativaTable from "../../components/Table/NormativasTable";
import { useLocation } from "react-router";
import GenericFilterSearch from "../../components/SearchFilter/SearchFilter";
import { useNamespacedFilters } from "../../hooks/useNamespacedFilters";
import { getWithCancel } from "../../api/cancellable";

function VistaAdministrativa() {
  const location = useLocation();
  const type = location.pathname.split("/")[2]; // p.ej. '/admin/Normativas' → 'Normativas'
  const scope = "admin";
  const modo = "admin";

  const { ns, state, setFilters } = useNamespacedFilters({
    scope: "admin",
    type, // entidad actual (según URL interna)
    initial: {},
    urlSync: false,
    nsStrategy: "byType", // ⬅️ por entidad
    persist: false,
    resetOnUnmount: false, // la vista no desmonta
    resetOnNsChange: true, // ⬅️ al cambiar entidad, reset total a default
    onHydrated: (f) => void fetchData(f),
  });

  async function fetchData(filtros) {
    // Cambiá el endpoint según la entidad si hace falta
    const res = await getWithCancel(ns, "/api/normativas", { params: filtros });
    if (res?.cancelled) return;
    // setear datos si tu tabla no se auto-carga
  }

  const handleSearch = (formData) => {
    const next = formData || {};
    setFilters(next);
    fetchData(next);
  };

  return (
    <div className="container">
      <GenericFilterSearch
        type={type}
        scope="admin"
        initialState={state.filters} // ← SIEMPRE desde el contexto
        autoSearch
        onSearch={handleSearch}
      />
      <NormativaTable type={type} filtros={state.filters} modo={modo} />
    </div>
  );
}

export { VistaAdministrativa };

import { useEffect, useMemo, useState } from "react";
import NormativaTable from "../../components/Table/NormativasTable";
import { useLocation } from "react-router";
import GenericFilterSearch from "../../components/SearchFilter/SearchFilter";
import { useNamespacedFilters } from "../../hooks/useNamespacedFilters";
import { useAuth } from "../../context/useAuth";
import SearchBar from "../../components/layout/SearchBar";

function VistaAdministrativa() {
  const location = useLocation();
  const { auth } = useAuth();
  const user = auth?.user;

  const tipoUser = user?.tipo_usuario;
  const depName = user?.dependencia;

  const type = location.pathname.split("/")[2];

  const isNormativaPorAnio =
    type === "normativaPorAño" || type === "normativaPorAnio";

  const isSuperAdmin = tipoUser === "SuperAdministrador";
  const isAdminDependencia = tipoUser === "Administrador de Dependencia";
  const isSupervisor = tipoUser === "Supervisor";

  const lockDependencia =
    isNormativaPorAnio &&
    !isSuperAdmin &&
    (isAdminDependencia || isSupervisor) &&
    !!depName;

  const showTagSearch = useMemo(
    () =>
      [
        "ListadoNormativa",
        "ListadoNormativaEliminadas",
        "ListadoNormativaDespublicadas",
      ].includes(type),
    [type],
  );

  const modo = "admin";

  // Tag buscado desde SearchBar
  const [tagQuery, setTagQuery] = useState("");

  const { state, setFilters } = useNamespacedFilters({
    scope: "admin",
    type,
    initial: {},
    urlSync: false,
    nsStrategy: "byType",
    persist: false,
    resetOnUnmount: false,
    resetOnNsChange: true,
  });

  const TAG_PARAM = "tags";

  const mergeWithTag = (base = {}, tag = tagQuery) => {
    const next = { ...(base || {}) };
    const clean = (tag ?? "").trim();

    if (clean) next[TAG_PARAM] = clean;
    else delete next[TAG_PARAM];

    return next;
  };

  useEffect(() => {
    if (!lockDependencia) return;

    const current = state.filters?.dependencia;
    if (String(current ?? "") === String(depName)) return;

    setFilters({ ...(state.filters || {}), dependencia: depName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockDependencia, depName]);

  useEffect(() => {
    if (!showTagSearch) {
      setTagQuery("");
      const next = { ...(state.filters || {}) };
      delete next[TAG_PARAM];
      setFilters(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTagSearch]);

  const handleSearch = (formData) => {
    const safeForm = lockDependencia
      ? { ...(formData || {}), dependencia: depName }
      : formData;

    const next = mergeWithTag(safeForm, tagQuery);
    setFilters(next);
  };

  const handleSearchTags = (tagName) => {
    const clean = (tagName ?? "").trim();
    setTagQuery(clean);

    const next = mergeWithTag(state.filters, clean);
    setFilters(next);
  };

  return (
    <div className="container">
      {showTagSearch && (
        <SearchBar
          value={tagQuery}
          onSearch={handleSearchTags}
          onClear={() => handleSearchTags("")}
        />
      )}

      <GenericFilterSearch
        type={type}
        scope="admin"
        initialState={state.filters}
        autoSearch
        onSearch={handleSearch}
        disabledFields={{
          dependencia: lockDependencia,
        }}
      />

      <NormativaTable type={type} filtros={state.filters} modo={modo} />
    </div>
  );
}

export { VistaAdministrativa };

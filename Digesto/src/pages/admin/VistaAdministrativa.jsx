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

  const showTagSearch = useMemo(
    () =>
      [
        "ListadoNormativa",
        "ListadoNormativaEliminadas",
        "ListadoNormativaDespublicadas",
      ].includes(type),
    [type],
  );

  // Si salís de las pantallas de normativa, limpiamos tagQuery y el filtro
  useEffect(() => {
    if (!showTagSearch) {
      setTagQuery("");
      const next = { ...(state.filters || {}) };
      delete next[TAG_PARAM];
      setFilters(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTagSearch]);

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

  // viene del SearchFilter
  const handleSearch = (formData) => {
    const next = mergeWithTag(formData, tagQuery);
    setFilters(next);
  };

  // viene del SearchBar
  const handleSearchTags = (tagName) => {
    const clean = (tagName ?? "").trim();
    setTagQuery(clean);

    const next = mergeWithTag(state.filters, clean);
    setFilters(next);
  };

  const isSuperAdmin = tipoUser === "SuperAdministrador";
  const isAdminDependencia = tipoUser === "Administrador de Dependencia";
  const isSupervisor = tipoUser === "Supervisor";

  const lockDependencia =
    !isSuperAdmin && (isAdminDependencia || isSupervisor) && !!depName;

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

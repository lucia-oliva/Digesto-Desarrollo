import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import NormativaTable from "../../components/Table/NormativasTable";
import GenericFilterSearch from "../../components/SearchFilter/SearchFilter";
import { useNamespacedFilters } from "../../hooks/useNamespacedFilters";
import { useAuth } from "../../context/useAuth";
import { useReferencias } from "../../context/referenciasContext";

function VistaAdministrativa() {
  const location = useLocation();
  const { auth } = useAuth();
  const user = auth?.user;
  const tipoUser = user?.tipo_usuario;
  const depName = user?.dependencia;
  const { dependencias } = useReferencias();
  const type = location.pathname.split("/")[2];

  const isSuperAdmin = tipoUser === "SuperAdministrador";
  const isAdminDependencia =
    tipoUser === "Administrador de Dependencia";
  const isSupervisor = tipoUser === "Supervisor";

  const normativeTypesWithDependencyFilter = useMemo(
    () =>
      new Set([
        "ListadoNormativa",
        "ListadoNormativaEliminadas",
        "ListadoNormativaDespublicadas",
        "ListadoNormativaPorAnio",
        "normativaPorAño",
        "normativaPorAnio",
      ]),
    [],
  );

  const userDepId = useMemo(() => {
    const directId = user?.dependenciaId ?? user?.id_dependencia;

    if (directId) return String(directId);

    const normalizedDepName = String(depName ?? "").trim().toLowerCase();

    const hit = (dependencias ?? []).find(
      (dependencia) =>
        String(dependencia?.nombre ?? dependencia?.label ?? "")
          .trim()
          .toLowerCase() === normalizedDepName,
    );

    return hit ? String(hit.id ?? hit.value ?? "") : "";
  }, [dependencias, depName, user]);

  const lockedDependenciaValue = userDepId || depName || "";

  const lockDependencia =
    normativeTypesWithDependencyFilter.has(type) &&
    !isSuperAdmin &&
    (isAdminDependencia || isSupervisor) &&
    !!lockedDependenciaValue;

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

    if (String(current ?? "") === String(lockedDependenciaValue)) return;

    setFilters({
      ...(state.filters || {}),
      dependencia: lockedDependenciaValue,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockDependencia, lockedDependenciaValue]);

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
      ? { ...(formData || {}), dependencia: lockedDependenciaValue }
      : formData;

    const next = mergeWithTag(safeForm, tagQuery);
    setFilters(next);
  };

  return (
    <div className="container">
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

      <NormativaTable
        type={type}
        filtros={state.filters}
        modo={modo}
      />
    </div>
  );
}

export { VistaAdministrativa };
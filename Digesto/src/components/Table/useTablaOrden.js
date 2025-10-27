import { useCallback, useEffect, useMemo, useState } from "react";

export function useTablaOrden({
  effectiveModo,
  filtros,
  filteredColumns,
  isAdminRoute,
  isSuperAdmin,
  userDepId,
  depName,
}) {
  const [sortState, setSortState] = useState({ fecha: null, visitas: null });

  const isInicio = effectiveModo === "inicio";
  useEffect(() => {
    if (isInicio) setSortState({ fecha: null, visitas: null });
  }, [isInicio]);
  const visibleKeys = useMemo(
    () => new Set((filteredColumns || []).map((c) => c.key)),
    [filteredColumns]
  );
  const sortableKeys = useMemo(() => {
    if (isInicio) return [];
    const posibles = ["fecha", "visitas"];
    return posibles.filter((k) => visibleKeys.has(k));
  }, [isInicio, visibleKeys]);
  const onToggleSort = useCallback((key, direction) => {
    if (!sortableKeys.includes(key)) return;
    setSortState((prev) => ({ ...prev, [key]: direction })); 
  }, [sortableKeys]);
  const fechaOrder = sortState.fecha;
  const visitasOrder = sortState.visitas;
  const filtrosEfectivos = useMemo(() => {
    const base = { ...filtros };

    if (!isInicio) {
      if (fechaOrder) base.fechaOrder = fechaOrder;
      if (visitasOrder) base.visitasOrder = visitasOrder;
    }
    if (
      isAdminRoute &&
      effectiveModo !== "seleccionar" &&
      !isSuperAdmin &&
      (userDepId || depName)
    ) {
      base.dependencia = String(userDepId ?? depName);
    }

    return base;
  }, [
    filtros,     
    isInicio,
    fechaOrder,
    visitasOrder,
    isAdminRoute,
    effectiveModo,
    isSuperAdmin,
    userDepId,
    depName,
  ]);
  const headerProps = useMemo(() => ({
    sortState,
    onToggleSort,  
    sortableKeys, 
  }), [sortState, onToggleSort, sortableKeys]);

  return { filtrosEfectivos, headerProps };
}

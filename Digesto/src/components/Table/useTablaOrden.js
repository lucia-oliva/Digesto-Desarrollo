import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Maneja orden (fecha/visitas), define columnas ordenables según modo/visibilidad,
 * arma filtrosEfectivos (fechaOrder/visitasOrder) y respeta: en "inicio" no hay orden ni íconos.
 */
export function useTablaOrden({
  effectiveModo,
  filtros,
  filteredColumns,
  isAdminRoute,
  isSuperAdmin,
  userDepId,
  depName,
}) {
  // ----- estado de orden -----
  const [sortState, setSortState] = useState({ fecha: null, visitas: null });

  const isInicio = effectiveModo === "inicio";

  // Al entrar en "inicio", limpiar cualquier orden previo
  useEffect(() => {
    if (isInicio) setSortState({ fecha: null, visitas: null });
  }, [isInicio]);

  // Guardamos las keys visibles para deps simples y estables
  const visibleKeys = useMemo(
    () => new Set((filteredColumns || []).map((c) => c.key)),
    [filteredColumns]
  );

  // Qué columnas son ordenables según columnas visibles y modo
  const sortableKeys = useMemo(() => {
    if (isInicio) return [];
    const posibles = ["fecha", "visitas"];
    return posibles.filter((k) => visibleKeys.has(k));
  }, [isInicio, visibleKeys]);

  // Toggle de orden por columna (memoizada)
  const onToggleSort = useCallback((key, direction) => {
    // Evitar cambios si la columna no es ordenable
    if (!sortableKeys.includes(key)) return;
    setSortState((prev) => ({ ...prev, [key]: direction })); // "ASC" | "DESC" | null
  }, [sortableKeys]);

  // Desglosamos deps para evitar JSON.stringify
  const fechaOrder = sortState.fecha;
  const visitasOrder = sortState.visitas;

  // Construir filtros efectivos para backend (agregar fechaOrder/visitasOrder)
  const filtrosEfectivos = useMemo(() => {
    const base = { ...filtros };

    if (!isInicio) {
      if (fechaOrder) base.fechaOrder = fechaOrder;
      if (visitasOrder) base.visitasOrder = visitasOrder;
    }

    // Bloqueo por rol/dependencia (idéntico a tu lógica original)
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
    filtros,        // referencia del objeto que recibís (si el padre la memoiza, mejor)
    isInicio,
    fechaOrder,
    visitasOrder,
    isAdminRoute,
    effectiveModo,
    isSuperAdmin,
    userDepId,
    depName,
  ]);

  // Props para el TableHeader (memoizadas)
  const headerProps = useMemo(() => ({
    sortState,
    onToggleSort,  // ahora es estable por useCallback
    sortableKeys,  // [] en "inicio"
  }), [sortState, onToggleSort, sortableKeys]);

  return { filtrosEfectivos, headerProps };
}

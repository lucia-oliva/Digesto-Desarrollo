/* eslint-disable react/prop-types */
// src/context/ReferenciasProvider.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReferenciasCtx } from "./referenciasContext";
import { fetchDependencias, fetchEmisores } from "../services/referencias";


export default function ReferenciasProvider({ children, preload = true, fallback = null }) {

console.log("%c[RefProvider] MONTÓ", "color:green");


  const [dependencias, setDependencias] = useState(null); 
  const [emisores, setEmisores] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dep, emi] = await Promise.all([
        fetchDependencias(),
        fetchEmisores(),
      ]);
      setDependencias(dep);
      setEmisores(emi);
    } catch (e) {
      console.error(e);
      setError(e);
      if (fallback?.dependencias) setDependencias(fallback.dependencias);
      if (fallback?.emisores) setEmisores(fallback.emisores);
    } finally {
      setLoading(false);
    }
  }, [fallback]);

  useEffect(() => {
    if (preload) loadAll();
  }, [loadAll, preload]);

  const depById = useMemo(
    () => new Map((dependencias || []).map(o => [String(o.value), o.label])),
    [dependencias]
  );
  const emiById = useMemo(
    () => new Map((emisores || []).map(o => [String(o.value), o.label])),
    [emisores]
  );

  const value = useMemo(() => ({
    dependencias,
    emisores,
    isLoading,
    error,
    maps: { depById, emiById },
    refresh: loadAll,
    labelFromDependenciaId: (id) => depById.get(String(id)) ?? String(id ?? "—"),
    labelFromEmisorId: (id) => emiById.get(String(id)) ?? String(id ?? "—"),
  }), [dependencias, emisores, isLoading, error, depById, emiById, loadAll]);

  return (
    <ReferenciasCtx.Provider value={value}>
      {children}
    </ReferenciasCtx.Provider>
  );
}

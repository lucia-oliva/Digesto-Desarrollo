// src/hooks/useNamespacedFilters.js
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useFiltersContext } from "../context/FiltersContext";

function buildNs({ scope, type, pathname, nsStrategy }) {
  if (nsStrategy === "byType") return `ns:${scope}:${type}`;
  // default: byPath (útil en público si tenés varias rutas)
  return `ns:${scope}:${type}:${pathname}`;
}

export function useNamespacedFilters({
  scope,
  type,
  initial = {},
  persist = false, // public: true | admin: false
  urlSync = false, // public: true | admin: false
  resetOnUnmount = false, // public: false | admin: true (si desmonta)
  resetOnNsChange = true, // 🔸 Admin: reset al cambiar entidad/type
  nsStrategy = "byType", // 🔸 Admin usa byType; público puede usar byPath
  onHydrated,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const ctx = useFiltersContext();

  const ns = useMemo(
    () => buildNs({ scope, type, pathname: location.pathname, nsStrategy }),
    [scope, type, location.pathname, nsStrategy]
  );

  const prevNsRef = useRef(ns);

  // Re-init al entrar o cuando cambia el ns (p.ej. cambia de entidad en la misma vista)
  useEffect(() => {
    const STORAGE_KEY = `filters:${ns}`;
    const prevNs = prevNsRef.current;

    // Si el namespace cambió y queremos limpiar el anterior, lo reseteamos
    if (prevNs && prevNs !== ns && resetOnNsChange) {
      ctx.reset(prevNs);
      if (persist) sessionStorage.removeItem(`filters:${prevNs}`);
    }
    prevNsRef.current = ns;

    let base = { ...initial };

    if (persist) {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          base = JSON.parse(raw);
        } catch {}
      }
    }
    if (urlSync) {
      const fromUrl = Object.fromEntries([...params.entries()]);
      if (Object.keys(fromUrl).length) base = { ...base, ...fromUrl };
    }

    ctx.init(ns, base);
    onHydrated?.(base);

    return () => {
      if (resetOnUnmount) {
        ctx.reset(ns);
        if (persist) sessionStorage.removeItem(STORAGE_KEY);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ns]); // se ejecuta cuando cambia type o (si nsStrategy es byPath) el pathname

  const writingUrlRef = useRef(false);
  const lastSearchStringRef = useRef("");

  // Persistir y (opcionalmente) sync con URL (solo usar en público)
  useEffect(() => {
    const { filters } = ctx.get(ns);
    const STORAGE_KEY = `filters:${ns}`;

    if (persist) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
      } catch {}
    }
    if (!urlSync) return; // Admin no sincroniza URL

    // Evitar bucles
    if (writingUrlRef.current) {
      writingUrlRef.current = false;
      return;
    }

    const current = Object.fromEntries([...params.entries()]);
    const next = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "" && v != null)
    );

    const currentStr = new URLSearchParams(current).toString();
    const nextStr = new URLSearchParams(next).toString();

    if (currentStr === nextStr || lastSearchStringRef.current === nextStr)
      return;

    writingUrlRef.current = true;
    lastSearchStringRef.current = nextStr;
    // Solo actualizamos el search; no tocamos pathname (no interferimos con Link)
    navigate({ search: nextStr ? `?${nextStr}` : "" }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.get(ns).filters, ns, urlSync, persist]);

  const setFilters = (next) => ctx.set(ns, next || {});
  const reset = () => ctx.reset(ns);

  return { ns, state: ctx.get(ns), setFilters, reset };
}

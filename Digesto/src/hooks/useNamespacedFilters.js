import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useFiltersContext } from "../context/FiltersContext";

function buildNs({ scope, type, pathname, nsStrategy }) {
  if (nsStrategy === "byType") return `ns:${scope}:${type}`;
  return `ns:${scope}:${type}:${pathname}`; // byPath (público)
}

export function useNamespacedFilters({
  scope,
  type,
  initial = {},
  // Público vs Admin
  urlSync = false, // público: true | admin: false
  nsStrategy = "byPath", // público: byPath | admin: byType
  // Reset/persist
  resetOnUnmount = false, // salir de la página → borra estado mem y storage (si se indica)
  resetOnNsChange = false, // cambiar entidad (type) en la misma vista → reset
  persist = false, // usar sessionStorage
  clearStorageOnUnmount = false, // borrar clave en storage al desmontar
  ignoreStorageIfNoQuery = false, // si NO hay ?query, no uses storage (default limpio)
  requireQueryToPersist = false, // solo persistir si hay ?query
  onHydrated, // callback(filtros) al hidratar
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
  const writingUrlRef = useRef(false);
  const lastSearchStringRef = useRef("");

  // HIDRATACIÓN
  useEffect(() => {
    const STORAGE_KEY = `filters:${ns}`;
    const prevNs = prevNsRef.current;

    // si cambia el namespace (ej. cambia la entidad), reset opcional del anterior
    if (prevNs && prevNs !== ns && resetOnNsChange) {
      ctx.reset(prevNs);
      try {
        if (persist) sessionStorage.removeItem(`filters:${prevNs}`);
      } catch {}
    }
    prevNsRef.current = ns;

    const hasQuery = location.search.length > 1;
    let base = { ...initial };

    // prioridad de hidratación: URL → (opcional) storage → initial
    if (urlSync && hasQuery) {
      const fromUrl = Object.fromEntries([...params.entries()]);
      if (Object.keys(fromUrl).length) base = { ...base, ...fromUrl };
    } else if (persist && !(ignoreStorageIfNoQuery && !hasQuery)) {
      // solo usamos storage si no nos pidieron ignorarlo por falta de query
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          base = JSON.parse(raw);
        } catch {}
      }
    }

    ctx.init(ns, base);
    onHydrated?.(base);

    return () => {
      if (resetOnUnmount) {
        ctx.reset(ns);
        if (clearStorageOnUnmount) {
          try {
            sessionStorage.removeItem(STORAGE_KEY);
          } catch {}
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ns]);

  // PERSISTENCIA estado → storage + URL (público)
  useEffect(() => {
    const { filters } = ctx.get(ns);
    const STORAGE_KEY = `filters:${ns}`;
    const hasQuery = location.search.length > 1;

    // persistencia condicionada
    if (persist && (!requireQueryToPersist || hasQuery)) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
      } catch {}
    }

    if (!urlSync) return;

    // evitar bucles por nuestro propio navigate
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
    // solo tocamos el search
    navigate({ search: nextStr ? `?${nextStr}` : "" }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.get(ns).filters, ns, urlSync, persist, requireQueryToPersist]);

  // URL → estado (si la URL cambió “desde afuera”, ej. click en card o abrir nueva pestaña)
  useEffect(() => {
    if (!urlSync) return;
    if (writingUrlRef.current) {
      writingUrlRef.current = false;
      return;
    }

    const fromUrl = Object.fromEntries(
      new URLSearchParams(location.search).entries()
    );
    const next = Object.fromEntries(
      Object.entries(fromUrl).filter(([, v]) => v !== "" && v != null)
    );
    const curr = ctx.get(ns).filters || {};

    const same =
      Object.keys(curr).length === Object.keys(next).length &&
      Object.keys(curr).every((k) => String(curr[k]) === String(next[k]));

    if (!same) {
      ctx.set(ns, next);
      if (persist) {
        try {
          sessionStorage.setItem(`filters:${ns}`, JSON.stringify(next));
        } catch {}
      }
      onHydrated?.(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, ns, urlSync, persist]);

  const setFilters = (next) => ctx.set(ns, next || {});
  const reset = () => ctx.reset(ns);

  return { ns, state: ctx.get(ns), setFilters, reset };
}

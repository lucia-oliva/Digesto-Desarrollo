/* eslint-disable no-empty */
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useFiltersContext } from "../context/FiltersContext";

function buildNs({ scope, type, pathname, nsStrategy }) {
  if (nsStrategy === "byType") return `ns:${scope}:${type}`;
  return `ns:${scope}:${type}:${pathname}`; 
}

export function useNamespacedFilters({
  scope,
  type,
  initial = {},
  urlSync = false, 
  nsStrategy = "byPath", 
  resetOnUnmount = false, 
  resetOnNsChange = false, 
  persist = false, 
  clearStorageOnUnmount = false, 
  ignoreStorageIfNoQuery = false, 
  requireQueryToPersist = false, 
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
  const writingUrlRef = useRef(false);
  const lastSearchStringRef = useRef("");


  useEffect(() => {
    const STORAGE_KEY = `filters:${ns}`;
    const prevNs = prevNsRef.current;
    if (prevNs && prevNs !== ns && resetOnNsChange) {
      ctx.reset(prevNs);
      try {
        if (persist) sessionStorage.removeItem(`filters:${prevNs}`);
      } catch {}
    }
    prevNsRef.current = ns;

    const hasQuery = location.search.length > 1;
    let base = { ...initial };
    if (urlSync && hasQuery) {
      const fromUrl = Object.fromEntries([...params.entries()]);
      if (Object.keys(fromUrl).length) base = { ...base, ...fromUrl };
    } else if (persist && !(ignoreStorageIfNoQuery && !hasQuery)) {
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
  useEffect(() => {
    const { filters } = ctx.get(ns);
    const STORAGE_KEY = `filters:${ns}`;
    const hasQuery = location.search.length > 1;
    if (persist && (!requireQueryToPersist || hasQuery)) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
      } catch {}
    }

    if (!urlSync) return;
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
    navigate({ search: nextStr ? `?${nextStr}` : "" }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.get(ns).filters, ns, urlSync, persist, requireQueryToPersist]);
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

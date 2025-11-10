/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import AlphabetFilter from "./AlphabetFilter";
import { filterConfig } from "./configFilters";
import api from "../../api/axiosPrivate";
import { useReferencias } from "../../context/referenciasContext";

function useContextOptions(fromContext) {
  const { dependencias, emisores } = useReferencias() || {};

  const mapList = (arr) =>
    (arr || []).map((it) => ({
      label: String(it?.nombre ?? it?.label ?? "").trim(),
      value: String(it?.id ?? it?.value ?? "").trim(),
    }));

  switch (fromContext) {
    case "dependencias":
      return mapList(dependencias);
    case "emisores":
      return mapList(emisores);
    default:
      return [];
  }
}

function useAsyncOptions(field, type) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const cacheKey = useMemo(() => {
    if (!field?.async || !field?.endpoint) return null;
    return `async:${type}:${field.name}:${field.key || "default"}`;
  }, [field, type]);

  useEffect(() => {
    let cancel = false;
    async function fetchOptions() {
      if (!field?.async || !field?.endpoint || !cacheKey) return;
      setLoading(true);
      try {
        const { data } = await api.get(field.endpoint);
        const list = Array.isArray(data?.data) ? data.data : [];
        if (cancel) return;
         const mapped = list.map((it) => ({
          label: String(it?.label ?? it?.[field.key] ?? it).trim(),
          value: String(it?.value ?? it?.[field.key] ?? it).trim(),
        }));
        setOptions(mapped);
      } catch (e) {
        setOptions([]);
        console.log(e);
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    fetchOptions();
    return () => {
      cancel = true;
    };
  }, [cacheKey, field]);

  return { options, loading };
}

function pruneStateForFields(state, fields) {
  const allowed = new Set(fields.map((f) => f.name));
  const next = {};
  for (const k of Object.keys(state || {})) {
    if (allowed.has(k)) next[k] = state[k];
  }
  return next;
}

function FieldRenderer({ field, value, onChange }) {
  const { name, type, label, options, fromContext } = field;
  const ctxOptions = useContextOptions(fromContext);
  const { options: asyncOpts, loading: asyncLoading } = useAsyncOptions(field);

  const effectiveOptions = useMemo(() => {
    if (field?.async) return asyncOpts;
    if (fromContext) return ctxOptions;
    return options || [];
  }, [field, asyncOpts, ctxOptions, options]);

  if (type === "text") {
    return (
      <div className="flex flex-col">
        <label className="mb-1 font-medium max-[426px]:text-xs">
          <span className="label-text">{label}</span>
        </label>
        <input
          className="input input-bordered max-[426px]:input-sm w-full"
          value={value ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={label}
        />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="flex flex-col">
        <label className="mb-1 font-medium max-[426px]:text-xs">
          <span className="label-text">{label}</span>
        </label>
        <select
          className="select select-bordered max-[425px]:select-sm w-full"
          value={value ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={field?.async && asyncLoading}
        >
          {!effectiveOptions.some((o) => String(o.value) === "") && (
            <option value="">Todos</option>
          )}
          {effectiveOptions.map((opt) => (
            <option key={`${name}-${opt.value}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return null;
}

export default function GenericFilterSearch({
  type,
  scope,
  initialState = {},
  autoSearch = false,
  onSearch = () => {},
}) {
  const fields = useMemo(() => filterConfig?.[type] || [], [type]);
  const [formState, setFormState] = useState(() =>
    pruneStateForFields({ ...initialState }, fields)
  )
  useEffect(() => {
    const next = pruneStateForFields({ ...initialState }, fields);
    setFormState(next);
  }, [initialState, fields]);
  const handleInput = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };
  const handleBuscar = () => {
    const next = pruneStateForFields(formState, fields);
    onSearch(next);
  };
  useEffect(() => {
    if (autoSearch) {
      const next = pruneStateForFields(formState, fields);
      onSearch(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSearch, type, scope]);
  const hasLetter = useMemo(
    () => fields.some((f) => f.name === "letra" || f.type === "custom"),
    [fields]
  );

  const handleLetterSelect = (letra) => {
    const next = { ...formState, letra };
    const pruned = pruneStateForFields(next, fields);
    setFormState(pruned);
    onSearch(pruned);
  };

  return (
     <div className="p-6 rounded-2xl shadow-md border border-gray-200 bg-base-100 mb-4 hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-bold mb-4 max-[426px]:text-sm">Filtros de búsqueda</h2>
       {hasLetter && (
        <div className="mt-3 mb-4">
          <AlphabetFilter
            value={formState.letra || ""}
            onChange={handleLetterSelect}
          />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields
          .filter((f) => f.type !== "custom")
          .map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={formState?.[field.name]}
              onChange={handleInput}
            />
          ))}
        <div className="flex items-end">
          <button className="btn btn-primary w-full" onClick={handleBuscar}>
            Buscar
          </button>
        </div>
      </div>
      {hasLetter && (
        <div className="mt-3">
          <AlphabetFilter
            value={formState.letra || ""}
            onChange={handleLetterSelect}
          />
        </div>
      )}
    </div>
  );
}

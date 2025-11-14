import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosPrivate";

export function useAsyncOptions(field, type) {
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

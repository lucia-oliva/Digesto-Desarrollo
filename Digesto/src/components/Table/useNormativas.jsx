// components/Normativas/useNormativas.js
import { useEffect, useState } from "react";
import { searchNormativas, deleteApi } from "./NormativaApi";
import {useRef} from "react";

export const useNormativas = (type,filtros) => {
  const [normativas, setNormativas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevFiltrosRef = useRef(JSON.stringify(filtros));

  // Fetch inicial
  useEffect(() => {
    const currentFiltrosString = JSON.stringify(filtros);
    if (prevFiltrosRef.current !== currentFiltrosString) {
      // Filtros cambiaron, reseteamos a página 1
      setPage(1);
      prevFiltrosRef.current = currentFiltrosString;
    }
  }, [filtros]);

  useEffect(() => {
    loadNormativas(page);
  }, [page, type]);

  
  const loadNormativas = async (pageToLoad) => {
    try {
      setLoading(true);
      setError(null);
      const res = await searchNormativas(pageToLoad, 6, type,filtros);
      console.log(res);
      setNormativas(res.data || []);
      const total = res.totalResults || 1;
      setTotalPages(Math.ceil(total / 10));
    } catch (err) {
      setError("Error al cargar normativas", err);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (newPage) => setPage(newPage);

  const onEdit = (item) => {
    // Implementa tu lógica para abrir modal o navegación
    console.log("Editar:", item);
  };

  const onDelete = async (item) => {
    if (!window.confirm("¿Eliminar normativa?")) return;

    try {
      setLoading(true);
      const response = await deleteApi(item.id,type);
      if (!response.ok) throw new Error("No se pudo eliminar");
      // Refrescar lista
      loadNormativas(page);
    } catch (err) {
      setError("Error al eliminar la normativa", err);
    } finally {
      setLoading(false);
    }
  };

  const reload = () => {
    loadNormativas(page);
  };

  return {
    normativas,
    page,
    totalPages,
    loading,
    error,
    onPageChange,
    onEdit,
    onDelete,
    reload,
  };
};

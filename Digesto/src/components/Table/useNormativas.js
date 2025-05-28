// components/Normativas/useNormativas.js
import { useEffect, useState } from "react";
import { searchNormativas, deleteNormativa } from "./normativaApi";

export function useNormativas() {
  const [normativas, setNormativas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch inicial
  useEffect(() => {
    loadNormativas(page);
  }, [page]);

  const loadNormativas = async (pageToLoad) => {
    try {
      setLoading(true);
      setError(null);
      const res = await searchNormativas("", pageToLoad, 10);
      setNormativas(res.normativas || []);
      const total = res.totalResults || 1;
      setTotalPages(Math.ceil(total / 10));
    } catch (err) {
      setError("Error al cargar normativas");
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
      const response = await deleteNormativa(item.id);
      if (!response.ok) throw new Error("No se pudo eliminar");
      // Refrescar lista
      loadNormativas(page);
    } catch (err) {
      setError("Error al eliminar la normativa");
    } finally {
      setLoading(false);
    }
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
  };
}

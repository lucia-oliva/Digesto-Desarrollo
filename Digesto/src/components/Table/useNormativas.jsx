// components/Normativas/useNormativas.js

import { useEffect, useState, useRef } from "react";
import {
  searchNormativas,
  deleteApi,
  searchNormativasEliminadas,
  searchNormativasDespublicadas,
} from "./NormativaApi";
import { useNavigate } from "react-router";
import { nombreRutaPorEntidad } from "../../pages/admin/Edit/mapeoCamposEdit.js";
import { API_BASE } from "../../api/axiosPrivate.js";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

/**
 * @param {string} type        Entidad / tipo (ej: 'normativas', 'sesiones', etc.)
 * @param {object} filtros     Objeto de filtros activos
 * @param {object} options     { ns?: string, pageSize?: number }
 */

export const useNormativas = (type, filtros, options = {}) => {
  const { ns = `ns:admin:${type}`, pageSize = 6 } = options;

  const { auth } = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();

  const [normativas, setNormativas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState(
    "No se encontraron resultados. Probá cambiar los filtros."
  );

  const prevFiltrosRef = useRef(JSON.stringify(filtros));
  const prevTypeRef = useRef(type);
  const requestSeqRef = useRef(0); // ↑ se incrementa en cada load; para ignorar respuestas viejas

  // Reset de página si cambian los filtros
  useEffect(() => {
    const currentFiltrosString = JSON.stringify(filtros);
    if (prevFiltrosRef.current !== currentFiltrosString) {
      prevFiltrosRef.current = currentFiltrosString;
      setPage(1);
    }
  }, [filtros]);

  // Reset de página si cambia el type (misma vista con sidebar)
  useEffect(() => {
    if (prevTypeRef.current !== type) {
      prevTypeRef.current = type;
      setPage(1);
      // también limpiar resultados para no mostrar “fantasmas”
      setNormativas([]);
      setTotalPages(1);
    }
  }, [type]);

  // Cargar datos cuando cambian page o type o filtros (si page ya era 1)
  useEffect(() => {
    loadNormativas(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type]);

  // Si cambian filtros y page ya es 1, recargar (porque el efecto de arriba solo escucha [page,type])
  useEffect(() => {
    const currentFiltrosString = JSON.stringify(filtros);
    if (prevFiltrosRef.current === currentFiltrosString && page === 1) {
      // mismos filtros, no hagas nada
      return;
    }
    if (page === 1) {
      loadNormativas(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const loadNormativas = async (pageToLoad) => {
    const mySeq = ++requestSeqRef.current; // capturamos el número de request de esta carga

    try {
      setLoading(true);
      setError(null);

      // ----- Sesiones (endpoint especial)
      if (type === "sesiones") {
        const response = await axios.get(`${API_BASE}/dependencia/sesiones`, {
          params: { page: pageToLoad, limite: pageSize },
        });
        // Si llegó una respuesta vieja, la ignoramos
        if (requestSeqRef.current !== mySeq) return;

        const payload = response?.data ?? {};
        if (payload.error) {
          setNormativas([]);
          setTotalPages(0);
          setEmptyMessage(
            payload.error ||
              "No se encontraron resultados. Probá cambiar los filtros."
          );
        } else {
          const list = Array.isArray(payload.data) ? payload.data : [];
          const total = Number(payload.totalResults) || 0;
          setNormativas(list);
          setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
          setEmptyMessage(
            "No se encontraron resultados. Probá cambiar los filtros."
          );
        }
        return;
      }

      // ----- Eliminadas
      if (type === "normativasEliminadas") {
        const res = await searchNormativasEliminadas(
          pageToLoad,
          pageSize,
          type,
          filtros
        );
        if (requestSeqRef.current !== mySeq) return;

        setNormativas(res?.data || []);
        const total = Number(res?.totalResults || 0);
        setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
        return;
      }

      // ----- Despublicadas
      if (type === "normativaDespublicadas") {
        const res = await searchNormativasDespublicadas(
          pageToLoad,
          pageSize,
          type,
          filtros
        );
        if (requestSeqRef.current !== mySeq) return;

        setNormativas(res?.data || []);
        const total = Number(res?.totalResults || 0);
        setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
        return;
      }

      // ----- Caso general
      const res = await searchNormativas(pageToLoad, pageSize, type, filtros);
      if (requestSeqRef.current !== mySeq) return;

      setNormativas(res?.data || []);
      const total = Number(res?.totalResults || 0);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
      // Ignorar si llegó tarde (aunque en error no suele pasar, mantenemos simetría)
      if (requestSeqRef.current !== mySeq) return;

      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "No se encontraron resultados. Probá cambiar los filtros.";
      setError("Error al cargar normativas");
      setNormativas([]);
      setTotalPages(1);
      setEmptyMessage(msg);
    } finally {
      // Solo terminar si seguimos siendo la request vigente
      if (requestSeqRef.current === mySeq) {
        setLoading(false);
      }
    }
  };

  const onPageChange = (newPage) => setPage(newPage);

  const onEdit = (item) => {
    const rutaEntidad = nombreRutaPorEntidad[type] || type;
    // Para sesiones, el id es distinto
    if (rutaEntidad === "Sesion") {
      const id = item.id_sesion || item.id;
      navigate(`/consejo-superior/Editar${rutaEntidad}/${id}`);
    } else {
      navigate(`/admin/Editar${rutaEntidad}/${item.id}`);
    }
  };

  const onDelete = async (item) => {
    const msg =
      type === "tag"
        ? "¿Eliminar Tag?"
        : type === "usuarios"
        ? "¿Eliminar Usuario?"
        : type === "dependencia"
        ? "¿Eliminar Dependencia?"
        : type === "emisores"
        ? "¿Eliminar Emisor?"
        : "¿Eliminar normativa?";

    if (!window.confirm(msg)) return;

    const idParaBorrar = item.id || item.id_sesion;
    const shouldGoBack =
      page > 1 && Array.isArray(normativas) && normativas.length === 1;

    try {
      setLoading(true);
      const response = await deleteApi(idParaBorrar, type, user?.id);

      const ok =
        (typeof response?.ok === "boolean" && response.ok) ||
        (typeof response?.status === "number" &&
          response.status >= 200 &&
          response.status < 300) ||
        response?.data?.success === true ||
        response?.success === true;

      if (!ok) throw new Error("No se pudo eliminar");

      if (shouldGoBack) {
        setPage((p) => Math.max(1, p - 1)); // dispara recarga por efecto
      } else {
        await loadNormativas(page); // recarga misma página
      }

      alert("Se eliminó correctamente");
    } catch (err) {
      console.error("[DELETE] ERROR:", err);
      setError("Error al eliminar la normativa");
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

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
 * @param {string} type        
 * @param {object} filtros    
 * @param {object} options    
 */

export const useNormativas = (type, filtros, options = {}) => {
  const { ns = `ns:admin:${type}`, pageSize = 6, confirmFn } = options;
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
  const requestSeqRef = useRef(0); 

  useEffect(() => {
    const currentFiltrosString = JSON.stringify(filtros);
    if (prevFiltrosRef.current !== currentFiltrosString) {
      prevFiltrosRef.current = currentFiltrosString;
      setPage(1);
    }
  }, [filtros]);

 
  useEffect(() => {
    if (prevTypeRef.current !== type) {
      prevTypeRef.current = type;
      setPage(1);
      setNormativas([]);
      setTotalPages(1);
    }
  }, [type]);
  useEffect(() => {
    loadNormativas(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type]);

  useEffect(() => {
    const currentFiltrosString = JSON.stringify(filtros);
    if (prevFiltrosRef.current === currentFiltrosString && page === 1) {
      return;
    }
    if (page === 1) {
      loadNormativas(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const loadNormativas = async (pageToLoad) => {
    const mySeq = ++requestSeqRef.current; 

    try {
      setLoading(true);
      setError(null);
      if (type === "sesiones") {
        const response = await axios.get(`${API_BASE}/dependencia/sesiones`, {
          params: { page: pageToLoad, limite: pageSize },
        });
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
      const res = await searchNormativas(pageToLoad, pageSize, type, filtros);
      if (requestSeqRef.current !== mySeq) return;

      setNormativas(res?.data || []);
      const total = Number(res?.totalResults || 0);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
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
      if (requestSeqRef.current === mySeq) {
        setLoading(false);
      }
    }
  };

  const onPageChange = (newPage) => setPage(newPage);
  
  const onEdit = (item) => {
    const rutaEntidad = nombreRutaPorEntidad[type] || type;
    if (rutaEntidad === "Sesion") {
      const id = item.id_sesion || item.id;
      navigate(`/consejo-superior/Editar${rutaEntidad}/${id}`);
    } else {
      navigate(`/admin/Editar${rutaEntidad}/${item.id}`);
      if(rutaEntidad === "normativaDespublicadas" || rutaEntidad === "normativasEliminadas"){
        navigate(`/admin/EditarNormativa/${item.id}`);
      }
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
    let autorizado = true;
    if (typeof confirmFn === "function") {
      autorizado = await confirmFn("Confirmar eliminación", msg);
    } else {
      autorizado = window.confirm(msg);
    }

    if (!autorizado) return;

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
        setPage((p) => Math.max(1, p - 1)); 
      } else {
        await loadNormativas(page); 
      }
    } catch (err) {
      console.error("[DELETE] ERROR:", err);
      setError(err.message);
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
    ns,
    emptyMessage
  };
};

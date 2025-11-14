import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { nombreRutaPorEntidad } from "../../pages/admin/Edit/mapeoCamposEdit.js";
import { useAuth } from "../../context/useAuth.jsx";
import { deleteApi } from "./NormativaApi.jsx";
import { loadNormativasByType } from "./utils/loadNormativasByType.js";
import { buildDeleteMessage, isResponseOk } from "./utils/deleteUtils.js";
/**
 * @param {string} type        
 * @param {object} filtros    
 * @param {object} options    
 */
export const useTablaEntidad = (type, filtros, options = {}) => {
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

      const result = await loadNormativasByType({type,pageToLoad,pageSize,filtros,});

      if (requestSeqRef.current !== mySeq) return;

      const {data,total,emptyMessage: customEmpty,totalPagesOverride,} = result;

      setNormativas(data || []);

      if (typeof totalPagesOverride === "number") {
        setTotalPages(totalPagesOverride);
      } else {
        const safeTotal = Number(total || 0);
        setTotalPages(Math.max(1, Math.ceil(safeTotal / pageSize)));
      }

      if (typeof customEmpty === "string") {
        setEmptyMessage(customEmpty);
      }
    } catch (err) {
      if (requestSeqRef.current !== mySeq) return;
      const msg = err?.response?.data?.error ||
        err?.message || "No se encontraron resultados. Probá cambiar los filtros.";
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
      if (rutaEntidad === "normativaDespublicadas" || rutaEntidad === "normativasEliminadas") {
        navigate(`/admin/EditarNormativa/${item.id}`);
      }
    }
  };

  const onDelete = async (item) => {
    const msg = buildDeleteMessage(type);

    let autorizado = true;
    if (typeof confirmFn === "function") {
      autorizado = await confirmFn("Confirmar eliminación", msg);
    } else {
      autorizado = window.confirm(msg);
    }

    if (!autorizado) return;

    const idParaBorrar = item.id || item.id_sesion;
    const shouldGoBack = page > 1 && Array.isArray(normativas) && normativas.length === 1;

    try {
      setLoading(true);
      const response = await deleteApi(idParaBorrar, type, user?.id);
      const ok = isResponseOk(response);

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

  const reload = () => {loadNormativas(page);} ;

  return {
    normativas,page,totalPages,loading,error,onPageChange,onEdit,onDelete,reload,ns,
    emptyMessage
  };
};

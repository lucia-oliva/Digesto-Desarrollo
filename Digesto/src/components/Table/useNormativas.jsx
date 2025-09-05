// components/Normativas/useNormativas.js

//algo se buggeo aca, revisar commit anterior
import { useEffect, useState , useRef } from "react";
import { searchNormativas, deleteApi,  searchNormativasEliminadas, searchNormativasDespublicadas} from "./NormativaApi";
import { useNavigate } from "react-router";
import { nombreRutaPorEntidad } from "../../pages/admin/Edit/mapeoCamposEdit.js";

import axios from "axios"; 
import {useAuth} from '../../context/useAuth';


export const useNormativas = (type,filtros) => {
  const {auth} = useAuth();
  const user = auth.user;
  
  const [normativas, setNormativas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevFiltrosRef = useRef(JSON.stringify(filtros));
  const navigate = useNavigate();
  const [emptyMessage, setEmptyMessage] = useState("No se encontraron resultados. Probá cambiar los filtros.");
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
      let res;
      let total;
      if (type === "sesiones") {
        const response = await axios.get(
          "http://localhost:3000/api/dependencia/sesiones",
          { params: { page: pageToLoad, limite: 6 } }
        );

        const payload = response?.data ?? {}; 

        if (payload.error) {
          setNormativas([]);
          setTotalPages(0);
          setEmptyMessage(payload.error || "No se encontraron resultados. Probá cambiar los filtros.");
        } else {
          const list = Array.isArray(payload.data) ? payload.data : [];
          const total = Number(payload.totalResults) || 0;

          setNormativas(list);
          setTotalPages(Math.max(1, Math.ceil(total / 6)));
          setEmptyMessage("No se encontraron resultados. Probá cambiar los filtros.");
        }

        return; 
      }else if(type === "normativasEliminadas"){
        res = await searchNormativasEliminadas(pageToLoad, 6, type,filtros);
        console.log(res);
        setNormativas(res.data || []);
        total = res.totalResults || 1;
        setTotalPages(Math.ceil(total/6));

      }else if(type === "normativaDespublicadas"){
        res = await searchNormativasDespublicadas(pageToLoad, 6, type,filtros);
        console.log(res);
        setNormativas(res.data || []);
        total = res.totalResults || 1;
        setTotalPages(Math.ceil(total/6));
      }else{
        res = await searchNormativas(pageToLoad, 6, type,filtros);
        console.log(res);
      setNormativas(res.data || []);
      total = res.totalResults || 1;
      setTotalPages(Math.ceil(total / 6));
      }
      
    } catch (err) {
      setError("Error al cargar normativas", err);
       setError("Error al cargar normativas");
      const msg = err?.response?.data?.error || "No se encontraron resultados. Probá cambiar los filtros.";
+      setNormativas([]);
+      setTotalPages(1);
+      setEmptyMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (newPage) => setPage(newPage);

  const onEdit = (item) => {
    
      const rutaEntidad = nombreRutaPorEntidad[type] || type; 
      console.log(rutaEntidad);
      console.log("id item: ", item.id);
      console.log("id item sesion: ", item.id_sesion);

    if(rutaEntidad === "Sesion"){
      item.id = item.id_sesion
      navigate(`/consejo-superior/Editar${rutaEntidad}/${item.id}`);
    }else{
       navigate(`/admin/Editar${rutaEntidad}/${item.id}`);
    }
  }
  

  
  const onDelete = async (item) => {
    const msg =
      type === "tag" ? "¿Eliminar Tag?" :
      type === "usuarios" ? "¿Eliminar Usuario?" :
      type === "dependencia" ? "¿Eliminar Dependencia?" :
      type === "emisores" ? "¿Eliminar Emisor?" :
      "¿Eliminar normativa?";

    if (!window.confirm(msg)) return;

    // ----- LOG: qué type es y qué id estamos usando
    const idParaBorrar = item.id || item.id_sesion; // <--- si dependencias usa otra pk (id_dependencia), probalo a mano acá
    console.log("[DELETE] type:", type, "id:", idParaBorrar, "page:", page, "len antes:", normativas.length);

    // decidir si hay que retroceder (si queda vacía la página actual)
    const shouldGoBack = page > 1 && Array.isArray(normativas) && normativas.length === 1;
    console.log("[DELETE] shouldGoBack?:", shouldGoBack);

    try {
      setLoading(true);
      const response = await deleteApi(idParaBorrar, type, user?.id);

      const ok =
        (typeof response?.ok === "boolean" && response.ok) ||
        (typeof response?.status === "number" && response.status >= 200 && response.status < 300) ||
        response?.data?.success === true ||
        response?.success === true;

      console.log("[DELETE] response:", response, "ok:", ok);
      if (!ok) throw new Error("No se pudo eliminar");

      if (shouldGoBack) {
        console.log("[DELETE] acción -> retroceder página");
        setPage((p) => Math.max(1, p - 1)); // esto dispara el useEffect y recarga
      } else {
        console.log("[DELETE] acción -> recargar misma página");
        await loadNormativas(page); // recarga directa
      }

      console.log("[DELETE] FIN (tras recarga), len ahora (estado):", normativas.length);
      alert("Se elimino correctamente");
    } catch (err) {
      console.error("[DELETE] ERROR:", err);
      setError("Error al eliminar la normativa");
    } finally {
      setLoading(false);
    }
  };

  const reload = () => {
    console.log("[RELOAD] manual page:", page, "type:", type);
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

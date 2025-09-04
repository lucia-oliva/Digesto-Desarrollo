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
    console.log(type);
    if(type === "tag"){
    if (!window.confirm("¿Eliminar Tag?")) return;
  }else if(type=== "usuarios"){
    if (!window.confirm("¿Eliminar Usuario?")) return;
  }else if(type=== "dependencia"){
    if (!window.confirm("¿Eliminar Dependencia")) return;
  }else if(type=== "emisores"){
    if (!window.confirm("¿Eliminar Emisor?")) return;
  }
  else{
    if (!window.confirm("¿Eliminar normativa?")) return;
  }

    try {
      setLoading(true);
      console.log("prueba usuario eliminaaaar",user.id);
      const response = await deleteApi(item.id || item.id_sesion,type,user.id);
      if (!response.ok) throw new Error("No se pudo eliminar");
      
      // Refrescar lista
      loadNormativas(page);
      alert("Se elimino correctamente");

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

// components/Normativas/useNormativas.js
import { useEffect, useState , useRef } from "react";
import { searchNormativas, deleteApi } from "./NormativaApi";
import { useNavigate } from "react-router";

import axios from "axios"; 

export const useNormativas = (type,filtros) => {
  const [normativas, setNormativas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevFiltrosRef = useRef(JSON.stringify(filtros));
  const navigate = useNavigate();

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
      if(type=== "sesiones"){
        res = await axios.get("http://localhost:3000/api/dependencia/sesiones", {params: {page:pageToLoad, limite: 6}});
        setNormativas(res.data.data);
        total = res.data.totalResults || 1;
        setTotalPages(Math.ceil(total / 6));
      }else{
        res = await searchNormativas(pageToLoad, 6, type,filtros);
        console.log(res);
      setNormativas(res.data || []);
      total = res.totalResults || 1;
      setTotalPages(Math.ceil(total / 10));
      }
      
    } catch (err) {
      setError("Error al cargar normativas", err);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (newPage) => setPage(newPage);

  const onEdit = async({id}) => {
    console.log(`Editando normativa con ID: ${id} de tipo ${type}`);
    
    try{
      switch (type) {
        case "normativa":
          navigate(`/admin/EditarNormativa/${id}`);
          break;
        case "usuarios":
          navigate(`/admin/EditarUsuario/${id}`);
          break;
        case "dependencia":
          navigate(`/admin/EditarDependencia/${id}`);
          break;
        case "emisore":
          navigate(`/admin/EditarEmisor/${id}`);
          break;
        case "tag":
          navigate(`/admin/EditarPalabraClave/${id}`);
          break;
      }
    }
    catch (err) {
      setError("Error al redirigir a la edición", err);
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm("¿Eliminar?")) return;
    console.log(item);

    try {
      setLoading(true);
      const response = await deleteApi(item.id || item.id_sesion,type);
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

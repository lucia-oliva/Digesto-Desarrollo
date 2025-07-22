// components/Normativas/useNormativas.js
import { useEffect, useState , useRef } from "react";
import { searchNormativas, deleteApi, editApi} from "./NormativaApi";
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
      setTotalPages(Math.ceil(total / 6));
      }
      
    } catch (err) {
      setError("Error al cargar normativas", err);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (newPage) => setPage(newPage);

  const onEdit = (item) => {
      const rutaEntidad = nombreRutaPorEntidad[type] || type; 
    navigate(`/admin/Editar${rutaEntidad}/${item.id}`);
  }
  

  
  const onDelete = async (item) => {
    
    if (!window.confirm("¿Eliminar normativa?")) return;

    try {
      setLoading(true);
      console.log("prueba usuario eliminaaaar",user.id);
      const response = await deleteApi(item.id || item.id_sesion,type,user.id);
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

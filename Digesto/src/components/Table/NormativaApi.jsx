import axios from "axios";
import { API_BASE } from "../../api/axiosPrivate";


export const cambiarEstadoUsuario = async (id_usuario, nuevo_estado) => {
  try {
    const { data } = await axios.post(
        `${API_BASE}/usuarios/cambiar-estado`,
      { id_usuario, nuevo_estado },
      { headers: { "Content-Type": "application/json" } }
    );
    return data; 
  } catch (error) {
    console.error("Error al cambiar estado de usuario:", error);
    throw error;
  }
};

export const searchNormativas = async (page, limit, type, filtros={}) => {
  console.log("tipo:",type, "filtros:",filtros);
  try {
    const response = await axios.post(
      `${API_BASE}/${type}/search?page=${page}&limite=${limit}`,
      filtros,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al buscar normativas:", error);
    throw error;
  }
};

export const searchNormativasEliminadas = async (page, limit, type, filtros={}) =>{
  console.log("tipo:", type, "filtros:", filtros);
  try{
    const response = await axios.post(
      `${API_BASE}/normativa/searchEliminadas?page=${page}&limite=${limit}`,
      filtros,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  }catch(error){
    console.error("Error al buscar normativas eliminadas", error);
    throw error;
  }
}

export const searchNormativasDespublicadas = async (page, limit, type, filtros={}) =>{
  console.log("tipo:", type, "filtros:", filtros);
  try{
    const response = await axios.post(
      `${API_BASE}/normativa/searchDespublicadas?page=${page}&limite=${limit}`,
      filtros,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  }catch(error){
    console.error("Error al buscar normativas despublicadas", error);
    throw error;
  }
}




export const deleteApi = async (id,type,userId) => {
  try {
    console.log(id , type, userId);
    if(type==="normativaDespublicadas"){
      type="normativa"
    }
    const response = await fetch(`${API_BASE}/${type}/eliminar/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,  
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error al eliminar normativa:", error);
    throw error;
  }
}
  

export const editApi = async (dataToEdit, type, userId) => {
  try {
    const payload = {
      ...dataToEdit,
      userId, 
    };

    const response = await axios.post(
      `${API_BASE}/${type}/edit`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error al editar ${type}:`, error);
    throw error;
  }
};

export const restoreApi = async (id, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE}/normativa/restaurar/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al restaurar normativa:", error);
    throw error;
  }
};


export const publicarApi = async (id, userId) => {
  try{
      const response = await axios.post(
         `${API_BASE}/normativa/publicar/${id}`,
          {},
          {
            headers: {
              "Content-Type" : "application/json",
              "x-user-id": userId,
            },
          }
        );
        return response.data;
  }catch(error){
    console.error("Error al restaurar normativa:", error);
    throw error;
  }
}

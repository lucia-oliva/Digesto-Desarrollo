import axios from "axios";


export const searchNormativas = async (page, limit, type, filtros={}) => {
  console.log("tipo:",type, "filtros:",filtros);
  try {
    const response = await axios.post(
      `http://localhost:3000/api/${type}/search?page=${page}&limite=${limit}`,
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
      `http://localhost:3000/api/normativa/searchEliminadas?page=${page}&limite=${limit}`,
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
      `http://localhost:3000/api/normativa/searchDespublicadas?page=${page}&limite=${limit}`,
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
    const response = await fetch(`http://localhost:3000/api/${type}/eliminar/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,  // 👈 lo mandamos por header
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
      `http://localhost:3000/api/${type}/edit`,
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
      `http://localhost:3000/api/normativa/restaurar/${id}`,
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
         `http://localhost:3000/api/normativa/publicar/${id}`,
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

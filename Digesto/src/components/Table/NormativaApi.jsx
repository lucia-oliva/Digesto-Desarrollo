import api from "../../api/axiosPrivate";

export const cambiarEstadoUsuario = async (id_usuario, nuevo_estado) => {
  try {
    const { data } = await api.post("/usuarios/cambiar-estado", {
      id_usuario,
      nuevo_estado,
    });

    return data;
  } catch (error) {
    console.error("Error al cambiar estado de usuario:", error);
    throw error;
  }
};

export const searchNormativas = async (page, limit, type, filtros = {}) => {
  console.log("tipo:", type, "filtros:", filtros);

  try {
    const response = await api.post(
      `/${type}/search?page=${page}&limite=${limit}`,
      filtros
    );

    return response.data;
  } catch (error) {
    console.error("Error al buscar normativas:", error);
    throw error;
  }
};

export const searchNormativasEliminadas = async (
  page,
  limit,
  type,
  filtros = {},
) => {
  console.log("tipo:", type, "filtros:", filtros);
  try {
    const response = await api.post(
      `/normativa/searchEliminadas?page=${page}&limite=${limit}`,
      filtros,
    );
    return response.data;
  } catch (error) {
    console.error("Error al buscar normativas eliminadas", error);
    throw error;
  }
};

export const searchNormativasDespublicadas = async (
  page,
  limit,
  type,
  filtros = {},
) => {
  console.log("tipo:", type, "filtros:", filtros);
  try {
    const response = await api.post(
      `/normativa/searchDespublicadas?page=${page}&limite=${limit}`,
      filtros,
    );
    return response.data;
  } catch (error) {
    console.error("Error al buscar normativas despublicadas", error);
    throw error;
  }
};

export const deleteApi = async (id, type, userId) => {
  try {
    console.log(id, type, userId);
    if (type === "normativaDespublicadas") {
      type = "normativa";
    }
    const response = await api.delete(`/${type}/eliminar/${id}`, {
      headers: {
        "x-user-id": userId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al eliminar normativa:", error);
    throw error;
  }
};

export const editApi = async (dataToEdit, type, userId) => {
  try {
    const payload = {
      ...dataToEdit,
      userId,
    };

    const response = await api.post(`/${type}/edit`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al editar ${type}:`, error);
    throw error;
  }
};

export const restoreApi = async (id, userId) => {
  try {
    const response = await api.post(
      `/normativa/restaurar/${id}`,
      {},
      {
        headers: {
          "x-user-id": userId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al restaurar normativa:", error);
    throw error;
  }
};

export const publicarApi = async (id, userId) => {
  try {
    const response = await api.post(
      `/normativa/publicar/${id}`,
      {},
      {
        headers: {
          "x-user-id": userId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al restaurar normativa:", error);
    throw error;
  }
};

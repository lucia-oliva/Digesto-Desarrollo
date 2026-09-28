import api from "../../api/axiosPrivate";

export const cambiarEstadoUsuario = async (
  id_usuario,
  nuevo_estado,
) => {
  const { data } = await api.post(
    "/usuarios/cambiar-estado",
    {
      id_usuario,
      nuevo_estado,
    },
  );

  return data;
};

export const searchNormativas = async (
  page,
  limit,
  type,
  filtros = {},
) => {
  const response = await api.post(
    `/${type}/search?page=${page}&limite=${limit}`,
    filtros,
  );

  return response.data;
};

export const searchNormativasEliminadas = async (
  page,
  limit,
  type,
  filtros = {},
) => {
  const response = await api.post(
    `/normativa/searchEliminadas?page=${page}&limite=${limit}`,
    filtros,
  );

  return response.data;
};

export const searchNormativasDespublicadas = async (
  page,
  limit,
  type,
  filtros = {},
) => {
  const response = await api.post(
    `/normativa/searchDespublicadas?page=${page}&limite=${limit}`,
    filtros,
  );

  return response.data;
};

export const deleteApi = async (id, type, userId) => {
  if (type === "normativaDespublicadas") {
    type = "normativa";
  }

  const response = await api.delete(
    `/${type}/eliminar/${id}`,
    {
      headers: {
        "x-user-id": userId,
      },
    },
  );

  return response.data;
};

export const editApi = async (
  dataToEdit,
  type,
  userId,
) => {
  const payload = {
    ...dataToEdit,
    userId,
  };

  const response = await api.post(
    `/${type}/edit`,
    payload,
  );

  return response.data;
};

export const restoreApi = async (id, userId) => {
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
};

export const publicarApi = async (id, userId) => {
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
};
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

export const deleteApi = async (id, type) => {
  if (type === "normativaDespublicadas") {
    type = "normativa";
  }

  const response = await api.delete(
    `/${type}/eliminar/${id}`,
  );
  return response.data;
};

export const editApi = async (
  dataToEdit,
  type
) => {
  const response = await api.post(
    `/${type}/edit`,
    dataToEdit,
  );
  return response.data;
};

export const restoreApi = async (id) => {
  const response = await api.post(
    `/normativa/restaurar/${id}`,
  );

  return response.data;
};

export const publicarApi = async (id) => {
  const response = await api.post(
    `/normativa/publicar/${id}`,
  );

  return response.data;
};
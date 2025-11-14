import axios from "axios";
import { API_BASE } from "../../../api/axiosPrivate.js";
import {
  searchNormativas,
  searchNormativasEliminadas,
  searchNormativasDespublicadas,
} from "../NormativaApi";

const DEFAULT_EMPTY_MESSAGE =
  "No se encontraron resultados. Probá cambiar los filtros.";

export async function loadNormativasByType({
  type,
  pageToLoad,
  pageSize,
  filtros,
}) {
  if (type === "sesiones") {
    const response = await axios.get(`${API_BASE}/dependencia/sesiones`, {
      params: { page: pageToLoad, limite: pageSize },
    });

    const payload = response?.data ?? {};

    if (payload.error) {
      return {
        data: [],
        total: 0,
        emptyMessage: payload.error || DEFAULT_EMPTY_MESSAGE,
        totalPagesOverride: 0,
      };
    }

    const list = Array.isArray(payload.data) ? payload.data : [];
    const total = Number(payload.totalResults) || 0;

    return {
      data: list,
      total,
      emptyMessage: DEFAULT_EMPTY_MESSAGE,
    };
  }

  if (type === "normativasEliminadas") {
    const res = await searchNormativasEliminadas(
      pageToLoad,
      pageSize,
      type,
      filtros
    );

    return {
      data: res?.data || [],
      total: Number(res?.totalResults || 0),
    };
  }

  if (type === "normativaDespublicadas") {
    const res = await searchNormativasDespublicadas(
      pageToLoad,
      pageSize,
      type,
      filtros
    );

    return {
      data: res?.data || [],
      total: Number(res?.totalResults || 0),
    };
  }

  const res = await searchNormativas(pageToLoad, pageSize, type, filtros);

  return {
    data: res?.data || [],
    total: Number(res?.totalResults || 0),
  };
}

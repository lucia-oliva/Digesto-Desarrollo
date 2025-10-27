import api from "../api/axiosPrivate";

const normalize = (rows = []) =>
  rows.map(r => ({
    label: r.nombre,      
    value: String(r.id), 
    raw: r, 
  }));

export async function fetchDependencias() {
  const { data } = await api.get("/dependencia/getDependencias");
  return normalize(Array.isArray(data) ? data : data?.rows ?? []);
}

export async function fetchEmisores() {
  const { data } = await api.get("/emisores/getEmisores");
  return normalize(Array.isArray(data) ? data : data?.rows ?? []);
}


// Cambiar normativas por todos los tipos
export const searchNormativas = async (numero, page, limit) => {
  // Implementa tu lógica para buscar por tipo
  const res = await fetch(`http://localhost:3000/api/normativa/search?page=${page}&limit=${limit}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numero }),
  });
  return res.json();
};

export const deleteNormativa = async (id) => {
  return fetch(`http://localhost:3000/api/normativa/delete/${id}`, {
    method: "DELETE",
  });
};

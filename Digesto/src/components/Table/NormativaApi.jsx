import axios from "axios";

export const searchNormativas = async (page, limit, type) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/${type}/search?page=${page}&limite=${limit}`,
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


export const deleteNormativa = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/normativa/delete/${id}`, {
      method: "DELETE",
    });
    return response.json();
  } catch (error) {
    console.error("Error al eliminar normativa:", error);
    throw error;
  }
}
  
import db from "./db.js";


async function getAllTags(){
    const sql = "SELECT nombre FROM tag";
     const results = await db.query(sql,[]);
    return results;
}

//Obtener tags de normativa

//Get Tags

async function getTagsByNormativaId(id) {
  try {
    const sql = `
      SELECT t.nombre AS tag
      FROM tag_normativa tn
      JOIN tag t ON tn.id_tag = t.id
      WHERE tn.id_normativa = ?
    `;
    const results = await db.query(sql, [id]);
    return results.map((row) => row.tag); 
  } catch (err) {
    console.error("Error al obtener los tags de la normativa:", err);
    throw err;
  }
}

export default {getAllTags, getTagsByNormativaId};

import db from "./db.js";


async function getAllTags(){
    const sql = "SELECT nombre FROM tag";
     const results = await db.query(sql,[]);
    return results;
}

//Obtener tags de normativa

//Insertar Tags en normativa - Verificar si existe tags en normativas
async function insertTagsForNormativa(normativaId, tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    console.warn("No se proporcionaron tags válidos.");
    return;
  }

  for (const tag of tags) {
    if (!tag) {
      console.error("El valor de 'tag' es inválido:", tag);
      continue; // Saltar este tag si es inválido
    }

    try {
      // Verificar si el tag ya existe
      const results = await db.query("SELECT id FROM tag WHERE nombre = ?", [tag]) || [];
      let existingTag = results.length > 0 ? results[0] : null;

      if (!existingTag) {
        // Si no existe, insertar el tag en la tabla `tag`
        const result = await db.query("INSERT INTO tag (nombre) VALUES (?)", [tag]);
        existingTag = { id: result.insertId };
      }

      // Asociar el tag con la normativa en la tabla `tag_normativa`
      await db.query("INSERT INTO tag_normativa (id_normativa, id_tag) VALUES (?, ?)", [
        normativaId,
        existingTag.id,
      ]);
    } catch (error) {
      console.error(`Error al procesar el tag '${tag}':`, error);
    }
  }
}



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

export default {getAllTags, getTagsByNormativaId,insertTagsForNormativa};

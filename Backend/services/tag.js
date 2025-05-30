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

//Buscar tags por parametros 

async function searchTagsByParameters(
  nombre,
  letra, 
  limite = null,
  offset = null
){
  try{
    let sql = "SELECT * FROM tag WHERE 1=1";
    const params = [];
    if (letra) {
      sql += " AND tag.nombre LIKE ? ";
      params.push(`${letra}%`);
    }

    if (nombre) {
      sql += " AND tag.nombre LIKE ? ";
      params.push(`%${nombre}%`);
    }
  
    sql += " ORDER BY nombre ASC";
    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }
    const results = await db.query(sql, params);
    const totalResults = results?.length > 0 ? results[0].total : 0;
    console.log(params,sql);
     if (!results) {
      console.log(
        "No se encontró los tags con los parámetros especificados"
      );
      return { data: [], totalResults };
    }
    return { data: results, totalResults };
  }catch (error) {
    console.error("Error al buscar tags por parámetros:", error);
  }
}


export default {getAllTags, getTagsByNormativaId,insertTagsForNormativa, searchTagsByParameters};

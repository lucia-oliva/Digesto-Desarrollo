import db from "./db.js";

//BASIC CRUD


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
    return results.map((row) => row.tag); // Devuelve un array de nombres de tags
  } catch (err) {
    console.error("Error al obtener los tags de la normativa:", err);
    throw err;
  }
}

//Delete by id

async function deleteNormativaById(id) {
  try {
    await db.query("DELETE FROM tag_normativa WHERE id_normativa = ?", [id]);
    const sql = "DELETE FROM normativa WHERE id = ?";
    const result = await db.query(sql, [id]);
    if (result.affectedRows === 0) {
      console.log(`No se encontró la normativa con el ID ${id}`);
      return { success: false, message: "Normativa no encontrada" };
    }
    return { success: true, message: "Normativa eliminada correctamente" };
  } catch (error) {
    console.error("Error al eliminar la normativa:", error);
    throw error;
  }
}


//ENDPOINTS ESPECIFICOS
async function getAllYears() {
  const sql = "SELECT DISTINCT anio FROM normativa";
  const results = await db.query(sql, []);
  return results;
}

async function getEliminatedNormatives(){
  const sql = "SELECT n.titulo, e.nombre AS emisor, n.numero, DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa WHERE n.estado = 'eliminada'";
  const results = await db.query(sql, []);
  return results;
}

async function getAllNormativas() {
  const sql =
    "SELECT n.titulo, e.nombre AS emisor, n.numero, DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia, COUNT(*) AS total_busqueda FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa GROUP BY n.id, n.titulo, e.nombre, n.numero, n.fecha_normativa, tn.nombre, n.visitas  DESC LIMIT 10";
  const results = await db.query(sql, []);
  return results;
}

async function searchByNumber(number) {
  try {
    const sql = "SELECT * FROM normativa WHERE numero = ?";
    const results = await db.query(sql, [number]);
    if (results.length === 0) {
      console.log("No se encontró la normativa con el número", number);
      return null;
    }
    return results;
  } catch (err) {
    console.error("Error al buscar normativa por número: ", err);
    throw err;
  }
}

async function searchById(id) {
  try {
    const sql =
      "SELECT n.titulo , CONCAT(n.numero, '/', n.anio) AS numero , n.archivo , n.resumen , DATE_FORMAT(n.fecha_normativa, '%d-%m-%Y') AS fecha ,e.nombre AS emisor,d.nombre AS dependencia,tn.nombre AS tipo_normativa FROM normativa n JOIN emisor e ON n.id_emisor = e.id  JOIN dependencia d ON d.id = n.id_dependencia  JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa WHERE n.id = ?";
    const results = await db.query(sql, [id]);
    if (!results) {
      console.log("No se encontró la normativa con el índice", id);
      return null;
    }
    return results[0];
  } catch (err) {
    console.error("Error al buscar normativa por índice: ", err);
    throw err;
  }
}

//Busqueda avanzada de normativas
async function searchNormativaByParameters(
  numero,
  dependencia,
  emisor,
  documento,
  anio,
  limite = null,
  offset = null,
  tags,
) {
  try {
    let sql =
      "SELECT t.nombre,n.id, n.resumen, n.archivo, n.anio, n.archivo ,n.titulo, n.visitas, e.nombre AS emisor, n.numero, DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, tn.nombre AS tipo_normativa,  d.nombre AS dependencia, COUNT(*) OVER() as total FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa INNER JOIN tag_normativa tn2 ON n.id = tn2.id_normativa INNER JOIN tag t ON tn2.id_tag = t.id WHERE 1 = 1 AND n.estado = 'publicado'";
    let params = [];

    if (numero) {
      sql += " AND numero = ?";
      params.push(numero);
    }
    if (dependencia) {
      sql += " AND id_dependencia = ?";
      params.push(dependencia);
    }
    if (emisor) {
      sql += " AND id_emisor = ?";
      params.push(emisor);
    }
    if (documento) {
      sql += " AND id_tipo_normativa = ?";
      params.push(documento);
    }
    
    if (anio) {
      sql += " AND anio = ?";
      params.push(anio);
    }

    console.log("tags", tags);

    if (tags) {
      sql += ` AND t.nombre = (?)`;
      params.push(tags);
    }

    sql += " GROUP BY n.id ";

    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }

    const results = await db.query(sql, params);
    const totalResults = results?.length > 0 ? results[0].total : 0;

    console.log(params,sql);

    if (!results) {
      console.log(
        "No se encontró la normativa con los parámetros especificados"
      );
      return { normativas: [], totalResults };
    }
    return { normativas: results, totalResults };
  } catch (err) {
    console.error("Error al buscar normativa por parámetros: ", err);
    throw err;
  }
}

//Buscador mediante Tags...
async function searchNormativasByTags(dependencia, tags) {
  console.log(tags);
  const placeholders = tags.map(() => "?").join(",");

  const sql = `
        SELECT n.id, n.titulo, n.numero, n.id_dependencia,
        n.id_tipo_normativa,n.resumen,n.anio, n.estado,
        GROUP_CONCAT(t.nombre SEPARATOR ',') AS tags
        FROM normativa n
        JOIN tag_normativa tn ON n.id = tn.id_normativa
        JOIN tag t ON tn.id_tag = t.id
        WHERE n.id_dependencia = ? AND LOWER(t.nombre) IN (${placeholders})
        GROUP BY n.id
    `;
  try {
    const params = [dependencia, ...tags];
    const results = await db.query(sql, params);
    return results;
  } catch (error) {
    console.log("Error en la consulta de normativas:", error);
    throw error;
  }
}

// 10 Normativas mas buscadas
async function getMostPopularNormatives() {
  const sql =
    "SELECT n.titulo,n.id, e.nombre AS emisor, n.numero, DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia, COUNT(*) AS total_busqueda FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa GROUP BY n.id, n.titulo, e.nombre, n.numero, n.fecha_normativa, tn.nombre, n.visitas ORDER BY n.visitas DESC LIMIT 10";
  const results = await db.query(sql, []);
  return results;
}

async function updateNormativa(id, normativaData) {
  const {
    numero,
    anio,
    titulo,
    resumen,
    fecha,
    dependencia,
    emisor,
    tipo_normativa,
    estado,
    tags,
  } = normativaData;

    console.log("normativaData", normativaData);
    console.log("tags", tags);
    console.log("id", id);
    
  try {
    // Validar que tags sea un array
    if (!Array.isArray(tags)) {
      throw new TypeError("El campo 'tags' debe ser un array");
    }

    // Actualizar los datos de la normativa
    const sqlUpdateNormativa = `
      UPDATE normativa
      SET numero = ?, anio = ?, titulo = ?, resumen = ?, fecha_normativa = ?, 
          id_dependencia = ?, id_emisor = ?, id_tipo_normativa = ?, estado = ?
      WHERE id = ?
    `;
    await db.query(sqlUpdateNormativa, [
      numero,
      anio,
      titulo,
      resumen,
      fecha,
      dependencia,
      emisor,
      tipo_normativa,
      estado,
      id,
    ]);

    // Actualizar los tags asociados
    await db.query("DELETE FROM tag_normativa WHERE id_normativa = ?", [id]);

    if (tags.length > 0) {
      const tagInsertPromises = tags.map(async (tag) => {
        // Verificar si el tag ya existe
        let [existingTag] = await db.query("SELECT id FROM tag WHERE nombre = ?", [tag]);
        if (!existingTag) {
          // Si no existe, insertarlo
          const result = await db.query("INSERT INTO tag (nombre) VALUES (?)", [tag]);
          existingTag = { id: result.insertId };
        }

        // Asociar el tag con la normativa
        await db.query("INSERT INTO tag_normativa (id_normativa, id_tag) VALUES (?, ?)", [
          id,
          existingTag.id,
        ]);
      });

      await Promise.all(tagInsertPromises);
    }

    return { message: "Normativa actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar la normativa:", error);
    throw error;
  }
}

export default {
  getAllYears,
  searchByNumber,
  searchNormativaByParameters,
  getAllNormativas,
  searchNormativasByTags,
  getMostPopularNormatives,
  searchById,
  getEliminatedNormatives,
  deleteNormativaById,getTagsByNormativaId, updateNormativa
};

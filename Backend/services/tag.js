import db from "./db.js";

async function getById(id) {
  try {
    const [result] = await db.query(
      "SELECT id, nombre AS Tag FROM tag WHERE id = ?",
      [id]
    );
    return result || null;
  } catch (error) {
    console.error("Error en getById:", error);
    throw error;
  }
}

async function edit(data){
  const {id, nombre} = data;
  try {
    // Verificar si ya existe un tag con ese nombre
    const existing = await db.query("SELECT id FROM tag WHERE nombre = ? AND id != ?", [nombre, id]);
    if (existing && existing.length > 0) {
      // Ya existe, no actualizar
      console.log({ mensaje: `Tag '${nombre}' ya existe`});
      return { success: false, message: `Tag '${nombre}' ya existe` };
    } else {
      // Actualizar el tag
      const result = await db.query("UPDATE tag SET nombre = ? WHERE id = ?", [nombre, id]);
      if (result.affectedRows > 0) {
        console.log({ mensaje: `Tag '${nombre}' actualizado correctamente` });
        return { success: true, message: `Tag '${nombre}' actualizado correctamente` };
      } else {
        console.log({ mensaje: `No se encontró el tag con ID ${id}` });
        return { success: false, message: `No se encontró el tag con ID ${id}` };
      }
    }
  }catch(error) {
    console.error("Error al editar el tag:", error);
    throw error;
  }
}

async function getAllTags(){
    const sql = "SELECT nombre FROM tag";
     const results = await db.query(sql,[]);
    return results;
}

async function create(data) {
  console.log(data);
  const {Tag} = data;
  try {
          // Verificar si ya existe un tag con ese nombre
          const existing = await db.query("SELECT id FROM tag WHERE nombre = ?", [Tag]);
          if (existing && existing.length > 0) {
            // Ya existe, no insertar
            console.log({ mensaje: `Tag '${Tag}' ya existe`});
          }else{
          const result = await db.query("INSERT INTO tag (nombre) VALUES (?)", [Tag]);
          console.log({ id: result.insertId, mensaje: `Tag '${Tag}' creado correctamente`});
        }}catch (error) {
    console.error("Error al crear el tag:", error);
    throw error;
  }
}


//Obtener tags de normativa

async function insertTagsForNormativa(normativaId, tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    console.warn("No se proporcionaron tags válidos.");
    return;
  }

  for (const tag of tags) {
    if (!tag) {
      console.error("El valor de 'tag' es inválido:", tag);
      continue;
    }

    try {
      // Buscar si el tag ya existe
      const [existingTagRow] = await db.query(
        "SELECT id FROM tag WHERE nombre = ?",
        [tag]
      );
      let tagId;

      if (!existingTagRow) {
        // Insertar el tag si no existe
        const result = await db.query(
          "INSERT INTO tag (nombre) VALUES (?)",
          [tag]
        );
        tagId = result.insertId;
      } else {
        tagId = existingTagRow.id;
      }

      // Verificar si ya está asociada la normativa con ese tag
      const [existingLink] = await db.query(
        "SELECT 1 FROM tag_normativa WHERE id_normativa = ? AND id_tag = ?",
        [normativaId, tagId]
      );

      if (!existingLink) {
        // Insertar la relación solo si no existe
        await db.query(
          "INSERT INTO tag_normativa (id_normativa, id_tag) VALUES (?, ?)",
          [normativaId, tagId]
        );
      } else {
        console.log(`Ya existe la relación normativa=${normativaId}, tag=${tag}`);
      }
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
    let sql = "SELECT t.id, t.nombre , count(tn.id_tag) as cantidad_usos, COUNT(*) OVER() as total FROM tag t LEFT JOIN tag_normativa tn on t.id= tn.id_tag  WHERE 1=1";
    const params = [];
    if (letra) {
      if(letra === "#"){
        sql += " AND t.nombre REGEXP '^[^A-Za-z]' ";
      }else{
        sql += " AND t.nombre LIKE ? ";
        params.push(`${letra}%`);
      }
    }

    if (nombre) {
      sql += " AND t.nombre LIKE ? ";
      params.push(`%${nombre}%`);
    }
    sql += " GROUP BY t.id, t.nombre";
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


async function eliminar(id) {
  try {
    // Primero eliminar relaciones
    await db.query("DELETE FROM tag_normativa WHERE id_tag = ?", [id]);

    // Luego eliminar el tag en sí
    const result = await db.query("DELETE FROM tag WHERE id = ?", [id]);

    if (!result || result.affectedRows === 0) {
      console.log(`No se encontró el tag con el ID ${id}`);
      return null;
    }

    console.log(`Tag con ID ${id} eliminado correctamente.`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar tag:", error);
    throw error;
  }
}



export default {getAllTags,eliminar,getTagsByNormativaId,insertTagsForNormativa, searchTagsByParameters,create,edit, getById};

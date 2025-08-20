import db from "./db.js";
import tagService from "./tag.js";
import auditoriaService from "./auditoria.js";

//BASIC CRUD

//para la funcion de editar
async function getNormativaCompletaById(id) {
  try {
   
    const normativaSql = `
      SELECT n.id, n.numero, n.anio, n.titulo, n.resumen, n.archivo,
             DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha,
             d.nombre AS dependencia,
             e.nombre AS emisor,
             tn.id AS tipo_normativa,
             n.estado
      FROM normativa n
      JOIN dependencia d ON d.id = n.id_dependencia
      JOIN emisor e ON e.id = n.id_emisor
      JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
      WHERE n.id = ?
    `;
    const [normativa] = await db.query(normativaSql, [id]);
    if (!normativa) return null;

    
    const tagsSql = `
      SELECT t.nombre
      FROM tag t
      JOIN tag_normativa tn ON t.id = tn.id_tag
      WHERE tn.id_normativa = ?
    `;
    const tagsResults = await db.query(tagsSql, [id]);
    const tags = tagsResults.map(tag => tag.nombre);
    
    const relacionesSql = `
      SELECT
             r.normativa_original AS id,
             r.id AS id_relacion,
             no.titulo AS titulo,
             r.comentario,
             a.nombre AS accion
      FROM relacion r
      JOIN normativa no ON no.id = r.normativa_original
      JOIN acciones_normativa a ON a.id = r.id_acciones
      WHERE r.normativa_complementaria = ?
    `;
    const normativas_modificadas = await db.query(relacionesSql, [id]);

    return {
      ...normativa,
      tags,
      normativas_modificadas
    };
  } catch (error) {
    console.error("Error en getNormativaCompletaById:", error);
    throw error;
  }
}


//funciona!
async function updateModificacion({ id_relacion, accion, comentario }) {
  try {
    const result = await db.query(
      `UPDATE relacion SET id_acciones = ?, comentario = ? WHERE id = ?`,
      [accion, comentario, id_relacion]
    );

    if (result.affectedRows > 0) {
      return {
        success: true,
        message: `Relación con ID ${id_relacion} actualizada correctamente`,
      };
    } else {
      return {
        success: false,
        message: `No se encontró la relación con ID ${id_relacion}`,
      };
    }
  } catch (error) {
    console.error("Error en updateModificacion:", error);
    throw error;
  }
}

//eliminacion de TODAS las relaciones de una normativa
//funciona!
async function eliminarRelacionesDeNormativa(normativaId) {
  try {
    //verificar si existen relaciones para eliminar
    const result1 = await db.query(
      "SELECT id FROM relacion WHERE normativa_complementaria = ? LIMIT 1",
      [normativaId]
    );
    if (!result1 || result1.length === 0 ) {
      console.log(
        `No hay relaciones para eliminar de la normativa ${normativaId}`
      );
      return { success: true, message: "No hay relaciones para eliminar" };
    } else {
      const result = await db.query(
        "DELETE FROM relacion WHERE normativa_complementaria = ?",
        [normativaId]
      );

      if (result.affectedRows > 0) {
        console.log(
          `Se eliminaron ${result.affectedRows} relaciones de la normativa ${normativaId}`
        );
        return {
          success: true,
          message: `Se eliminaron ${result.affectedRows} relaciones de la normativa ${normativaId}`,
        };
      }
    }
  } catch (error) {
    console.error("Error al eliminar relaciones:", error);
    throw error;
  }
}

//cambio es el array de normativas_modificadas.
//funciona!
async function editNormativaModificada(
  normativas_modificadas,
  normativaId,
  fechaSubida
) {
  for (const mod of normativas_modificadas) {
    const { id, id_relacion, accion, comentario, estado } = mod;

    if (!estado) {
      throw new Error(
        `El campo 'estado' es obligatorio para procesar las modificaciones`
      );
    }

    switch (estado) {
      case "eliminar":
        if (id_relacion) {
          await deleteModificacion(id_relacion);
          console.log(`Relación con ID ${id_relacion} eliminada correctamente`);
        } else {
          console.warn(
            `No se especificó id_relacion para eliminar una relación`
          );
        }
        break;

      case "nueva":
        if (id && accion) {
          await registrarModificacion({
            id,
            accion,
            comentario,
            fechaSubida,
            normativaId,
          });
        } else {
          console.warn(
            `Faltan datos para crear una nueva relación: id o accion`
          );
        }
        break;

      case "modificar":
        if (id_relacion && accion) {
          await updateModificacion({ id_relacion, accion, comentario });
        } else {
          console.warn(`Faltan datos para modificar una relación existente`);
        }
        break;

      default:
        console.warn(`Estado desconocido: ${estado}`);
    }
  }
}

//funciona!
async function edit(data) {
  const {
    id,
    id_emisor,
    titulo,
    numero,
    fecha_normativa,
    id_dependencia,
    id_tipo_normativa,
    resumen,
    estado,
    archivo,
    anio,
    cambia_normativa,
    tags,
    normativas_modificadas,
    userId
  } = data;

  const id_interdependencia = 0;

  //primero se edita la normativa
  try {
    const sqlUpdateNormativa = `
        UPDATE normativa
        SET numero = ?, anio = ?, titulo = ?, resumen = ?, fecha_normativa = ?,id_dependencia = ?, id_emisor = ?, id_tipo_normativa = ?, estado = ?, archivo = ?, id_interdependencia = ?
        WHERE id = ?`;
    const result = await db.query(sqlUpdateNormativa, [
      numero,
      anio,
      titulo,
      resumen,
      fecha_normativa,
      id_dependencia,
      id_emisor,
      id_tipo_normativa,
      estado,
      archivo,
      id_interdependencia,
      id,
    ]);

    //luego se actualizan tags
    await tagService.insertTagsForNormativa(id, tags);
    if (result.affectedRows > 0) {
      console.log({
        mensaje: `Tags de normativa con ID ${id} actualizados correctamente`,
      });

      //luego se verifica si hay normativas modificadas y se actualizan si las tiene.

      const fechaSubida = new Date().toISOString().split("T")[0];

      if (cambia_normativa === "SI") {
        if (
          Array.isArray(normativas_modificadas) &&
          normativas_modificadas.length > 0
        ) {
          try {
            await editNormativaModificada(
              normativas_modificadas,
              id,
              fechaSubida
            );
          } catch (modError) {
            console.error("Error al modificar relaciones:", modError);
            return {
              success: true,
              message: `Normativa actualizada pero hubo errores en relaciones`,
              relacionesError: modError.message,
            };
          }
        } else {
          console.warn(
            "Se indicó que cambia normativas, pero no se enviaron modificaciones."
          );
        }
      } else if (cambia_normativa === "NO") {
        if (
          Array.isArray(normativas_modificadas) &&
          normativas_modificadas.length > 0
        ) {
          console.warn(
            "Se indicó que NO cambia normativas, pero llegaron relaciones. Se eliminaran."
          );
        }
        await eliminarRelacionesDeNormativa(id);
      }
      //Crear registro de auditoría
      if (userId) {
        await auditoriaService.crearRegistroAuditoria({
          id_normativa: id,
          id_usuario: userId,
          tipo: "modificacion"
        });
      }
      return {
        success: true,
        message: `Normativa con ID ${id} editada correctamente`,
      };
    } else {
      console.log({ mensaje: `No se encontró la normativa con ID ${id}` });
      return {
        success: false,
        message: `No se encontró la normativa con ID ${id}`,
      };
    }
  } catch (error) {
    console.error("Error al editar la normativa:", error);
    throw error;
  }
}

//funciona bien
async function deleteModificacion(id) {
  try {
    const result = await db.query("DELETE FROM relacion WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      console.log({ mensaje: `Relación con ID ${id} eliminada correctamente` });
      return {
        success: true,
        message: `Relación con ID ${id} eliminada correctamente`,
      };
    } else {
      console.log({ mensaje: `No se encontró la relación con ID ${id}` });
      return {
        success: false,
        message: `No se encontró la relación con ID ${id}`,
      };
    }
  } catch (error) {
    console.error("Error al eliminar la relación:", error);
    throw error;
  }
}

//Registrar Modificacion
//normativa original: id de la normativa que se modifica
//normativa complementaria: id de la normativa que se relaciona
//funciona!
async function registrarModificacion({
  id,
  accion,
  comentario,
  fechaSubida,
  normativaId,
}) {
  console.log(
    "registrarModificacion:",
    id,
    accion,
    comentario,
    fechaSubida,
    normativaId
  );

  try {
    const result = await db.query(
      `INSERT INTO relacion (normativa_original, normativa_complementaria, comentario, fecha, id_acciones)
      VALUES (?, ?, ?, ?, ?)`,
      [id, normativaId, comentario, fechaSubida, accion]
    );

    const insertId = result.insertId;

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "No se encontró la normativa con ese ID",
      };
    }

    return {
      success: true,
      message: `Modificación registrada correctamente con ID: ${insertId}`,
    };
  } catch (error) {
    console.error("Error en registrarModificacion:", error);
    return { success: false, message: "Error al registrar la modificación" };
  }
}

async function create(data) {

  
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
    archivo,
    normativas_modificadas,
    user
    
  } = data;

  try {
    const fechaSubida = new Date().toISOString().split("T")[0];
    const sqlInsertNormativa = `
        INSERT INTO normativa (numero, anio, titulo, resumen, fecha_normativa, 
          id_dependencia, id_emisor, id_tipo_normativa, estado, archivo, fecha_alta, id_creador)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    const result = await db.query(sqlInsertNormativa, [
      numero,
      anio,
      titulo,
      resumen,
      fecha,
      dependencia,
      emisor,
      tipo_normativa,
      estado,
      archivo,
      fechaSubida,
      user.id, // ID del usuario que crea la normativa
    ]);

    const normativaId = result.insertId;
    const modificacionesAplicadas = [];

    if (
      Array.isArray(normativas_modificadas) &&
      normativas_modificadas.length > 0
    ) {
      for (const mod of normativas_modificadas) {
        const { id, accion, comentario } = mod;
        console.log(
          "datos para la otra funcion:",
          id,
          accion,
          comentario,
          fechaSubida,
          normativaId
        );
        if (id && accion) {
          const resultado = await registrarModificacion({
            id,
            accion,
            comentario,
            fechaSubida,
            normativaId,
          });
          modificacionesAplicadas.push({ id, ...resultado });
        } else {
          modificacionesAplicadas.push({
            id: id || null,
            success: false,
            message: "Faltan datos obligatorios",
          });
        }
      }
    }
    // Insertar los tags relacionados en la tabla `tag_normativa`
    await tagService.insertTagsForNormativa(normativaId, tags);
    //Crear registro de auditoría
    if(user && user.id) {
      await auditoriaService.crearRegistroAuditoria({
      id_normativa: normativaId, 
      id_usuario: user.id,
      tipo: "alta"
      });
    }
    return {
      success: true,
      message: "Normativa creada correctamente",
      id: normativaId,
    };
  } catch (error) {
    console.error("Error al crear la normativa:", error);
    throw error;
  }
}

//Eliminar por id
async function eliminar(id, userId, motivo = null) {
  console.log("backend user", userId);
  try {
 
    const rows = await db.query("SELECT estado FROM normativa WHERE id = ?", [id]);
    if (!rows || rows.length === 0) {
      console.log(`No se encontró la normativa con el ID ${id}`);
      return { success: false, message: "Normativa no encontrada" };
    }

    const estadoAnterior = rows[0].estado;
    if (estadoAnterior === "eliminada") {
      return { success: true, message: "La normativa ya estaba eliminada" };
    }

    
    const sql = "UPDATE normativa SET estado = 'eliminada' WHERE id = ?";
    const result = await db.query(sql, [id]);

    if (!result || result.affectedRows === 0) {
      return { success: false, message: "No se pudo actualizar la normativa" };
    }

  
    if (userId) {
      await auditoriaService.crearRegistroAuditoria({
        id_normativa: id,
        id_usuario: userId,
        tipo: "baja",

      });
    }

    return { success: true, message: "Normativa marcada como eliminada" };
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

async function getEliminatedNormatives() {
  const sql =
    "SELECT n.titulo, e.nombre AS emisor, n.numero, DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa WHERE n.estado = 'eliminada'";
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
    console.log(results);

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
// Busqueda avanzada de normativas (publicadas) SIN perder por tags
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
      "SELECT " +
      "  n.id, n.resumen, n.archivo, n.anio, n.titulo, n.visitas, " +
      "  e.nombre AS emisor, n.numero, " +
      "  DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, " +
      "  tn.nombre AS tipo_normativa, d.nombre AS dependencia, " +
      "  COUNT(*) OVER() as total " +
      "FROM normativa n " +
      "JOIN emisor e ON n.id_emisor = e.id " +
      "JOIN dependencia d ON d.id = n.id_dependencia " +
      "JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa " +
      "WHERE 1 = 1 AND n.estado = 'publicado'";

    let params = [];

    if (numero) {
      sql += " AND n.numero = ?";
      params.push(numero);
    }
    if (dependencia) {
      sql += " AND n.id_dependencia = ?";
      params.push(dependencia);
    }
    if (emisor) {
      sql += " AND n.id_emisor = ?";
      params.push(emisor);
    }
    if (documento) {
      sql += " AND n.id_tipo_normativa = ?";
      params.push(documento);
    }
    if (anio) {
      sql += " AND n.anio = ?";
      params.push(anio);
    }

    if (tags) {
      sql +=
        " AND EXISTS (" +
        "   SELECT 1 FROM tag_normativa tn2 " +
        "   JOIN tag t ON t.id = tn2.id_tag " +
        "   WHERE tn2.id_normativa = n.id AND t.nombre = ?" +
        " )";
      params.push(tags);
    }

    // Una fila por normativa
    sql += " GROUP BY n.id";

    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }

    const results = await db.query(sql, params);
    const totalResults = results?.length > 0 ? results[0].total : 0;

    console.log(params, sql);

    if (!results) {
      return { data: [], totalResults };
    }
    return { data: results, totalResults };
  } catch (err) {
    console.error("Error al buscar normativa por parámetros: ", err);
    throw err;
  }
}



//Busqueda avanzada de normativas eliminadas!
async function searchNormativaEliminadaByParameters(
  numero,
  dependencia,
  emisor,
  documento,
  anio,
  limite = null,
  offset = null,
  tags
) {
  try {
    let sql =
      "SELECT " +
      "  n.id, n.resumen, n.archivo, n.anio, n.titulo, n.visitas, " +
      "  e.nombre AS emisor, n.numero, " +
      "  DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, " +
      "  tn.nombre AS tipo_normativa, d.nombre AS dependencia, " +
      "  COUNT(*) OVER() AS total " +
      "FROM normativa n " +
      "JOIN emisor e ON n.id_emisor = e.id " +
      "JOIN dependencia d ON d.id = n.id_dependencia " +
      "JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa " +
      "WHERE n.estado = 'eliminada'";

    let params = [];

    if (numero) {
      sql += " AND n.numero = ?";
      params.push(numero);
    }
    if (dependencia) {
      sql += " AND n.id_dependencia = ?";
      params.push(dependencia);
    }
    if (emisor) {
      sql += " AND n.id_emisor = ?";
      params.push(emisor);
    }
    if (documento) {
      sql += " AND n.id_tipo_normativa = ?";
      params.push(documento);
    }
    if (anio) {
      sql += " AND n.anio = ?";
      params.push(anio);
    }
    if (tags) {
      sql +=
        " AND EXISTS (" +
        "   SELECT 1 FROM tag_normativa tn2 " +
        "   JOIN tag t ON t.id = tn2.id_tag " +
        "   WHERE tn2.id_normativa = n.id AND t.nombre = ?" +
        " )";
      params.push(tags);
    }
    sql += " GROUP BY n.id";

    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }

    const results = await db.query(sql, params);
    const totalResults = results?.length > 0 ? results[0].total : 0;

    if (!results) {
      return { results, totalResults };
    }
    return { data: results, totalResults };
  } catch (err) {
    console.error("Error al buscar normativa eliminada por parámetros: ", err);
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
    "SELECT n.titulo, n.resumen, n.id, e.nombre AS emisor, n.numero, DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia, COUNT(*) AS total_busqueda FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa GROUP BY n.id, n.titulo, e.nombre, n.numero, n.fecha_normativa, tn.nombre, n.visitas ORDER BY n.visitas DESC LIMIT 10";
  const results = await db.query(sql, []);
  return results;
}

//Modificacion de normativas
async function updateNormativa(id, dataToSend) {
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
    archivo,
  } = dataToSend;

  console.log("normativaData", dataToSend);
  console.log("tags", tags);
  console.log("id", id);

  try {
    // Validar que tags sea un array
    if (!Array.isArray(tags)) {
      throw new TypeError("El campo 'tags' debe ser un array");
    }

    //Sacar archivo si no viene desde el front
    let archivoFinal = archivo;
    if (!archivo || archivo.trim() === "") {
      const results = await db.query(
        "SELECT archivo FROM normativa WHERE id = ?",
        [id]
      );
      if (!results || results.length === 0) {
        throw new Error(
          "No se encontró la normativa para conservar el archivo."
        );
      }
      archivoFinal = results[0].archivo;
    }

    // Actualizar los datos de la normativa
    const sqlUpdateNormativa = `
      UPDATE normativa
      SET numero = ?, anio = ?, titulo = ?, resumen = ?, fecha_normativa = ?, 
          id_dependencia = ?, id_emisor = ?, id_tipo_normativa = ?, estado = ?, archivo = ?
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
      archivoFinal,
      id,
    ]);
    //Eliminar los registros existentes en la tabla tag_normativa para el id de esa normativa.
    await db.query("DELETE FROM tag_normativa WHERE id_normativa = ?", [id]);
    //Insertar los nuevos tags
    await tagService.insertTagsForNormativa(id, tags);
    return { message: "Normativa actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar la normativa:", error);
    throw error;
  }
}


//Traer normativas despublicadas
async function searchNormativaDespublicadasByParameters(
  numero,
  dependencia,
  emisor,
  documento,
  anio,
  limite = null,
  offset = null,
  tags
) {
  try {
    let sql =
      "SELECT " +
      "  n.id, n.resumen, n.archivo, n.anio, n.titulo, n.visitas, " +
      "  e.nombre AS emisor, n.numero, " +
      "  DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, " +
      "  tn.nombre AS tipo_normativa, d.nombre AS dependencia, " +
      "  COUNT(*) OVER() AS total " +
      "FROM normativa n " +
      "JOIN emisor e ON n.id_emisor = e.id " +
      "JOIN dependencia d ON d.id = n.id_dependencia " +
      "JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa " +
      "WHERE n.estado = 'despublicado'";

    const params = [];

    if (numero) {
      sql += " AND n.numero = ?";
      params.push(numero);
    }
    if (dependencia) {
      sql += " AND n.id_dependencia = ?";
      params.push(dependencia);
    }
    if (emisor) {
      sql += " AND n.id_emisor = ?";
      params.push(emisor);
    }
    if (documento) {
      sql += " AND n.id_tipo_normativa = ?";
      params.push(documento);
    }
    if (anio) {
      sql += " AND n.anio = ?";
      params.push(anio);
    }

    // 👇 Filtrado por tag SIN joinear en el FROM
    if (tags) {
      sql +=
        " AND EXISTS (" +
        "   SELECT 1 FROM tag_normativa tn2 " +
        "   JOIN tag t ON t.id = tn2.id_tag " +
        "   WHERE tn2.id_normativa = n.id AND t.nombre = ?" +
        " )";
      params.push(tags);
    }

    // Una fila por normativa
    sql += " GROUP BY n.id";

    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }

    const results = await db.query(sql, params);
    const totalResults = results?.length > 0 ? results[0].total : 0;

    if (!results) {
      return { data: [], totalResults };
    }
    return { data: results, totalResults };
  } catch (err) {
    console.error("Error al buscar normativa despublicada por parámetros: ", err);
    throw err;
  }
}

// Restaurar normativa eliminada 
async function restaurar(id, userId) {
  try {
    const rows = await db.query(
      "SELECT estado FROM normativa WHERE id = ?",
      [id]
    );
    if (!rows || rows.length === 0) {
      return { success: false, message: "Normativa no encontrada" };
    }

    const estadoAnterior = rows[0].estado;
    if (estadoAnterior !== "eliminada") {
      return {
        success: false,
        message: "Solo se pueden restaurar normativas eliminadas",
      };
    }

    const result = await db.query(
      "UPDATE normativa SET estado = 'despublicado' WHERE id = ?",
      [id]
    );

    if (!result || result.affectedRows === 0) {
      return { success: false, message: "No se pudo restaurar la normativa" };
    }

    if (userId) {
      await auditoriaService.crearRegistroAuditoria({
        id_normativa: id,
        id_usuario: userId,
        tipo: "restauracion",
      });
    }

    return { success: true, message: "Normativa restaurada a 'despublicada'" };
  } catch (error) {
    console.error("Error al restaurar la normativa:", error);
    throw error;
  }
}

// Publicar nuevamente una normativa 
async function publicar(id, userId) {
  try {
    const rows = await db.query(
      "SELECT estado FROM normativa WHERE id = ?",
      [id]
    );
    if (!rows || rows.length === 0) {
      return { success: false, message: "Normativa no encontrada" };
    }

    const estadoAnterior = rows[0].estado;
    if (estadoAnterior !== "despublicado") {
      return {
        success: false,
        message: "Solo se pueden publicar normativas despublicadas",
      };
    }

    const result = await db.query(
      "UPDATE normativa SET estado = 'publicado' WHERE id = ?",
      [id]
    );

    if (!result || result.affectedRows === 0) {
      return { success: false, message: "No se pudo publicar la normativa" };
    }

    // Auditoría
    if (userId) {
      await auditoriaService.crearRegistroAuditoria({
        id_normativa: id,
        id_usuario: userId,
        tipo: "re-publicacion"  
      });
    }

    return { success: true, message: "Normativa publicada correctamente" };
  } catch (error) {
    console.error("Error al publicar la normativa:", error);
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
  eliminar,
  updateNormativa,
  create,
  edit,
  searchNormativaDespublicadasByParameters,
  deleteModificacion,
  updateModificacion,
  registrarModificacion,
  editNormativaModificada,
  eliminarRelacionesDeNormativa,getNormativaCompletaById, searchNormativaEliminadaByParameters,
  restaurar, publicar
};

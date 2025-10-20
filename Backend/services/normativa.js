// services/normativaService.js
import db from "./db.js";
import tagService from "./tag.js";
import auditoriaService from "./auditoria.js";

/** Pequeño helper para crear errores HTTP sin clase custom */
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// GET: Normativa completa por ID
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
    const normativa = await db.queryOne(normativaSql, [id]);
    if (!normativa)
      throw httpError(404, `No se encontró la normativa con ID ${id}`);

    const tagsSql = `
      SELECT t.nombre
      FROM tag t
      JOIN tag_normativa tn ON t.id = tn.id_tag
      WHERE tn.id_normativa = ?
    `;
    const tagRows = await db.query(tagsSql, [id]);
    const tags = tagRows.map((r) => r.nombre);

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

    return { ...normativa, tags, normativas_modificadas };
  } catch (error) {
    console.error("Error en getNormativaCompletaById:", error);
    throw error;
  }
}

/* =========================================================
 * UPDATE: Relación (modificación puntual)
 * - 404 si no existe
 * =======================================================*/
async function updateModificacion({ id_relacion, accion, comentario }) {
  try {
    const result = await db.execute(
      "UPDATE relacion SET id_acciones = ?, comentario = ? WHERE id = ?",
      [accion, comentario, id_relacion]
    );
    if (result.affectedRows === 0)
      throw httpError(404, `No se encontró la relación con ID ${id_relacion}`);
    return { message: `Relación ${id_relacion} actualizada` };
  } catch (error) {
    console.error("Error en updateModificacion:", error);
    throw error;
  }
}

/* =========================================================
 * DELETE: Todas las relaciones de una normativa
 * (id normativa_complementaria)
 * =======================================================*/
async function eliminarRelacionesDeNormativa(normativaId) {
  try {
    const exists = await db.queryOne(
      "SELECT id FROM relacion WHERE normativa_complementaria = ? LIMIT 1",
      [normativaId]
    );
    if (!exists)
      return { deleted: 0, message: "No hay relaciones para eliminar" };

    const delRes = await db.execute(
      "DELETE FROM relacion WHERE normativa_complementaria = ?",
      [normativaId]
    );
    return {
      deleted: delRes.affectedRows,
      message: `Eliminadas ${delRes.affectedRows} relaciones`,
    };
  } catch (error) {
    console.error("Error al eliminar relaciones:", error);
    throw error;
  }
}

/* =========================================================
 * Procesa array de normativas_modificadas (alta/baja/edición)
 * Lanza si faltan datos esenciales
 * =======================================================*/
async function editNormativaModificada(
  normativas_modificadas,
  normativaId,
  fechaSubida
) {
  for (const mod of normativas_modificadas) {
    const { id, id_relacion, accion, comentario, estado } = mod;
    if (!estado)
      throw httpError(
        400,
        "El campo 'estado' es obligatorio en cada modificación"
      );

    switch (estado) {
      case "eliminar":
        if (!id_relacion)
          throw httpError(400, "Falta 'id_relacion' para eliminar");
        await deleteModificacion(id_relacion);
        break;

      case "nueva":
        if (!id || !accion)
          throw httpError(400, "Faltan 'id' o 'accion' para crear relación");
        await registrarModificacion({
          id,
          accion,
          comentario,
          fechaSubida,
          normativaId,
        });
        break;

      case "modificar":
        if (!id_relacion || !accion)
          throw httpError(
            400,
            "Faltan 'id_relacion' o 'accion' para modificar relación"
          );
        await updateModificacion({ id_relacion, accion, comentario });
        break;

      default:
        throw httpError(400, `Estado de relación desconocido: ${estado}`);
    }
  }
}

/* =========================================================
 * UPDATE: Editar normativa (datos + tags + relaciones)
 * - 404 si normativa no existe/ no se actualiza
 * - Usa execute para DML
 * =======================================================*/
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
    userId,
  } = data;

  const id_interdependencia = 0;

  try {
    const sqlUpdate = `
      UPDATE normativa
      SET numero = ?, anio = ?, titulo = ?, resumen = ?, fecha_normativa = ?,
          id_dependencia = ?, id_emisor = ?, id_tipo_normativa = ?, estado = ?,
          archivo = ?, id_interdependencia = ?
      WHERE id = ?
    `;
    const upd = await db.execute(sqlUpdate, [
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
    if (upd.affectedRows === 0)
      throw httpError(404, `No se encontró la normativa con ID ${id}`);

    // Tags
    await tagService.insertTagsForNormativa(id, tags);

    // Relaciones
    const fechaSubida = new Date().toISOString().split("T")[0];
    if (cambia_normativa === "SI") {
      if (
        Array.isArray(normativas_modificadas) &&
        normativas_modificadas.length > 0
      ) {
        await editNormativaModificada(normativas_modificadas, id, fechaSubida);
      } else {
        // No es error, solo warning: se indicó SI pero no enviaron relaciones
        console.warn(
          "Se indicó 'SI' en cambia_normativa pero no llegaron relaciones."
        );
      }
    } else if (cambia_normativa === "NO") {
      await eliminarRelacionesDeNormativa(id);
    }

    // Auditoría
    if (userId) {
      await auditoriaService.crearRegistroAuditoria({
        id_normativa: id,
        id_usuario: userId,
        tipo: "modificacion",
      });
    }

    return { message: `Normativa ${id} editada correctamente` };
  } catch (error) {
    console.error("Error al editar la normativa:", error);
    throw error;
  }
}

/* =========================================================
 * DELETE: Relación por ID
 * - 404 si no existe
 * =======================================================*/
async function deleteModificacion(id) {
  try {
    const res = await db.execute("DELETE FROM relacion WHERE id = ?", [id]);
    if (res.affectedRows === 0)
      throw httpError(404, `No se encontró la relación con ID ${id}`);
    return { message: `Relación ${id} eliminada` };
  } catch (error) {
    console.error("Error al eliminar la relación:", error);
    throw error;
  }
}

/* =========================================================
 * INSERT: Registrar modificación
 * - 400 si no inserta
 * =======================================================*/
async function registrarModificacion({
  id,
  accion,
  comentario,
  fechaSubida,
  normativaId,
}) {
  try {
    const ins = await db.execute(
      `INSERT INTO relacion (normativa_original, normativa_complementaria, comentario, fecha, id_acciones)
       VALUES (?, ?, ?, ?, ?)`,
      [id, normativaId, comentario, fechaSubida, accion]
    );
    if (ins.affectedRows === 0)
      throw httpError(400, "No se pudo registrar la modificación");
    return {
      insertId: ins.insertId,
      message: `Modificación registrada (${ins.insertId})`,
    };
  } catch (error) {
    console.error("Error en registrarModificacion:", error);
    throw error;
  }
}

/* =========================================================
 * INSERT: Crear normativa (+ tags + relaciones opcionales)
 * - Lanza en errores; respuesta incluye id
 * =======================================================*/
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
    user,
  } = data;

  try {
    const fechaSubida = new Date().toISOString().split("T")[0];
    const ins = await db.execute(
      `INSERT INTO normativa (
        numero, anio, titulo, resumen, fecha_normativa,
        id_dependencia, id_emisor, id_tipo_normativa, estado, archivo,
        fecha_alta, id_creador
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        user.id,
      ]
    );
    if (ins.affectedRows === 0)
      throw httpError(400, "No se pudo crear la normativa");

    const normativaId = ins.insertId;

    // Relaciones (opcionales)
    if (
      Array.isArray(normativas_modificadas) &&
      normativas_modificadas.length > 0
    ) {
      for (const mod of normativas_modificadas) {
        const { id, accion, comentario } = mod;
        if (id && accion) {
          await registrarModificacion({
            id,
            accion,
            comentario,
            fechaSubida,
            normativaId,
          });
        }
      }
    }

    // Tags
    await tagService.insertTagsForNormativa(normativaId, tags);

    // Auditoría
    if (user?.id) {
      await auditoriaService.crearRegistroAuditoria({
        id_normativa: normativaId,
        id_usuario: user.id,
        tipo: "alta",
      });
    }

    return { id: normativaId, message: "Normativa creada correctamente" };
  } catch (error) {
    console.error("Error al crear la normativa:", error);
    throw error;
  }
}

/* =========================================================
 * SOFT-DELETE: marcar como 'eliminada'
 * - 404 si no existe
 * =======================================================*/
async function eliminar(id, userId, motivo = null) {
  try {
    const row = await db.queryOne("SELECT estado FROM normativa WHERE id = ?", [
      id,
    ]);
    if (!row) throw httpError(404, `Normativa ${id} no encontrada`);

    if (row.estado === "eliminada") {
      return { message: "La normativa ya estaba eliminada" };
    }

    const upd = await db.execute(
      "UPDATE normativa SET estado = 'eliminada' WHERE id = ?",
      [id]
    );
    if (upd.affectedRows === 0)
      throw httpError(400, "No se pudo actualizar la normativa");

    if (userId) {
      await auditoriaService.crearRegistroAuditoria({
        id_normativa: id,
        id_usuario: userId,
        tipo: "baja",
      });
    }

    return { message: "Normativa marcada como eliminada" };
  } catch (error) {
    console.error("Error al eliminar la normativa:", error);
    throw error;
  }
}

/* =========================================================
 * GET simples
 * =======================================================*/
async function getAllYears() {
  return db.query("SELECT DISTINCT anio FROM normativa");
}

async function getEliminatedNormatives() {
  const sql = `
    SELECT n.titulo, e.nombre AS emisor, n.numero,
           DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha,
           tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia
    FROM normativa n
    JOIN emisor e ON n.id_emisor = e.id
    JOIN dependencia d ON d.id = n.id_dependencia
    JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
    WHERE n.estado = 'eliminada'
  `;
  return db.query(sql);
}

async function getAllNormativas() {
  const sql = `
    SELECT n.titulo, e.nombre AS emisor, n.numero,
           DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha,
           tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia,
           COUNT(*) AS total_busqueda
    FROM normativa n
    JOIN emisor e ON n.id_emisor = e.id
    JOIN dependencia d ON d.id = n.id_dependencia
    JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
    GROUP BY n.id, n.titulo, e.nombre, n.numero, n.fecha_normativa, tn.nombre, n.visitas
    ORDER BY n.visitas DESC
    LIMIT 10
  `;
  return db.query(sql);
}

async function searchByNumber(number) {
  try {
    const row = await db.queryOne("SELECT * FROM normativa WHERE numero = ?", [
      number,
    ]);
    return row || null; // búsqueda: no lanzar 404
  } catch (err) {
    console.error("Error al buscar normativa por número: ", err);
    throw err;
  }
}

async function searchById(id) {
  try {
    const sql = `
      SELECT n.titulo,
             CONCAT(n.numero, '/', n.anio) AS numero,
             n.archivo, n.resumen,
             DATE_FORMAT(n.fecha_normativa, '%d-%m-%Y') AS fecha,
             e.nombre AS emisor,
             d.nombre AS dependencia,
             tn.nombre AS tipo_normativa
      FROM normativa n
      JOIN emisor e ON n.id_emisor = e.id
      JOIN dependencia d ON d.id = n.id_dependencia
      JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
      WHERE n.id = ?
    `;
    const row = await db.queryOne(sql, [id]);
    if (!row) throw httpError(404, `No se encontró la normativa con ID ${id}`);
    return row;
  } catch (err) {
    console.error("Error al buscar normativa por índice: ", err);
    throw err;
  }
}

/* =========================================================
 * Búsquedas avanzadas (devuelven data vacía, no lanzan)
 * =======================================================*/

//agregamos los nuevos parametros fechaOrder y visitasOrder
async function searchNormativaByParameters(
  numero,
  dependencia,
  emisor,
  documento,
  anio,
  limite = null,
  offset = null,
  tags,
  fechaOrder,
  visitasOrder
) {
  try {
    let sql = `
      SELECT
        n.id, n.resumen, n.archivo, n.anio, n.titulo, n.visitas,
        e.nombre AS emisor, n.numero,
        DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha,
        tn.nombre AS tipo_normativa, d.nombre AS dependencia,
        COUNT(*) OVER() as total
      FROM normativa n
      JOIN emisor e ON n.id_emisor = e.id
      JOIN dependencia d ON d.id = n.id_dependencia
      JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
      WHERE 1=1 AND n.estado = 'publicado'
    `;
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
    if (tags) {
      sql += `
        AND EXISTS (
          SELECT 1 FROM tag_normativa tn2
          JOIN tag t ON t.id = tn2.id_tag
          WHERE tn2.id_normativa = n.id AND t.nombre = ?
        )
      `;
      params.push(tags);
    }
    sql += " GROUP BY n.id";
    //agregamos el order by segun los nuevos parametros
    const clauses = [];
    const normDir = (d) => (String(d).toUpperCase() === "ASC" ? "ASC" : "DESC");
    if(fechaOrder){
      clauses.push(`n.fecha_normativa ${normDir(fechaOrder)}`);
    }
    if(visitasOrder){
      clauses.push(`n.visitas ${normDir(visitasOrder)}`);
    }

   if (clauses.length === 0) {
     // Default: más nuevos primero (y estable por id)
     sql += " ORDER BY n.fecha_normativa DESC, n.id DESC";
   } else {
     // Tie-breakers para resultados deterministas
     // - Si solo ordenás por visitas, añadimos fecha DESC como 2° criterio
     // - Si ya hay fecha y visitas, queda tal cual
     if (!fechaOrder && visitasOrder) {
       clauses.push("n.fecha_normativa DESC");
     }
     // Siempre cerramos con id DESC para estabilidad visual
     clauses.push("n.id DESC");
     sql += " ORDER BY " + clauses.join(", ");
   }

    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }

    const rows = await db.query(sql, params);
    const totalResults = rows?.length > 0 ? rows[0].total : 0;
    return { data: rows || [], totalResults };
  } catch (err) {
    console.error("Error al buscar normativa por parámetros: ", err);
    throw err;
  }
}

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
    let sql = `
      SELECT
        n.id, n.resumen, n.archivo, n.anio, n.titulo, n.visitas,
        e.nombre AS emisor, n.numero,
        DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha,
        tn.nombre AS tipo_normativa, d.nombre AS dependencia,
        COUNT(*) OVER() AS total
      FROM normativa n
      JOIN emisor e ON n.id_emisor = e.id
      JOIN dependencia d ON d.id = n.id_dependencia
      JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
      WHERE n.estado = 'eliminada'
    `;
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
    if (tags) {
      sql += `
        AND EXISTS (
          SELECT 1 FROM tag_normativa tn2
          JOIN tag t ON t.id = tn2.id_tag
          WHERE tn2.id_normativa = n.id AND t.nombre = ?
        )
      `;
      params.push(tags);
    }

    sql += " GROUP BY n.id";
    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }

    const rows = await db.query(sql, params);
    const totalResults = rows?.length > 0 ? rows[0].total : 0;
    return { data: rows || [], totalResults };
  } catch (err) {
    console.error("Error al buscar normativa eliminada por parámetros: ", err);
    throw err;
  }
}

// Búsqueda por tags (devuelve array, sin lanzar si vacío)
async function searchNormativasByTags(dependencia, tags) {
  try {
    const placeholders = tags.map(() => "?").join(",");
    const sql = `
      SELECT n.id, n.titulo, n.numero, n.id_dependencia,
             n.id_tipo_normativa, n.resumen, n.anio, n.estado,
             GROUP_CONCAT(t.nombre SEPARATOR ',') AS tags
      FROM normativa n
      JOIN tag_normativa tn ON n.id = tn.id_normativa
      JOIN tag t ON tn.id_tag = t.id
      WHERE n.id_dependencia = ? AND LOWER(t.nombre) IN (${placeholders})
      GROUP BY n.id
    `;
    return await db.query(sql, [dependencia, ...tags]);
  } catch (error) {
    console.log("Error en la consulta de normativas:", error);
    throw error;
  }
}

async function getMostPopularNormatives() {
  const sql = `
    SELECT n.titulo, n.resumen, n.id, e.nombre AS emisor, n.numero,
           DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha,
           tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia,
           COUNT(*) AS total_busqueda
    FROM normativa n
    JOIN emisor e ON n.id_emisor = e.id
    JOIN dependencia d ON d.id = n.id_dependencia
    JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
    GROUP BY n.id, n.titulo, e.nombre, n.numero, n.fecha_normativa, tn.nombre, n.visitas
    ORDER BY n.visitas DESC
    LIMIT 10
  `;
  return db.query(sql);
}

// UPDATE: Actualizar normativa (datos + tags)
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

  try {
    if (!Array.isArray(tags))
      throw httpError(400, "El campo 'tags' debe ser un array");

    // Si no viene archivo, conservar el existente
    let archivoFinal = archivo;
    if (!archivo || String(archivo).trim() === "") {
      const row = await db.queryOne(
        "SELECT archivo FROM normativa WHERE id = ?",
        [id]
      );
      if (!row)
        throw httpError(
          404,
          "No se encontró la normativa para conservar el archivo"
        );
      archivoFinal = row.archivo;
    }

    const upd = await db.execute(
      `UPDATE normativa
         SET numero=?, anio=?, titulo=?, resumen=?, fecha_normativa=?,
             id_dependencia=?, id_emisor=?, id_tipo_normativa=?, estado=?, archivo=?
       WHERE id=?`,
      [
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
      ]
    );
    if (upd.affectedRows === 0)
      throw httpError(404, `No se encontró la normativa con ID ${id}`);

    await db.execute("DELETE FROM tag_normativa WHERE id_normativa = ?", [id]);
    await tagService.insertTagsForNormativa(id, tags);

    return { message: "Normativa actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar la normativa:", error);
    throw error;
  }
}

// Restaurar (eliminada → despublicado) y Publicar (despublicado → publicado)
async function restaurar(id, userId) {
  try {
    const row = await db.queryOne("SELECT estado FROM normativa WHERE id = ?", [
      id,
    ]);
    if (!row) throw httpError(404, `Normativa ${id} no encontrada`);
    if (row.estado !== "eliminada")
      throw httpError(400, "Solo se pueden restaurar normativas eliminadas");

    const upd = await db.execute(
      "UPDATE normativa SET estado='despublicado' WHERE id = ?",
      [id]
    );
    if (upd.affectedRows === 0)
      throw httpError(400, "No se pudo restaurar la normativa");

    if (userId) {
      await auditoriaService.crearRegistroAuditoria({
        id_normativa: id,
        id_usuario: userId,
        tipo: "restauracion",
      });
    }
    return { message: "Normativa restaurada a 'despublicada'" };
  } catch (error) {
    console.error("Error al restaurar la normativa:", error);
    throw error;
  }
}

async function publicar(id, userId) {
  try {
    const row = await db.queryOne("SELECT estado FROM normativa WHERE id = ?", [
      id,
    ]);
    if (!row) throw httpError(404, `Normativa ${id} no encontrada`);
    if (row.estado !== "despublicado")
      throw httpError(400, "Solo se pueden publicar normativas despublicadas");

    const upd = await db.execute(
      "UPDATE normativa SET estado='publicado' WHERE id = ?",
      [id]
    );
    if (upd.affectedRows === 0)
      throw httpError(400, "No se pudo publicar la normativa");

    if (userId) {
      await auditoriaService.crearRegistroAuditoria({
        id_normativa: id,
        id_usuario: userId,
        tipo: "re-publicacion",
      });
    }
    return { message: "Normativa publicada correctamente" };
  } catch (error) {
    console.error("Error al publicar la normativa:", error);
    throw error;
  }
}

/* =========================================================
 * Busqueda avanzada de normativas DESPUBLICADAS
 * =======================================================*/
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
    let sql = `
      SELECT
        n.id, n.resumen, n.archivo, n.anio, n.titulo, n.visitas,
        e.nombre AS emisor, n.numero,
        DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha,
        tn.nombre AS tipo_normativa, d.nombre AS dependencia,
        COUNT(*) OVER() AS total
      FROM normativa n
      JOIN emisor e ON n.id_emisor = e.id
      JOIN dependencia d ON d.id = n.id_dependencia
      JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
      WHERE n.estado = 'despublicado'
    `;
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

    if (tags) {
      sql += `
        AND EXISTS (
          SELECT 1 FROM tag_normativa tn2
          JOIN tag t ON t.id = tn2.id_tag
          WHERE tn2.id_normativa = n.id AND t.nombre = ?
        )
      `;
      params.push(tags);
    }

    sql += " GROUP BY n.id";

    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }

    const rows = await db.query(sql, params);
    const totalResults = rows?.length > 0 ? rows[0].total : 0;

    return { data: rows || [], totalResults };
  } catch (err) {
    console.error(
      "Error al buscar normativa despublicada por parámetros:",
      err
    );
    throw err;
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

  searchNormativaDespublicadasByParameters:
    searchNormativaDespublicadasByParameters,
  deleteModificacion,
  updateModificacion,
  registrarModificacion,
  editNormativaModificada,
  eliminarRelacionesDeNormativa,
  getNormativaCompletaById,
  searchNormativaEliminadaByParameters,

  restaurar,
  publicar,
};

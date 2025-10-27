import db from "./db.js";


async function getSesionesPaginado(page = 1, limite = 10) {
  const offset = (page - 1) * limite;
  const sql = `
    SELECT 
      s.*, 
      DATE_FORMAT(s.fecha_sesion, '%Y-%m-%d') AS fecha_sesion
    FROM sesiones s
    ORDER BY s.fecha_sesion DESC
    LIMIT ? OFFSET ?;
  `;
  const sesiones = await db.query(sql, [limite, offset]);
  const totalRowsResult = await db.query(
    "SELECT COUNT(*) as total FROM sesiones"
  );
  const totalRows = totalRowsResult[0].total;
  return { data: sesiones, totalResults: totalRows };
}


async function getAllDependencias() {
  const sql = "SELECT * FROM dependencia";
  const results = await db.query(sql);
  return results;
}


async function getDepenendenciaById(id) {
  const sql = "SELECT * FROM dependencia WHERE id = ?";
  const results = await db.queryOne(sql, [id]);
  return results;
}


async function getDependencias() {
  const sql = "SELECT id, nombre FROM dependencia where estado = 'publicado'";
  const results = await db.query(sql);
  return results;
}


async function create(data) {
  const { nombre, estado, codificacion, nombre_completo } = data;
  const color = "#00000";

  try {
    const sqlInsert = `INSERT INTO dependencia (nombre, estado, color, codificacion, nombre_completo) VALUES (?, ?, ?, ?, ?)`;
    const result = await db.execute(sqlInsert, [
      nombre,
      estado,
      color,
      codificacion,
      nombre_completo,
    ]);
    const dependenciaId = result.insertId;

    return {
      success: true,
      mensaje: "Dependencia creada correctamente",
      id: dependenciaId,
    };
  } catch (error) {
    console.error("Error al crear la dependencia:", error);
    throw error;
  }
}

async function edit(data) {
  const { id, nombre, nombre_completo, estado, codificacion } = data;
  try {
 
    const existing = await db.queryOne(
      "SELECT id FROM dependencia WHERE nombre = ? AND id != ?",
      [nombre, id]
    );
    if (existing && existing.length > 0) {
  
      console.log({ mensaje: `Dependencia '${nombre}' ya existe` });
      return { success: false, message: `Dependencia '${nombre}' ya existe` };
    } else {
   
      const sqlUpdate =
        "UPDATE dependencia SET nombre = ?, nombre_completo = ?, estado = ?, codificacion = ? WHERE id = ?";
      const result = await db.execute(sqlUpdate, [
        nombre,
        nombre_completo,
        estado,
        codificacion,
        id,
      ]);
      if (result.affectedRows > 0) {
        console.log({
          mensaje: `Dependencia '${nombre}' actualizada correctamente`,
        });
        return {
          success: true,
          message: `Dependencia '${nombre}' actualizada correctamente`,
        };
      } else {
        console.log({ mensaje: `No se encontró la dependencia con ID ${id}` });
        return {
          success: false,
          message: `No se encontró la dependencia con ID ${id}`,
        };
      }
    }
  } catch (error) {
    console.error("Error al editar la dependencia:", error);
    throw error;
  }
}

async function eliminar(id) {
  const sql = "DELETE FROM dependencia WHERE id = ?";
  const results = await db.execute(sql, [id]);
  return results;
}

async function getAllNamesDependencias() {
  const sql = "SELECT nombre FROM dependencia";
  const results = await db.query(sql, []);
  return results;
}

async function searchDependenciaByParameters(
  nombre,
  estado,
  limite = null,
  offset = null
) {
  try {
    let sql =
      "SELECT d.id, d.nombre,d.nombre_completo,d.estado,d.codificacion, COUNT(*)OVER() AS total FROM dependencia d WHERE 1=1";
    const params = [];
    if (nombre) {
      sql += " AND d.nombre LIKE ?";
      params.push(`%${nombre}%`);
    }
    if (estado) {
      sql += " AND d.estado = ?";
      params.push(estado);
    }
    sql += " GROUP BY d.id";
    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }
    const results = await db.query(sql, params);
    const totalResults = results?.length > 0 ? results[0].total : 0;
    console.log(sql, params);
    if (!results) {
      console.log(
        "No se encontró las dependencias con los parámetros especificados"
      );
      return { data: [], totalResults };
    }
    return { data: results, totalResults };
  } catch (error) {
    console.error("Error al buscar dependencias por parámetros:", error);
  }
}

export default {
  getAllDependencias,
  getDepenendenciaById,
  create,
  eliminar,
  getAllNamesDependencias,
  searchDependenciaByParameters,
  edit,
  getSesionesPaginado,
  getDependencias
};

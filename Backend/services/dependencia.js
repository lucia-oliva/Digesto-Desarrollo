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
    "SELECT COUNT(*) AS total FROM sesiones",
  );
  const totalRows = totalRowsResult[0].total;

  return {
    data: sesiones,
    totalResults: totalRows,
  };
}

async function getAllDependencias() {
  const sql = "SELECT * FROM dependencia";
  return db.query(sql);
}

async function getDepenendenciaById(id) {
  const sql = "SELECT * FROM dependencia WHERE id = ?";
  return db.queryOne(sql, [id]);
}

async function getDependencias() {
  const sql = "SELECT id, nombre FROM dependencia WHERE estado = 'publicado'";
  return db.query(sql);
}

async function create(data) {
  const { nombre, estado } = data;
  const codificacion = data.codificacion ?? "";
  const nombre_completo = data.nombre_completo ?? "";
  const color = "#00000";

  const sqlInsert = `
    INSERT INTO dependencia (
      nombre,
      estado,
      color,
      codificacion,
      nombre_completo
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  const result = await db.execute(sqlInsert, [
    nombre,
    estado,
    color,
    codificacion,
    nombre_completo,
  ]);

  return {
    success: true,
    mensaje: "Dependencia creada correctamente",
    id: result.insertId,
  };
}

async function edit(data) {
  const { id, nombre, estado } = data;
  const nombre_completo = data.nombre_completo ?? "";
  const codificacion = data.codificacion ?? "";

  const existing = await db.queryOne(
    "SELECT id FROM dependencia WHERE nombre = ? AND id != ?",
    [nombre, id],
  );

  if (existing) {
    return {
      success: false,
      mensaje: `Dependencia '${nombre}' ya existe`,
    };
  }

  const sqlUpdate = `
    UPDATE dependencia
    SET nombre = ?,
        nombre_completo = ?,
        estado = ?,
        codificacion = ?
    WHERE id = ?
  `;

  const result = await db.execute(sqlUpdate, [
    nombre,
    nombre_completo,
    estado,
    codificacion,
    id,
  ]);

  if (result.affectedRows === 0) {
    return {
      success: false,
      mensaje: `No se encontró la dependencia con ID ${id}`,
    };
  }

  return {
    success: true,
    mensaje: `Dependencia '${nombre}' actualizada correctamente`,
  };
}

async function eliminar(id) {
  const sql = "DELETE FROM dependencia WHERE id = ?";
  return db.execute(sql, [id]);
}

async function getAllNamesDependencias() {
  const sql = "SELECT nombre FROM dependencia";
  return db.query(sql);
}

async function searchDependenciaByParameters(
  nombre,
  estado,
  limite = null,
  offset = null,
) {
  let sql = `
    SELECT
      d.id,
      d.nombre,
      d.nombre_completo,
      d.estado,
      d.codificacion,
      COUNT(*) OVER() AS total
    FROM dependencia d
    WHERE 1 = 1
  `;

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
  const totalResults = results?.[0]?.total ?? 0;

  return {
    data: results ?? [],
    totalResults,
  };
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
  getDependencias,
};
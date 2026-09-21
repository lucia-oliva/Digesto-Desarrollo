import db from "./db.js";

async function getById(id) {
  const result = await db.queryOne(
    "SELECT id, nombre, estado FROM emisor WHERE id = ?",
    [id]
  );

  return result || null;
}

async function getAllEmisoresName() {
  const sql = "SELECT nombre FROM emisor";
  const results = await db.query(sql, []);
  return results;
}

async function getEmisores() {
  const sql = "SELECT id, nombre FROM emisor where estado = 'publicado'";
  const results = await db.query(sql, []);
  return results;
}

async function edit(data) {
  const { id, nombre, estado } = data;

  const duplicado = await db.queryOne(
    "SELECT id FROM emisor WHERE nombre = ? AND id != ?",
    [nombre, id]
  );

  if (duplicado) {
    const error = new Error("Emisor duplicado");
    error.status = 409;
    error.publicMessage = "Ya existe un emisor con ese nombre.";
    throw error;
  }

  const sqlUpdate = "UPDATE emisor SET nombre = ?, estado = ? WHERE id = ?";
  const result = await db.execute(sqlUpdate, [nombre, estado, id]);

  if (result.affectedRows === 0) {
    const error = new Error("Emisor no encontrado");
    error.status = 404;
    error.publicMessage = "Emisor no encontrado.";
    throw error;
  }

  return {
    mensaje: "Emisor editado correctamente",
  };
}

async function create(data) {
  const { nombre, estado } = data;

  const sqlInsert = "INSERT INTO emisor (nombre, estado) VALUES (?, ?)";
  const result = await db.execute(sqlInsert, [nombre, estado]);

  return {
    success: true,
    mensaje: "Emisor creado correctamente",
    id: result.insertId,
  };
}

async function eliminar(id) {
  const sql = "DELETE FROM emisor WHERE id = ?";
  const results = await db.execute(sql, [id]);
  return results;
}

async function searchEmisorByParameters(
  nombre,
  estado,
  limite = null,
  offset = null
) {
  let sql =
    "SELECT e.id,e.nombre, e.estado, COUNT(*)OVER() AS total FROM emisor e WHERE 1=1";

  const params = [];

  if (nombre) {
    sql += " AND e.nombre LIKE ?";
    params.push(`%${nombre}%`);
  }

  if (estado) {
    sql += " AND e.estado = ?";
    params.push(estado);
  }

  sql += " GROUP BY e.id";

  if (limite !== null && offset !== null) {
    sql += " LIMIT ? OFFSET ?";
    params.push(Number(limite) || 10, Number(offset) || 0);
  }

  const results = await db.query(sql, params);
  const totalResults = results?.length > 0 ? results[0].total : 0;

  return { data: results, totalResults };
}

export default {
  getAllEmisoresName,
  searchEmisorByParameters,
  eliminar,
  create,
  edit,
  getById,
  getEmisores,
};
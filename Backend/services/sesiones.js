import db from "./db.js";

async function create(data) {
  const { fecha_sesion, orden_url, nombre_orden } = data;

  if (!fecha_sesion || !orden_url || !nombre_orden) {
    const error = new Error("Datos insuficientes");
    error.status = 400;
    error.publicMessage = "Faltan datos obligatorios.";
    throw error;
  }

  const fechaEditado = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const nombre_acta = "Acta " + fecha_sesion;

  const sql = `
    INSERT INTO sesiones (
      fecha_sesion,
      orden_url,
      nombre_orden,
      editado,
      acta_url,
      nombre_acta
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const result = await db.execute(sql, [
    fecha_sesion,
    orden_url,
    nombre_orden,
    fechaEditado,
    orden_url,
    nombre_acta,
  ]);

  return {
    id_sesion: result.insertId,
  };
}

async function eliminar(id) {
  const sql = "DELETE FROM sesiones WHERE id_sesion = ?";
  const results = await db.execute(sql, [id]);

  return results;
}

async function getSesionById(id) {
  const sql = `
    SELECT
      id_sesion,
      DATE_FORMAT(fecha_sesion, '%Y-%m-%d') AS fecha_sesion,
      nombre_orden,
      nombre_acta,
      orden_url,
      acta_url
    FROM sesiones
    WHERE id_sesion = ?
  `;

  const results = await db.queryOne(sql, [id]);

  if (!results) {
    const error = new Error("Sesión no encontrada");
    error.status = 404;
    error.publicMessage = "Sesión no encontrada.";
    throw error;
  }

  return results;
}

export default {
  eliminar,
  getSesionById,
  create,
};
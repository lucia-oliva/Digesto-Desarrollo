import db from "./db.js";

//crear una sesion

async function create(data) {
  const { fecha_sesion, orden_url, nombre_orden } = data;
  if (!fecha_sesion || !orden_url || !nombre_orden) {
    const err = new Error("Datos Insuficientes");
    err.status = 400;
    throw err;
  }

  const fechaEditado = new Date().toISOString().slice(0, 19).replace("T", " ");
  const nombre_acta = "Acta " + fecha_sesion;
  const sql = `
    INSERT INTO sesiones (fecha_sesion, orden_url, nombre_orden, editado, acta_url, nombre_acta)
    VALUES (?, ?, ?, ? , ? , ?)
  `;
  try {
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
  } catch (error) {
    console.error("Error al crear la sesión:", error);
    throw error;
  }
}

//eliminar una sesion por id

async function eliminar(id) {
  const sql = "DELETE FROM sesiones WHERE id_sesion = ?";
  const results = await db.execute(sql, [id]);
  return results;
}

//traer una sesion por id

async function getSesionById(id) {
  const sql =
    "SELECT  id_sesion, DATE_FORMAT(fecha_sesion, '%Y-%m-%d') AS fecha_sesion, nombre_orden, nombre_acta, orden_url, acta_url FROM sesiones WHERE id_sesion = ?";
  const results = await db.queryOne(sql, [id]);
  if (results.length === 0) {
    const err = new Error("Sesión no encontrada");
    err.status = 404;
    throw err;
  }
  return results[0];
}

export default { eliminar, getSesionById, create };

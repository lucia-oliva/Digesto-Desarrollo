import db from "./db.js";

async function getByNormativaOriginal(id) {
  try {
    const sql =
      `SELECT
        r.id,
        r.normativa_original,
        r.normativa_complementaria,
        r.id_acciones,
        n.titulo as comp_titulo,
        n.numero as comp_numero,
        n.anio as comp_anio,
        tn.nombre as comp_tipo
        FROM relacion r
        LEFT JOIN normativa n ON n.id = r.normativa_complementaria
        LEFT JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa WHERE r.normativa_original = ?
      `;
    const rows = await db.query(sql, [id]);
    return rows || [];
  } catch (e) {
    console.error("Error al obtener vínculos (original)", e);
    throw e;
  }
}

async function getByNormativaComplementaria(id) {
  try {
    const sql = `
      SELECT
        r.id,
        r.normativa_original,
        r.normativa_complementaria,
        r.id_acciones,
        n.titulo    AS orig_titulo,
        n.numero    AS orig_numero,
        n.anio      AS orig_anio,
        tn.nombre   AS orig_tipo
      FROM relacion r
      LEFT JOIN normativa n      ON n.id = r.normativa_original
      LEFT JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
      WHERE r.normativa_complementaria = ?
    `;
    const rows = await db.query(sql, [id]);
    return rows || [];
  } catch (e) {
    console.error("Error al obtener vínculos (complementaria):", e);
    throw e;
  }
}


export default {
  getByNormativaOriginal,
  getByNormativaComplementaria
};

import db from "./db.js";

async function getByNormativaOriginal(id) {
  const sql = `
    SELECT
      r.id,
      r.normativa_original,
      r.normativa_complementaria,
      r.id_acciones,
      n.titulo AS comp_titulo,
      n.numero AS comp_numero,
      n.anio AS comp_anio,
      n.estado AS comp_estado,
      tn.nombre AS comp_tipo
    FROM relacion r
    LEFT JOIN normativa n ON n.id = r.normativa_complementaria
    LEFT JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
    WHERE r.normativa_original = ?
  `;

  const rows = await db.query(sql, [id]);
  return rows || [];
}

async function getByNormativaComplementaria(id) {
  const sql = `
    SELECT
      r.id,
      r.normativa_original,
      r.normativa_complementaria,
      r.id_acciones,
      n.titulo AS orig_titulo,
      n.numero AS orig_numero,
      n.anio AS orig_anio,
      n.estado AS orig_estado,
      tn.nombre AS orig_tipo
    FROM relacion r
    LEFT JOIN normativa n ON n.id = r.normativa_original
    LEFT JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa
    WHERE r.normativa_complementaria = ?
  `;

  const rows = await db.query(sql, [id]);
  return rows || [];
}

export default {
  getByNormativaOriginal,
  getByNormativaComplementaria,
};
import db from "./db.js";

async function getDashboardCounts() {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM normativa) AS normativas,
      (SELECT COUNT(*) FROM usuario) AS usuarios,
      (SELECT COUNT(*) FROM dependencia) AS dependencias,
      (SELECT COUNT(*) FROM tag) AS palabras_clave,
      (SELECT COUNT(*) FROM emisor) AS emisores
  `;
  const [result] = await db.query(sql);
  return result;
}

export default { getDashboardCounts };

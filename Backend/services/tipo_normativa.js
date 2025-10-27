import db from "./db.js";

async function getAllTipoNormativa() {
  const sql = "SELECT nombre FROM tipo_normativa";
  const results = await db.query(sql, []);
  return results;
}

export default { getAllTipoNormativa };

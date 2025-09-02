import db from "./db.js";

//BASIC CRUD

//ENDPOINTS ESPECIFICOS
async function getAllTipoNormativa() {
  const sql = "SELECT nombre FROM tipo_normativa";
  const results = await db.query(sql, []);
  return results;
}

export default { getAllTipoNormativa };

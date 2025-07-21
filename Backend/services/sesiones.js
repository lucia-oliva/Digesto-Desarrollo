import db from "./db.js";
async function eliminar(id) {
    console.log(id);
    
  const sql = "DELETE FROM sesiones WHERE id_sesion = ?";
  const results = await db.query(sql, [id]);
  return results;
}

export default { eliminar };

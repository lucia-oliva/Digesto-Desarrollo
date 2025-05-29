import db from "./db.js";

//BASIC CRUD

//ENDPOINTS ESPECIFICOS
async function getAllEmisoresName() {
  const sql = "SELECT nombre FROM emisor";
  const results = await db.query(sql,[]);
  return results;
}

//Buscar dependencia por parametros
async function searchEmisorByParameters(
  nombre, 
  estado,
  limite = null,
  offset = null
){
  try{
    let sql = "SELECT e.id,e.nombre, e.estado, COUNT(*)OVER() AS total FROM emisor e WHERE 1=1";
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
    console.log(params,sql);
     if (!results) {
      console.log(
        "No se encontró los emisores con los parámetros especificados"
      );
      return { emisores: [], totalResults };
    }
    return { emisores: results, totalResults };
  }catch (error) {
    console.error("Error al buscar emisores por parámetros:", error);
  }
}



export default {getAllEmisoresName, searchEmisorByParameters};
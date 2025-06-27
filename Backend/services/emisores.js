import db from "./db.js";

//BASIC CRUD

//ENDPOINTS ESPECIFICOS
async function getAllEmisoresName() {
  const sql = "SELECT nombre FROM emisor";
  const results = await db.query(sql,[]);
  return results;
}

async function create(data){
  const{
    nombre
  } = data;

  const estado = "publicado"; // Estado por defecto al crear un emisor
try{
  const sqlInsert = `INSERT INTO emisor (nombre, estado) VALUES (?, ?)`;
  const result = await db.query(sqlInsert, [nombre, estado]);
  const emisorId = result.insertId;
  return { success: true, mensaje: "Emisor creado correctamente", id: emisorId };
} catch (error) {
  console.error("Error al crear el emisor:", error);
  throw error;
  }

}

async function eliminar(id){
  const sql = "DELETE FROM emisor WHERE id = ?";
  const results = await db.query(sql, [id]);
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
      return { data: [], totalResults };
    }
    return { data: results, totalResults };
  }catch (error) {
    console.error("Error al buscar emisores por parámetros:", error);
  }
}



export default {getAllEmisoresName, searchEmisorByParameters,eliminar, create};
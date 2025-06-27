import db from "./db.js";

// Funciones CRUD basicas

//Mostrar todos las dependencias
async function getAllDependencias() {
  const sql = "SELECT * FROM dependencia";
  const results = await db.query(sql);
  return results;
}

//Mostrar usuario por ID
async function getDepenendenciaById(id) {
  const sql = "SELECT * FROM dependencia WHERE id = ?";
  const results = await db.query(sql, [id]);
  return results[0];
}

/*TODO  : Comprobar los campos en la bd , hay campos sin un default o null por lo que hay que especificar todo
campos a cambiar = [ tipo de user , fecha de alta , ultima visita , estado ] 
*/
//FIXME -  funcion ideal para create , no funciona faltan los campos aclarados
//FIXME - Para todos estos valores funciona el create, hay que verificar que datos se consiguen de donde, es decir que esta incompleta esta funcion;

async function create(data) {
 const { nombre, Estado, codificacion, nombre_completo } = data;
 const color = "null";
 
try{
  const sqlInsert = `INSERT INTO dependencia (nombre, estado, color, codificacion, nombre_completo) VALUES (?, ?, ?, ?, ?)`;
  const result = await db.query(sqlInsert, [
    nombre,
    Estado,
    color,
    codificacion,
    nombre_completo
  ]);
  const dependenciaId = result.insertId;

  return { success: true, mensaje: "Dependencia creada correctamente", id: dependenciaId };
}catch (error) {
  console.error("Error al crear la dependencia:", error);
  throw error;
 }
}

//Modificar dependencia
async function updateDependencia(id, data) {
  const sql =
    "UPDATE dependencia SET nombre = ?, estado = ?, color = ? codificacion = ?, nombre_completo = ? WHERE id = ?";
  const results = await db.query(sql, [
    data.nombre,
    data.estado,
    data.color,
    data.codificacion,
    data.nombre_completo,
    id,,
  ]);
  return results;
}


async function eliminar(id) {
  const sql = "DELETE FROM dependencia WHERE id = ?";
  const results = await db.query(sql, [id]);
  return results;
}

// Funciones para endpoints especiales


//Mostrar todos las dependencias
async function getAllNamesDependencias() {
    const sql = "SELECT nombre FROM dependencia";
    const results = await db.query(sql,[]);
    return results;
  }


//Buscar dependencia por parametros 
async function searchDependenciaByParameters(
  nombre,
  estado, 
  limite = null,
  offset = null
){
  try{
    let sql = "SELECT d.id, d.nombre,d.nombre_completo,d.estado,d.codificacion, COUNT(*)OVER() AS total FROM dependencia d WHERE 1=1";
    const params = [];
    if (nombre) {
      sql += " AND d.nombre LIKE ?";
      params.push(`%${nombre}%`);
    }
    if (estado) {
      sql += " AND d.estado = ?";
      params.push(estado);
    }
    sql += " GROUP BY d.id";
    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }
    const results = await db.query(sql, params);
    const totalResults = results?.length > 0 ? results[0].total : 0;
    console.log(params,sql);
     if (!results) {
      console.log(
        "No se encontró las dependencias con los parámetros especificados"
      );
      return { data: [], totalResults };
    }
    return { data: results, totalResults };
  }catch (error) {
    console.error("Error al buscar dependencias por parámetros:", error);
  }
}



export default {getAllDependencias, getDepenendenciaById, create, eliminar, getAllNamesDependencias, searchDependenciaByParameters}
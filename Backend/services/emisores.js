import db from "./db.js";

//BASIC CRUD

async function getById(id) {
  try {
    const result = await db.queryOne(
      "SELECT id, nombre, estado FROM emisor WHERE id = ?",
      [id]
    );
    return result || null;
  } catch (e) {
    console.error("Error en obtener ID de emisor", e);
    throw e;
  }
}

//ENDPOINTS ESPECIFICOS
async function getAllEmisoresName() {
  const sql = "SELECT nombre FROM emisor";
  const results = await db.query(sql, []);
  return results;
}


//Emisores para mapeo

async function getEmisores(){
  const sql = "SELECT id, nombre FROM emisor where estado = 'publicado'";
  const results = await db.query(sql, []);
  return results;
}

async function edit(data) {
  console.log(data);

  const { id, nombre, estado } = data;

  // Verificar si ya existe otro emisor con el mismo nombre

  const duplicado = await db.queryOne(
    "SELECT id FROM emisor WHERE nombre = ? AND id != ?",
    [nombre, id]
  );

  if (duplicado) {
    // Ya existe, no actualizar
    console.log({ mensaje: `Emisor '${nombre}' ya existe` });
    throw new Error(`Emisor '${nombre}' ya existe`, 400);
  }

  // Actualizar el emisor
  const sqlUpdate = "UPDATE emisor SET nombre = ?, estado = ? WHERE id = ?";
  const result = await db.execute(sqlUpdate, [nombre, estado, id]);
  if (result.affectedRows === 0) {
    throw new Error(`No se encontró el emisor con ID ${id}`, 404);
  }
  return {
    mensaje: "Emisor editado correctamente",
  };
}

async function create(data) {
  const { nombre, estado } = data;
  try {
    const sqlInsert = `INSERT INTO emisor (nombre, estado) VALUES (?, ?)`;
    const result = await db.execute(sqlInsert, [nombre, estado]);
    const emisorId = result.insertId;
    return {
      success: true,
      mensaje: "Emisor creado correctamente",
      id: emisorId,
    };
  } catch (error) {
    console.error("Error al crear el emisor:", error);
    throw error;
  }
}

async function eliminar(id) {
  const sql = "DELETE FROM emisor WHERE id = ?";
  const results = await db.execute(sql, [id]);
  return results;
}

//Buscar dependencia por parametros
async function searchEmisorByParameters(
  nombre,
  estado,
  limite = null,
  offset = null
) {
  try {
    let sql =
      "SELECT e.id,e.nombre, e.estado, COUNT(*)OVER() AS total FROM emisor e WHERE 1=1";
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
    return { data: results, totalResults };
  } catch (error) {
    console.error("Error al buscar emisores por parámetros:", error);
    throw new Error(error);
  }
}

export default {
  getAllEmisoresName,
  searchEmisorByParameters,
  eliminar,
  create,
  edit,
  getById,
  getEmisores
};

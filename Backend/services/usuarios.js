import db from "./db.js";

// Funciones CRUD basicas

async function getAllUsuarios() {
  const sql = "SELECT nombre,email,telefono,id_dependencia  FROM usuario";
  const results = await db.query(sql);
  return results;
}

async function getUsuarioById(id) {
  const sql = "SELECT * FROM usuario WHERE id = ?";
  const [results] = await db.query(sql, [id]);
  return results[0];
}

/*TODO  : Comprobar los campos en la bd , hay campos sin un default o null por lo que hay que especificar todo
campos a cambiar = [ tipo de user , fecha de alta , ultima visita , estado ] 
*/
//FIXME -  funcion ideal para create , no funciona faltan los campos aclarados

async function createUsuario(user) {
  console.log(user);

  const sql =
    "INSERT INTO usuario (nombre , telefono , email , clave , id_dependencia) VALUES (?, ?, ?, ?, ?)";
  const [results] = await db.query(sql, [
    user.nombre,
    user.telefono,
    user.email,
    user.clave,
    user.id_dependencia,
  ]);
  return results;
}

async function updateUsuario(id, data) {
  const sql =
    "UPDATE usuario SET name = ?, email = ?, password = ? WHERE id = ?";
  const [results] = await db.query(sql, [
    data.name,
    data.email,
    data.password,
    id,
  ]);
  return results;
}

async function deleteUsuario(id) {
  const sql = "DELETE FROM usuario WHERE id = ?";
  const [results] = await db.query(sql, [id]);
  return results;
}

// Funciones para endpoints especiales

/* TODO - Agregar funciones para endpoints especiales , como filtrar por id_dependencia o algo similar
mirar las funciones relacionadas a usuarios en el PHP */

export default { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario };

import db from "./db.js";

// Funciones CRUD basicas

//Mostrar todos los usuarios
async function getAllUsuarios() {
  const sql = "SELECT nombre,email,telefono,id_dependencia  FROM usuario";
  const results = await db.query(sql);
  return results;
}

//Mostrar usuario por ID
async function getUsuarioById(id) {
  const sql = "SELECT * FROM usuario WHERE id = ?";
  const results = await db.query(sql, [id]);
  return results[0];
}

/*TODO  : Comprobar los campos en la bd , hay campos sin un default o null por lo que hay que especificar todo
campos a cambiar = [ tipo de user , fecha de alta , ultima visita , estado ] 
*/
//FIXME -  funcion ideal para create , no funciona faltan los campos aclarados
//FIXME - Para todos estos valores funciona el create, hay que verificar que datos se consiguen de donde, es decir que esta incompleta esta funcion;

async function createUsuario(user) {
  console.log(user);

  const sql =
    "INSERT INTO usuario (nombre , telefono , email , clave , id_tipo_usuario, id_dependencia, fecha_alta,ultima_visita) VALUES (?,?,?,?,?,?,?,?)";
  const results = await db.query(sql, [
    user.nombre,
    user.telefono,
    user.email,
    user.clave,
    user.id_tipo_usuario,
    user.id_dependencia,
    user.fecha_alta,
    user.ultima_visita,

  ]);
  return results;
}
//Modificar usuario
async function updateUsuario(id, data) {
  const sql =
    "UPDATE usuario SET nombre = ?, email = ?, clave = ? WHERE id = ?";
  const results = await db.query(sql, [
    data.nombre,
    data.email,
    data.clave,
    id,
  ]);
  return results;
}

//Eliminar usuario
async function deleteUsuario(id) {
  const sql = "DELETE FROM usuario WHERE id = ?";
  const results = await db.query(sql, [id]);
  return results;
}

// Funciones para endpoints especiales

/* TODO - Agregar funciones para endpoints especiales*/

//Filtrar usuarios por departamento
async function filterUsuariosporDepartament(id){
  const sql = "SELECT * FROM usuario WHERE id_dependencia LIKE ? "; 
  const results = await db.query(sql, [id]);
  return results;
} 

//TODO - No hago esta funcion porque la clave deberia estar hasheada;
//select * from usuario where email ? and clave ? 


//select * from usuario where email ? and estado='activo'
async function UsuarioByEmailAndEstado(email){
  const sql = "SELECT * FROM usuario WHERE email = ? AND estado = 'activo' "; 
  const results = await db.query(sql, [email]);
  return results;
}

export default { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, filterUsuariosporDepartament, UsuarioByEmailAndEstado};

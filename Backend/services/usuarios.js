import db from "./db.js";
import { hashPasswordBcrypt, verifyPassword } from "../utils/authPass.js";

// Funciones CRUD basicas

//Editar usuario. 
async function edit(data){
  const{id,id_tipo_usuario, nombre, telefono, email, clave, estado, id_dependencia} = data;
  //verificar si id_dependencia es undefined, si lo es, asignar 0 como valor por defecto
  const dependenciaFinal = id_dependencia ?? 0; // Si no se proporciona, usar

  const fechaSubida = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD 
  const claveHasheada= await hashPasswordBcrypt(clave); // Hashear la clave
  console.log("clave hasheada:", claveHasheada);
  try{
    //Actualizar el usuario 
    const sqlUpdate = "UPDATE usuario SET nombre = ?, id_tipo_usuario = ?, telefono = ?, email = ?, clave = ?, estado = ?, fecha_alta = ?, ultima_visita = ?, id_dependencia = ? WHERE id = ?";
    const result = await db.query(sqlUpdate, [nombre, id_tipo_usuario, telefono, email, claveHasheada, estado, fechaSubida, fechaSubida, dependenciaFinal, id]);
    
    if(result.affectedRows > 0) {
      console.log({ mensaje: `Usuario '${nombre}' actualizado correctamente` });
      return { success: true, message: `Usuario '${nombre}' actualizado correctamente` };
    } else {
      console.log({ mensaje: `No se encontró el usuario con ID ${id}` });
      return { success: false, message: `No se encontró el usuario con ID ${id}` };
    }
  }catch (error) {
    console.error("Error al editar el usuario:", error);
    throw error;
  }
}

//Mostrar usuario por ID
async function getUsuarioById(id) {
  const sql ="SELECT id, telefono, estado, email, nombre, id_tipo_usuario FROM usuario WHERE id = ?";
  const results = await db.query(sql, [id]);
  return results;
}

/*TODO  : Comprobar los campos en la bd , hay campos sin un default o null por lo que hay que especificar todo
campos a cambiar = [ tipo de user , fecha de alta , ultima visita , estado ] 
*/

//FIXME -  funcion ideal para create , no funciona faltan los campos aclarados
//FIXME - Para todos estos valores funciona el create, hay que verificar que datos se consiguen de donde, es decir que esta incompleta esta funcion;


async function create(data) {
  const { nombre, telefono, email, password, rol, id_dependencia} = data;
  const dependenciaFinal = id_dependencia ?? 0; // Si no se proporciona, usar 0 como valor por defecto

  try{
    const fechaSubida = new Date().toISOString().split("T")[0]; 
    const estado = "activo";
    const claveHasheada = await hashPasswordBcrypt(password);
    const sqlInsertUser = ` INSERT INTO usuario (nombre, telefono, email, clave, fecha_alta, id_dependencia, estado, id_tipo_usuario, ultima_visita) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)`;

    const result = await db.query(sqlInsertUser, [
      nombre, telefono, email, claveHasheada, fechaSubida, dependenciaFinal, estado,rol,fechaSubida]);
    const userId = result.insertId;

    return {succeso: true, mensaje: "Usuario creado correctamente", id: userId};

  }catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
}


//BUG  no estoy segura si la funcion de create es usada en otra parte del codigo, por las dudas replico la funcionalidad...y si no esta quedaria para borrar.
async function createUsuario(user) {
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
//async function updateUsuario(id, data) {
  //const sql =
    //"UPDATE usuario SET nombre = ?, email = ?, clave = ? WHERE id = ?";
  //const results = await db.query(sql, [
    //data.nombre,
    //data.email,
    //data.clave,
    //id,
  //]);
  //return results;
//}

//Falta ver el tema de la contraseña... quizas agregar la funcion de recuperar contraseña via gmail??
export async function updateUsuario(id, datos) {
  // Construir dinámicamente el SET del SQL
  const campos = [];
  const valores = [];

  if (datos.nombre !== undefined) {
    campos.push("nombre=?");
    valores.push(datos.nombre);
  }
  if (datos.email !== undefined) {
    campos.push("email=?");
    valores.push(datos.email);
  }
  if (datos.telefono !== undefined) {
    campos.push("telefono=?");
    valores.push(datos.telefono);
  }
  if (datos.id_tipo_usuario !== undefined) {
    campos.push("id_tipo_usuario=?");
    valores.push(datos.id_tipo_usuario);
  }
 //Cambiar clave solo si se envia la clave y clave actual_actual
  if (datos.clave && datos.clave_actual) {
     //1. traer la clave actual de la BD
     console.log("ID recibido:", id);
    const result = await db.query("SELECT clave FROM usuario WHERE id = ?", [id]);
    if (!result[0] || result.length === 0) {
    throw new Error("Usuario no encontrado");
  } 
const claveGuardada = result[0].clave;
const { isMatch } = await verifyPassword(datos.clave_actual, claveGuardada);
if (!isMatch) {
  console.log("Contraseña actual incorrecta");
  throw new Error("La contraseña actual es incorrecta");
}
const nuevaClave = await hashPasswordBcrypt(datos.clave);
campos.push("clave=?");
valores.push(nuevaClave);
  }

  if (campos.length === 0) throw new Error("No hay campos para actualizar");

  const sql = `UPDATE usuario SET ${campos.join(", ")} WHERE id=?`;
  valores.push(id);

  await db.query(sql, valores);
  return true;
}

//Eliminar usuario
async function eliminar(id){
  const sql = "DELETE FROM usuario WHERE id = ?";
  const results = await db.query(sql, [id]);
  return results;
}

// Funciones para endpoints especiales

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

//Buscar usuarios por parametros
async function searchUsuariosByParameters(
  tipoUsuario,
  nombre,
  dependencia, 
  estado,
  limite = null,
  offset = null
){
  try{
    let sql = "SELECT u.id,u.nombre, u.telefono, u.email, DATE_FORMAT(u.fecha_alta, '%Y-%m-%d') AS fecha_alta,DATE_FORMAT(u.ultima_visita, '%Y-%m-%d') AS ultima_visita,u.estado, tu.nombre AS rol, d.nombre AS dependencia, COUNT(*)OVER() AS total FROM usuario u JOIN tipo_usuario tu ON tu.id = u.id_tipo_usuario  LEFT JOIN dependencia d ON d.id = u.id_dependencia WHERE 1=1";
    const params = [];
    if (tipoUsuario) {
      sql += " AND id_tipo_usuario = ?";
      params.push(tipoUsuario);
    }
    if (nombre) {
      sql += " AND u.nombre LIKE ?";
      params.push(`%${nombre}%`);
    }
    if (dependencia) {
      sql += " AND id_dependencia = ?";
      params.push(dependencia);
    }
    if (estado) {
      sql += " AND u.estado = ?";
      params.push(estado);
    }
    sql += " GROUP BY u.id";
    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }
    const results = await db.query(sql, params);
    const totalResults = results?.length > 0 ? results[0].total : 0;
     if (!results) {
      console.log(
        "No se encontró los usuarios con los parámetros especificados"
      );
      return { data: [], totalResults };
    }
    return { data: results, totalResults };
  }catch (error) {
    console.error("Error al buscar usuarios por parámetros:", error);
  }
}


export default { getUsuarioById, createUsuario, updateUsuario, eliminar, filterUsuariosporDepartament, UsuarioByEmailAndEstado, searchUsuariosByParameters,create, edit};

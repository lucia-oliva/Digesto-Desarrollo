import db from "./db.js";
import { hashPasswordBcrypt, verifyPassword } from "../utils/authPass.js";

// Funciones CRUD basicas

//cambiar estado
async function cambiarEstado({ id_usuario, nuevo_estado}) {
  if (!id_usuario || !nuevo_estado) {
    const err = new Error("Faltan datos: id_usuario y nuevo_estado son requeridos.");
    err.errno = 400;
    throw err;
  }
  const estado = String(nuevo_estado).toLowerCase().trim();
  if (!["activo", "inactivo"].includes(estado)) {
    const err = new Error("nuevo_estado inválido: use 'activo' o 'inactivo'.");
    err.errno = 400;
    throw err;
  }
  const user = await db.queryOne("SELECT id, estado FROM usuario WHERE id = ?", [id_usuario]);
  if (!user) {
    const err = new Error(`Usuario id=${id_usuario} no encontrado.`);
    err.errno = 404;
    throw err;
  }
  if (String(user.estado).toLowerCase() === estado) {
    return { mensaje: `Sin cambios: el usuario ya estaba ${estado}.`, noChange: true };
  }
  await db.query("UPDATE usuario SET estado = ? WHERE id = ?", [estado, id_usuario]);
  return { mensaje: `Usuario ${estado === "activo" ? "activado" : "desactivado"} correctamente.` };
}



//Editar usuario.
async function edit(data) {
  const { id, rol, nombre, telefono, email, password, estado, dependencia } =
    data;
  //verificar si id_dependencia es undefined, si lo es, asignar 0 como valor por defecto
  const dependenciaFinal = dependencia ?? 0; // Si no se proporciona, usar

  const fechaSubida = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  //Null si no hay contraseña nueva
  let claveHasheada = null;
  if (typeof password === "string" && password.trim() !== "") {
    claveHasheada = await hashPasswordBcrypt(password.trim());
  }
  try {
    //Actualizar el usuario
    const sqlUpdate =
      "UPDATE usuario SET nombre = ?, id_tipo_usuario = ?, telefono = ?, email = ?, clave = COALESCE(?, clave), estado = ?, fecha_alta = ?, ultima_visita = ?, id_dependencia = ? WHERE id = ?";
    const result = await db.execute(sqlUpdate, [
      nombre,
      rol,
      telefono,
      email,
      claveHasheada,
      estado,
      fechaSubida,
      fechaSubida,
      dependenciaFinal,
      id,
    ]);

    if (result.affectedRows === 0) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }
    return {
      mensaje: "Usuario editado correctamente",
    };
  } catch (error) {
    console.error("Error al editar el usuario:", error);
    throw error;
  }
}

//Mostrar usuario por ID
async function getUsuarioByIdDatos(id) {
  const sql =
    "SELECT *, id, telefono, estado, email, nombre, id_tipo_usuario as rol, id_dependencia as dependencia FROM usuario WHERE id = ?";
  const results = await db.queryOne(sql, [id]);
  if (!results) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }
  return results;
}

async function create(data) {
  const { nombre, telefono, email, password, rol, dependencia } = data;
  const dependenciaFinal = dependencia ?? 0; // Si no se proporciona, usar 0 como valor por defecto
  console.log("user model", data);

  try {
    const fechaSubida = new Date().toISOString().split("T")[0];
    const estado = "activo";
    const claveHasheada = await hashPasswordBcrypt(password);
    const duplicateCheck = await db.queryOne(
      "SELECT id FROM usuario WHERE email = ?",
      [email]
    );
    if (duplicateCheck) {
      const error = new Error(`El email '${email}' ya está registrado.`);
      error.errno = 409; // Código de error personalizado para conflicto
      throw error;
    }

    const sqlInsertUser = ` INSERT INTO usuario (nombre, telefono, email, clave, fecha_alta, id_dependencia, estado, id_tipo_usuario, ultima_visita) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)`;
    const result = await db.query(sqlInsertUser, [
      nombre,
      telefono,
      email,
      claveHasheada,
      fechaSubida,
      dependenciaFinal,
      estado,
      rol,
      fechaSubida,
    ]);
    const userId = result.insertId;

    return {
      mensaje: "Usuario creado correctamente",
    };
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
}

//BUG  no estoy segura si la funcion de create es usada en otra parte del codigo, por las dudas replico la funcionalidad...y si no esta quedaria para borrar.
async function createUsuario(user) {
  console.log("user model", user);

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
    const result = await db.query("SELECT clave FROM usuario WHERE id = ?", [
      id,
    ]);
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

  if (campos.length === 0)
    throw new Error("No hay campos para actualizar", 400);

  const sql = `UPDATE usuario SET ${campos.join(", ")} WHERE id=?`;
  valores.push(id);

  await db.query(sql, valores);
  return true;
}

//Eliminar usuario
async function eliminar(id) {
  const sql = "DELETE FROM usuario WHERE id = ?";
  const results = await db.query(sql, [id]);
  return results;
}

// Funciones para endpoints especiales

//Filtrar usuarios por departamento
async function filterUsuariosporDepartament(id) {
  const sql = "SELECT * FROM usuario WHERE id_dependencia LIKE ? ";
  const results = await db.query(sql, [id]);
  return results;
}

//TODO - No hago esta funcion porque la clave deberia estar hasheada;
//select * from usuario where email ? and clave ?

//select * from usuario where email ? and estado='activo'
async function UsuarioByEmailAndEstado(email) {
  const sql = "SELECT * FROM usuario WHERE email = ? AND estado = 'activo' ";
  const results = await db.query(sql, [email]);
  return results;
}

//Buscar usuarios por parametros
async function searchUsuariosByParameters(
  rol,
  nombre,
  dependencia,
  estado,
  limite = null,
  offset = null
) {
  let sql =
    "SELECT u.id,u.nombre, u.telefono, u.email, DATE_FORMAT(u.fecha_alta, '%Y-%m-%d') AS fecha_alta,DATE_FORMAT(u.ultima_visita, '%Y-%m-%d') AS ultima_visita,u.estado, tu.nombre AS rol, d.nombre AS dependencia, COUNT(*)OVER() AS total FROM usuario u JOIN tipo_usuario tu ON tu.id = u.id_tipo_usuario  LEFT JOIN dependencia d ON d.id = u.id_dependencia WHERE 1=1";
  const params = [];
  if (rol) {
    sql += " AND id_tipo_usuario = ?";
    params.push(rol);
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
  const totalResults = results?.[0]?.total ?? 0;
  if (!results.length) {
    const error = new Error(
      "No se encontró los usuarios que coincidan con su búsqueda"
    );
    error.status = 404;
    throw error;
  }
  return { data: results, totalResults };
}

export default {
  getUsuarioByIdDatos,
  createUsuario,
  updateUsuario,
  eliminar,
  filterUsuariosporDepartament,
  UsuarioByEmailAndEstado,
  searchUsuariosByParameters,
  create,
  edit,cambiarEstado
};

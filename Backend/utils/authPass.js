import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

/** Este archivo cumple la funcion de transicionar y verificar la contraseña,
cambiando el antiguo hash usado con PHP (MD5) a bcryptjs con salt para una mejor seguridad */

// Función para hashear una contraseña con MD5
function hashPasswordMD5(password) {
  return CryptoJS.MD5(password).toString();
}

// Función para hashear una contraseña con bcrypt
//TODO  : ver si se puede usar con createUser -- delete line
async function hashPasswordBcrypt(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// Función para verificar si la contraseña es correcta con MD5 o bcrypt
async function verifyPassword(enteredPassword, storedHash) {
  // Verificar si el hash almacenado es MD5
  const isMD5Hash = storedHash.length === 32; // Los hashes MD5 tienen 32 caracteres
  if (isMD5Hash) {
    const enteredPasswordMD5 = hashPasswordMD5(enteredPassword);
    if (enteredPasswordMD5 === storedHash) {
      // Si el hash es MD5 y coincide, actualizamos a bcrypt
      const bcryptHash = await hashPasswordBcrypt(enteredPassword);
      return { isMatch: true, newHash: bcryptHash }; // Devolver el nuevo hash bcrypt
    }
  } else {
    // Verificar bcrypt
    const isMatch = await bcrypt.compare(enteredPassword, storedHash);
    return { isMatch, newHash: storedHash }; // Si ya es bcrypt, solo verificamos
  }
  return { isMatch: false }; // Si no coincide
}

export { hashPasswordMD5, hashPasswordBcrypt, verifyPassword };

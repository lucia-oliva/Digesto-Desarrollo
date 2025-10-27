import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";


function hashPasswordMD5(password) {
  return CryptoJS.MD5(password).toString();
}


async function hashPasswordBcrypt(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function verifyPassword(enteredPassword, storedHash) {

  const isMD5Hash = storedHash.length === 32; 
  if (isMD5Hash) {
    const enteredPasswordMD5 = hashPasswordMD5(enteredPassword);
    if (enteredPasswordMD5 === storedHash) {
    
      const bcryptHash = await hashPasswordBcrypt(enteredPassword);
      return { isMatch: true, newHash: bcryptHash }; 
    }
  } else {
   
    const isMatch = await bcrypt.compare(enteredPassword, storedHash);
    return { isMatch, newHash: storedHash }; 
  }
  return { isMatch: false }; 
}



async function dataValidation(username, password){

  if(typeof username !== 'string') throw new Error('Username must be a string');
  if(username.length < 3) throw new Error('Username must be at least 3 characters long');
  if (typeof password !== 'string') throw new Error('Password must be a string');

}

export { hashPasswordMD5, hashPasswordBcrypt, verifyPassword, dataValidation};

import fs from 'fs';
import path from 'path';


export const verificarArchivo = async (filename) => {
    const filePath = path.join(process.cwd(), "public", "pdf", filename);
  
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true; // El archivo existe
    } catch (error) {
      return false; // El archivo no existe
    }
  };

  export default{verificarArchivo}
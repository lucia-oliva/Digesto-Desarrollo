import multer from "multer";
import fs from "fs-extra";
import db from "../services/db.js";

/*MULTER es un middleware para subir archivos - fs es un modulo de node para manejar archivos */

// Configuración de Multer
const storage = multer.diskStorage({
  // Fijamos la ubicación de los archivos y con fs creamos la carpeta
  destination: async (req, file, cb) => {
    try {
      const uploadsDir = "./archivos";
      await fs.mkdir(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error);
    }
  },

  // Alteramos el nombre de los pdf
  filename: async (req, file, cb) => {
    try {
      // Verificamos si el archivo es un PDF
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Solo se permiten archivos PDF"));
      }

      // Validamos los datos
      const { id_dependencia, resolucion, anio } = req.body;
      if (!id_dependencia || !resolucion || !anio) {
        return cb(new Error("Faltan parámetros"));
      }

      // Generamos el nombre del archivo
      const [{ codificacion }] = await db.query(
        "SELECT codificacion FROM dependencia WHERE id = ?",
        [id_dependencia]
      );

      if (!codificacion) {
        return cb(new Error("Dependencia no existe"));
      }

      const timestamp = Date.now();
      const fileName = `${codificacion}_${resolucion}_${anio}_${timestamp}.pdf`;

      cb(null, fileName);
    } catch (error) {
      cb(error);
    }
  },
});

export const pdfHandler = multer({ storage });

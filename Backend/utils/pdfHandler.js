import multer from "multer";
import fs from "fs-extra";
import db from "../services/db.js";

/*MULTER es un middleware para subir archivos - fs es un modulo de node para manejar archivos */

// Configuración de Multer
const storage = multer.diskStorage({
  // Fijamos la ubicación de los archivos y con fs creamos la carpeta
  destination: function (req, file, cb) {
    const uploadsDir = "./archivos";
    if (!fs.existsSync("./archivos")) {
      fs.mkdirSync("./archivos");
    }
    cb(null, uploadsDir);
  },

  // Alteramos el nombre de los pdf
  filename: async function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      // Verificamos que sea un pdf
      return cb(new Error("Solo se permiten archivos PDF"));
    }
    // Se supone que el formato es (ultimo id + 1) + codificacion + numero de Resolucion +año dado por el front + numero random

    //TODO : Completar la logica con las partes del formato faltantes

    try {
      const [{ id }] = await db.query(
        "SELECT id FROM normativa ORDER BY id DESC LIMIT 1"
      );
      const [{ codificacion }] = await db.query(
        "SELECT codificacion FROM dependencia where id = ? ",
        [req.body.id_dependencia]
      );
      const fileName = `${id + 1}_${codificacion}.pdf`;
      cb(null, fileName);
    } catch (error) {
      console.error(error);
      cb(error);
    }
  },
});

// Exportamos el middleware
export const pdfHandler = multer({ storage });

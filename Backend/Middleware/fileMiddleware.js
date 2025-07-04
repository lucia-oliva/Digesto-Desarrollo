import multer from "multer";
import fs from "fs-extra";

// Configuración de Multer
const storage = multer.diskStorage({
  // 📁 Carpeta donde se guarda el archivo
  destination: async (req, file, cb) => {
    try {
      const uploadsDir = "./archivos";
      await fs.mkdir(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error);
    }
  },

  // 📝 Nombre temporal del archivo (se renombra después en el controlador)
  filename: (req, file, cb) => {
    try {
      // Solo permitimos PDF
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Solo se permiten archivos PDF"));
      }

      const timestamp = Date.now();
      const fileName = `temp_${timestamp}.pdf`; // nombre temporal
      cb(null, fileName);
    } catch (error) {
      cb(error);
    }
  }
});

// Exportamos el middleware de multer
export const pdfHandler = multer({ storage });

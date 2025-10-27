import multer from "multer";
import fs from "fs-extra";


const storage = multer.diskStorage({

  destination: async (req, file, cb) => {
    try {
      const uploadsDir = "./archivos";
      await fs.mkdir(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    try {
    
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Solo se permiten archivos PDF"));
      }

      const timestamp = Date.now();
      const fileName = `temp_${timestamp}.pdf`;
      cb(null, fileName);
    } catch (error) {
      cb(error);
    }
  }
});

export const pdfHandler = multer({ storage });

import express from "express";
import { pdfHandler } from "../utils/pdfHandler.js";

const router = express.Router();

//XXX : eliminar esta ruta , es solo para testeos y pruebas

router.post("/", pdfHandler.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ error: "No se ha proporcionado un archivo" });
    }

    res.status(200).json({
      message: "Archivo subido correctamente",
      filename: file.filename,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

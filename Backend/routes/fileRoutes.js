import express from "express";
import db from "../services/db.js";
import path from "path";
import fs from "fs/promises";
import { pdfHandler } from "../Middleware/fileMiddleware.js";

const router = express.Router();


//TODO: Agregar validaciones? ( si el estado es eliminado , etc)
//Download fil
router.get("/download", async (req, res) => {
  try {
    const filename = req.query.filename;
    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const filePath = path.resolve("archivos", filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});


/* FIXME: Se Requiere Mejorar RUTA UPLOAD 
    A Mejorar: 
    1- Prevenir que se cree un archivo al existir uno con los mismos parámetros en la bd.
    2- Agregar los parametros faltantes (fecha de alta , creacion , titulo, resumen , etc)
*/

//Upload file
router.post("/upload", pdfHandler.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se ha proporcionado un archivo" });
    }
    const {
      id_dependencia,
      id_emisor,
      tipo_normativa,
      titulo,
      resolucion,
      anio,
    } = req.body;

    // Valida si ya existe un archivo con los mismos parámetros
    const existingNormativa = await db.query(
      "SELECT * FROM normativa WHERE id_dependencia = ? AND numero = ? AND anio = ?",
      [id_dependencia, resolucion, anio]
    );

    if (existingNormativa && existingNormativa.length > 0) {
      return res.status(400).json({
        error: "Ya existe un archivo con los mismos parámetros",
      });
    }

    // Guarda el archivo en la base de datos
    const result = await db.query(
      "INSERT INTO normativa (id_dependencia, id_emisor, id_tipo_normativa,titulo, numero, anio, archivo) VALUES (?,?, ?,?, ?, ?, ?)",
      [
        id_dependencia,
        id_emisor,
        tipo_normativa,
        titulo,
        resolucion,
        anio,
        req.file.filename,
      ]
    );

    // Verifica si la inserción fue exitosa
    if (result.affectedRows === 0) {
      throw new Error(" La base de datos no pudo guardar el archivo.");
    }

    res.status(201).json({
      message: "Archivo subido correctamente",
      id: result.insertId,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    res.status(500).json({ error: "Error al subir el archivo" });
  }
});


export default router;
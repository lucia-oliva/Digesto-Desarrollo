import express from "express";
import db from "../services/db.js";
import fs from "fs/promises";
import { pdfHandler } from "../Middleware/fileMiddleware.js";
import {
  authenticateToken,
  optionalAuthenticateToken,
} from "../Middleware/authMiddleware.js";
import { authorizePolicy } from "../Middleware/rbacMiddleware.js";
import fileDB from "../services/file.js";
import normativaDB from "../services/normativa.js";
import dependenciaDB from "../services/dependencia.js";
import { POLICIES } from "../security/policies.js";

const router = express.Router();

router.get(
  "/download",

  optionalAuthenticateToken,

  authorizePolicy(POLICIES.PUBLIC_PUBLISHED, {
    getResourceAccessContext: (req) =>
      fileDB.getFileAccessContextById(req.query.tipo, req.query.id),

    getUserDependency: (req) =>
      dependenciaDB.getDepenendenciaById(req.user.dependenciaId),
  }),

  async (req, res) => {
    try {
      const { tipo, id } = req.query;

      const info = await fileDB.getFileDownloadInfo(tipo, id);

      try {
        await fs.access(info.absolutePath);
      } catch {
        return res.status(404).json({
          error: "File not found",
        });
      }

      if (info.tipo === "normativa") {
        try {
          await db.query(
            "UPDATE normativa SET visitas = visitas + 1 WHERE id = ?",
            [id],
          );
        } catch (err) {
          console.error("Error updating visitas count:", err);
        }
      }

      res.download(info.absolutePath, info.downloadName, (err) => {
        if (err) {
          console.error("Error downloading file:", err);

          if (!res.headersSent) {
            res.status(500).json({
              error: "Error downloading file",
            });
          }
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);

      if (!res.headersSent) {
        const status = error.status || 500;
        res.status(status).json({
          error: error.message || "Unexpected server error",
        });
      }
    }
  },
);

router.post(
  "/upload/:id",

  authenticateToken,

  pdfHandler.single("file"),

  authorizePolicy(POLICIES.RESOURCE_UPLOAD, {
    getDestinationType: (req) => req.body.type ?? "normativa",

    getResourceDependencyId: (req) =>
      normativaDB.getNormativaDependencyById(req.params.id),

    getUserDependency: (req) =>
      dependenciaDB.getDepenendenciaById(req.user.dependenciaId),
  }),

  async (req, res) => {
    try {
      const resultado = await fileDB.procesarArchivoDeNormativa({
        file: req.file,
        body: req.body,
        normativaId: req.params.id,
      });

      res.status(200).json({
        message: "Archivo subido y normativa actualizada correctamente",
        ...resultado,
      });
    } catch (error) {
      console.error("Error en /upload/:id:", error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

router.post(
  "/upload",

  authenticateToken,

  pdfHandler.single("file"),

  authorizePolicy(POLICIES.RESOURCE_UPLOAD, {
    getDestinationType: () => "normativa",

    getTargetDependencyId: (req) => req.body.id_dependencia,
  }),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No se ha proporcionado un archivo",
        });
      }

      const {
        id_dependencia,
        id_emisor,
        tipo_normativa,
        titulo,
        resolucion,
        anio,
      } = req.body;

      const existingNormativa = await db.query(
        "SELECT * FROM normativa WHERE id_dependencia = ? AND numero = ? AND anio = ?",
        [id_dependencia, resolucion, anio],
      );

      if (existingNormativa && existingNormativa.length > 0) {
        return res.status(400).json({
          error: "Ya existe un archivo con los mismos parámetros",
        });
      }

      const result = await db.query(
        "INSERT INTO normativa (id_dependencia, id_emisor, id_tipo_normativa, titulo, numero, anio, archivo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          id_dependencia,
          id_emisor,
          tipo_normativa,
          titulo,
          resolucion,
          anio,
          req.file.filename,
        ],
      );

      if (result.affectedRows === 0) {
        throw new Error("La base de datos no pudo guardar el archivo.");
      }

      res.status(201).json({
        message: "Archivo subido correctamente",
        id: result.insertId,
        filename: req.file.filename,
      });
    } catch (error) {
      console.error("Error al subir el archivo:", error);

      res.status(500).json({
        error: "Error al subir el archivo",
      });
    }
  },
);

export default router;

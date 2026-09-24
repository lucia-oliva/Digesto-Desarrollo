import express from "express";
import db from "../services/db.js";
import path from "path";
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
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

const router = express.Router();

router.get(
  "/download",
  optionalAuthenticateToken,
  authorizePolicy(POLICIES.PUBLIC_PUBLISHED, {
    getResourceAccessContext: (req) =>
      fileDB.getFileAccessContext(req.query.filename),

    getUserDependency: (req) =>
      dependenciaDB.getDepenendenciaById(req.user.dependenciaId),
  }),
  asyncHandler(async (req, res, next) => {
    const filename = req.query.filename;

    if (!filename) {
      throw httpError(400, "Archivo requerido.");
    }

    const base = path.resolve("archivos");

    const candidates = [
      {
        dir: base,
        updateVisita: true,
      },
      {
        dir: path.join(base, "Actas"),
        updateVisita: false,
      },
      {
        dir: path.join(base, "OrdenesDelDia"),
        updateVisita: false,
      },
    ];

    let foundPath = null;
    let shouldUpdateVisita = false;

    for (const candidate of candidates) {
      const candidatePath = path.join(candidate.dir, filename);

      try {
        await fs.access(candidatePath);

        foundPath = candidatePath;
        shouldUpdateVisita = candidate.updateVisita;

        break;
      } catch {
        continue;
      }
    }

    if (!foundPath) {
      throw httpError(404, "Archivo no encontrado.");
    }

    if (shouldUpdateVisita) {
      try {
        await db.query(
          "UPDATE normativa SET visitas = visitas + 1 WHERE archivo = ?",
          [filename],
        );
      } catch {
        console.error("No se pudo actualizar el contador de visitas.");
      }
    }

    return res.download(foundPath, filename, (error) => {
      if (error) {
        return next(error);
      }

      return undefined;
    });
  }),
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
  asyncHandler(async (req, res) => {
    const resultado = await fileDB.procesarArchivoDeNormativa({
      file: req.file,
      body: req.body,
      normativaId: req.params.id,
    });

    return res.status(200).json({
      message: "Archivo subido y normativa actualizada correctamente",
      ...resultado,
    });
  }),
);

router.post(
  "/upload",
  authenticateToken,
  pdfHandler.single("file"),
  authorizePolicy(POLICIES.RESOURCE_UPLOAD, {
    getDestinationType: () => "normativa",

    getTargetDependencyId: (req) => req.body.id_dependencia,
  }),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw httpError(400, "No se ha proporcionado un archivo.");
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
      throw httpError(400, "Ya existe un archivo con los mismos parámetros.");
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

    return res.status(201).json({
      message: "Archivo subido correctamente",
      id: result.insertId,
      filename: req.file.filename,
    });
  }),
);

export default router;

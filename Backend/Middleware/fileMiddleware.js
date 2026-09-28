import multer from "multer";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import { open as openFile } from "fs/promises";
import {
  FILES_ROOT,
  MAX_PDF_SIZE_BYTES,
  PDF_MAGIC_BYTES,
} from "../config/files.js";

function fileHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function hasPdfExtension(fileName) {
  return path.extname(String(fileName ?? "")).trim().toLowerCase() === ".pdf";
}

// Filtro temprano: rechaza nombres sin extensión .pdf.
// No se usa `file.mimetype` (declarado por el cliente) como criterio.
function pdfFileFilter(req, file, cb) {
  if (!hasPdfExtension(file.originalname)) {
    return cb(fileHttpError(415, "Solo se permiten archivos PDF"));
  }

  return cb(null, true);
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(FILES_ROOT, { recursive: true });
      cb(null, FILES_ROOT);
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    try {
      // El nombre lo genera el backend (nunca a partir de `file.originalname`).
      const tempName = `${crypto.randomUUID()}.pdf`;
      req.fileTempPath = path.join(FILES_ROOT, tempName);
      cb(null, tempName);
    } catch (error) {
      cb(error);
    }
  },
});

export function isPdfMagicBytes(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < PDF_MAGIC_BYTES.length) {
    return false;
  }

  return (
    buffer.subarray(0, PDF_MAGIC_BYTES.length).toString("latin1") ===
    PDF_MAGIC_BYTES
  );
}

// Si multer falla (p. ej. LIMIT_FILE_SIZE) elimina el temporal parcial y propaga el error.
export async function handleUploadError(err, req, res, next) {
  const tempPath = req.fileTempPath ?? req.file?.path;

  if (tempPath) {
    await fs.remove(tempPath).catch(() => {});
  }

  return next(err);
}

// Si la petición termina rechazada (4xx/5xx) elimina el temporal escrito por multer.
export function cleanupTempFileOnError(req, res, next) {
  const tempPath = req.fileTempPath ?? req.file?.path;

  if (tempPath) {
    res.on("close", () => {
      if (res.statusCode >= 400) {
        fs.remove(tempPath).catch(() => {});
      }
    });
  }

  return next();
}

// Verifica los magic bytes (%PDF-) sobre el archivo ya escrito.
export async function validatePdfContent(req, res, next) {
  const tempPath = req.file?.path;

  if (!tempPath) {
    return next();
  }

  try {
    const handle = await openFile(tempPath, "r");

    try {
      const header = Buffer.alloc(PDF_MAGIC_BYTES.length);
      const { bytesRead } = await handle.read(
        header,
        0,
        PDF_MAGIC_BYTES.length,
        0,
      );

      if (bytesRead < PDF_MAGIC_BYTES.length || !isPdfMagicBytes(header)) {
        return res.status(415).json({
          error: "El archivo no es un PDF válido",
        });
      }
    } finally {
      await handle.close();
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export const pdfHandler = multer({
  storage,
  limits: { fileSize: MAX_PDF_SIZE_BYTES },
  fileFilter: pdfFileFilter,
});

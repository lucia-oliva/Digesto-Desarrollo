import path from "path";
import fs from "fs/promises";
import db from "./db.js";
import { FILES_ROOT } from "../config/files.js";
import { httpError } from "../utils/httpError.js";

async function moverArchivoYPersistir({
  origen,
  destino,
  persistir,
  mensajeError,
}) {
  await fs.mkdir(path.dirname(destino), { recursive: true });
  await fs.rename(origen, destino);

  try {
    const result = await persistir();

    if (!result || result.affectedRows === 0) {
      throw new Error(mensajeError);
    }

    return result;
  } catch (error) {
    await fs.rm(destino, { force: true }).catch(() => {});
    throw error;
  }
}

export async function procesarArchivoDeNormativa({
  file,
  body,
  normativaId,
}) {
  const {
    id_sesion,
    fecha_sesion,
    id_dependencia,
    resolucion,
    anio,
    nombre_acta,
    type = "normativa",
  } = body;

  if (!file) {
    throw httpError(400, "No se ha proporcionado un archivo.");
  }

  const carpeta = FILES_ROOT;
  const viejoPath = path.join(carpeta, file.filename);

  // Multer genera previamente un UUID como nombre temporal.
  // Se reutiliza para generar nombres definitivos únicos.
  const uploadId = path.parse(file.filename).name;

  if (type === "normativa") {
    if (!id_dependencia || !resolucion || !anio) {
      throw httpError(
        400,
        "Faltan parámetros obligatorios para la normativa.",
      );
    }

    const normativa = await db.queryOne(
      "SELECT * FROM normativa WHERE id = ?",
      [normativaId],
    );

    if (!normativa) {
      throw httpError(404, "Normativa no encontrada.");
    }

    const resultado = await db.queryOne(
      "SELECT codificacion FROM dependencia WHERE id = ?",
      [id_dependencia],
    );

    if (!resultado) {
      throw httpError(404, "Dependencia no encontrada.");
    }

    const { codificacion } = resultado;

    const nuevoNombre =
      `${codificacion}_${resolucion}_${anio}_${uploadId}.pdf`;

    const nuevoPath = path.join(carpeta, nuevoNombre);

    await moverArchivoYPersistir({
      origen: viejoPath,
      destino: nuevoPath,
      persistir: () =>
        db.execute(
          "UPDATE normativa SET archivo = ? WHERE id = ?",
          [nuevoNombre, normativaId],
        ),
      mensajeError: "No se pudo actualizar la normativa",
    });

    return {
      id: normativaId,
      filename: nuevoNombre,
    };
  }

  if (type === "consejo") {
    if (!id_sesion || !fecha_sesion) {
      throw httpError(
        400,
        "Faltan parámetros obligatorios para la sesión.",
      );
    }

    const sesion = await db.queryOne(
      "SELECT * FROM sesiones WHERE id_sesion = ?",
      [id_sesion],
    );

    if (!sesion) {
      throw httpError(404, "Sesión no encontrada.");
    }

    const fechaFormateada = new Date(fecha_sesion)
      .toISOString()
      .split("T")[0];

    const nuevoNombre =
      `ORDEN_DEL_DIA_${fechaFormateada}_${uploadId}.pdf`;

    const carpetaOrdenes = path.join(carpeta, "OrdenesDelDia");
    const nuevoPath = path.join(carpetaOrdenes, nuevoNombre);

    await moverArchivoYPersistir({
      origen: viejoPath,
      destino: nuevoPath,
      persistir: () =>
        db.execute(
          "UPDATE sesiones SET orden_url = ? WHERE id_sesion = ?",
          [nuevoNombre, id_sesion],
        ),
      mensajeError: "No se pudo actualizar la sesión",
    });

    return {
      id: id_sesion,
      filename: nuevoNombre,
    };
  }

  if (type === "acta") {
    if (!id_sesion || !fecha_sesion || !nombre_acta) {
      throw httpError(
        400,
        "Faltan parámetros obligatorios para la sesión.",
      );
    }

    const sesion = await db.queryOne(
      "SELECT * FROM sesiones WHERE id_sesion = ?",
      [id_sesion],
    );

    if (!sesion) {
      throw httpError(404, "Sesión no encontrada.");
    }

    const fechaFormateada = new Date(fecha_sesion)
      .toISOString()
      .split("T")[0];

    const nuevoNombre =
      `ACTA_DEL_DIA_${fechaFormateada}_${uploadId}.pdf`;

    const carpetaActas = path.join(carpeta, "Actas");
    const nuevoPath = path.join(carpetaActas, nuevoNombre);

    await moverArchivoYPersistir({
      origen: viejoPath,
      destino: nuevoPath,
      persistir: () =>
        db.execute(
          "UPDATE sesiones SET acta_url = ?, nombre_acta = ? WHERE id_sesion = ?",
          [nuevoNombre, nombre_acta, id_sesion],
        ),
      mensajeError: "No se pudo actualizar la sesión",
    });

    return {
      id: id_sesion,
      filename: nuevoNombre,
    };
  }

  throw httpError(400, "Tipo de procesamiento no reconocido.");
}

const ALLOWED_FILE_TYPES = Object.freeze([
  "normativa",
  "consejo",
  "acta",
]);

function normalizeFileType(tipo) {
  const value = String(tipo ?? "").trim().toLowerCase();

  if (!ALLOWED_FILE_TYPES.includes(value)) {
    throw httpError(400, "Tipo de recurso inválido.");
  }

  return value;
}

export function resolveSafePath(relativePath) {
  if (path.isAbsolute(relativePath)) {
    throw httpError(400, "Ruta absoluta no permitida.");
  }

  const absolute = path.resolve(FILES_ROOT, relativePath);

  const rootWithSeparator = FILES_ROOT.endsWith(path.sep)
    ? FILES_ROOT
    : FILES_ROOT + path.sep;

  if (
    absolute !== FILES_ROOT &&
    !absolute.startsWith(rootWithSeparator)
  ) {
    throw httpError(400, "Ruta de archivo no permitida.");
  }

  return absolute;
}

export async function getFileAccessContextById(tipo, id) {
  const normalizedTipo = normalizeFileType(tipo);

  if (!id) {
    throw httpError(400, "ID de recurso requerido.");
  }

  if (normalizedTipo === "normativa") {
    const normativa = await db.queryOne(
      `
        SELECT
          estado,
          id_dependencia AS dependenciaId
        FROM normativa
        WHERE id = ?
      `,
      [id],
    );

    if (!normativa) {
      throw httpError(404, "Normativa no encontrada.");
    }

    return {
      ...normativa,
      resourceType: "normativa",
    };
  }

  const sesion = await db.queryOne(
    "SELECT id_sesion FROM sesiones WHERE id_sesion = ?",
    [id],
  );

  if (!sesion) {
    throw httpError(404, "Sesión no encontrada.");
  }

  return {
    estado: "privado",
    dependenciaId: null,
    resourceType: "consejo",
  };
}

export async function getFileDownloadInfo(tipo, id) {
  const normalizedTipo = normalizeFileType(tipo);

  if (!id) {
    throw httpError(400, "ID de recurso requerido.");
  }

  if (normalizedTipo === "normativa") {
    const normativa = await db.queryOne(
      "SELECT archivo FROM normativa WHERE id = ?",
      [id],
    );

    if (!normativa || !normativa.archivo) {
      throw httpError(404, "Archivo no encontrado.");
    }

    const filename = String(normativa.archivo);

    return {
      absolutePath: resolveSafePath(filename),
      downloadName: filename,
      tipo: normalizedTipo,
    };
  }

  const sesion = await db.queryOne(
    "SELECT orden_url, acta_url FROM sesiones WHERE id_sesion = ?",
    [id],
  );

  if (!sesion) {
    throw httpError(404, "Sesión no encontrada.");
  }

  const column =
    normalizedTipo === "consejo"
      ? "orden_url"
      : "acta_url";

  const filename = sesion[column];

  if (!filename) {
    throw httpError(404, "Archivo no encontrado.");
  }

  const dir =
    normalizedTipo === "consejo"
      ? "OrdenesDelDia"
      : "Actas";

  const name = String(filename);

  return {
    absolutePath: resolveSafePath(path.join(dir, name)),
    downloadName: name,
    tipo: normalizedTipo,
  };
}

export default {
  procesarArchivoDeNormativa,
  getFileAccessContextById,
  getFileDownloadInfo,
  resolveSafePath,
};
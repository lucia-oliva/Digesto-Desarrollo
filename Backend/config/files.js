import path from "path";

// Raíz canónica de los PDFs subidos (relativa a /app en Docker).
// Compartida por el middleware de subida y el servicio de archivos.
export const FILES_ROOT = path.resolve("archivos");

// Tamaño máximo permitido para una subida (10 MB).
export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

// Firma de cabecera de un PDF válido (magic bytes).
export const PDF_MAGIC_BYTES = "%PDF-";

import path from "path";

const defaultFilesRoot = path.resolve("archivos");
const configuredFilesRoot = process.env.FILES_ROOT?.trim();

export const FILES_ROOT = path.resolve(
  configuredFilesRoot || "archivos",
);

if (
  process.env.NODE_ENV === "test" &&
  (!configuredFilesRoot || FILES_ROOT === defaultFilesRoot)
) {
  throw new Error(
    "Configuración insegura: los tests no pueden utilizar Backend/archivos.",
  );
}

export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export const PDF_MAGIC_BYTES = "%PDF-";
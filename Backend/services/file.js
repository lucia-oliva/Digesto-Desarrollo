import path from "path";
import fs from "fs/promises";
import db from "./db.js";


export async function procesarArchivoDeNormativa({ file, body, normativaId }) {
  const {
    id_dependencia,
    resolucion,
    anio,
  } = body;

  if (!file) throw new Error("No se ha proporcionado un archivo");
  if (!id_dependencia || !resolucion || !anio) {
    throw new Error("Faltan parámetros obligatorios");
  }

  // Verificar que la normativa exista
  const normativa = await db.query("SELECT * FROM normativa WHERE id = ?", [normativaId]);
  if (!normativa || normativa.length === 0) {
    throw new Error("Normativa no encontrada");
  }

  // Obtener codificación de la dependencia
  const resultado = await db.query(
    "SELECT codificacion FROM dependencia WHERE id = ?",
    [id_dependencia]
  );

  if (!resultado.length) {
    throw new Error("Dependencia no encontrada");
  }

  const { codificacion } = resultado[0];
  const timestamp = Date.now();
  const nuevoNombre = `${codificacion}_${resolucion}_${anio}_${timestamp}.pdf`;

  const carpeta = path.join("archivos");
  const viejoPath = path.join(carpeta, file.filename);
  const nuevoPath = path.join(carpeta, nuevoNombre);

  // Renombrar archivo
  await fs.rename(viejoPath, nuevoPath);

  // Actualizar en la base de datos
  const result = await db.query(
    "UPDATE normativa SET archivo = ? WHERE id = ?",
    [nuevoNombre, normativaId]
  );

  if (result.affectedRows === 0) {
    throw new Error("No se pudo actualizar la normativa");
  }

  return { id: normativaId, filename: nuevoNombre };
}

export default {
    procesarArchivoDeNormativa
}

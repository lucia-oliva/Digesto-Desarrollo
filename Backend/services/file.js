import path from "path";
import fs from "fs/promises";
import db from "./db.js";

export async function procesarArchivoDeNormativa({ file, body, normativaId }) {
  const {
    id_sesion,
    fecha_sesion,
    id_dependencia,
    resolucion,
    anio,
    nombre_acta,
    type = "normativa",
  } = body;

  if (!file) throw new Error("No se ha proporcionado un archivo");

  const carpeta = path.join("archivos");
  const viejoPath = path.join(carpeta, file.filename);

  if (type === "normativa") {
    if (!id_dependencia || !resolucion || !anio) {
      throw new Error("Faltan parámetros obligatorios para normativa");
    }

    const normativa = await db.queryOne(
      "SELECT * FROM normativa WHERE id = ?",
      [normativaId]
    );
    if (!normativa || normativa.length === 0) {
      throw new Error("Normativa no encontrada");
    }

    const resultado = await db.queryOne(
      "SELECT codificacion FROM dependencia WHERE id = ?",
      [id_dependencia]
    );

    if (!resultado || resultado.length === 0) {
      throw new Error("Dependencia no encontrada");
    }

    const { codificacion } = resultado[0];
    const timestamp = Date.now();
    const nuevoNombre = `${codificacion}_${resolucion}_${anio}_${timestamp}.pdf`;
    const nuevoPath = path.join(carpeta, nuevoNombre);

    await fs.rename(viejoPath, nuevoPath);

    const result = await db.execute(
      "UPDATE normativa SET archivo = ? WHERE id = ?",
      [nuevoNombre, normativaId]
    );

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar la normativa");
    }

    return { id: normativaId, filename: nuevoNombre };
  } else if (type === "consejo") {
    if (!id_sesion || !fecha_sesion) {
      throw new Error("Faltan parámetros obligatorios para sesión");
    }
    console.log("Procesando archivo de consejo con ID de sesión:", id_sesion);
    const sesion = await db.queryOne(
      "SELECT * FROM sesiones WHERE id_sesion = ?",
      [id_sesion]
    );
    if (!sesion || sesion.length === 0) {
      throw new Error(
        "Sesión no encontrada, recibimos el id_sesion: " + id_sesion
      );
    }

    const fechaFormateada = new Date(fecha_sesion).toISOString().split("T")[0];
    const nuevoNombre = `ORDEN_DEL_DIA_${fechaFormateada}.pdf`;
    const carpetaOrdenes = path.join(carpeta, "OrdenesDelDia");
    const nuevoPath = path.join(carpetaOrdenes, nuevoNombre);

    await fs.rename(viejoPath, nuevoPath);

    const result = await db.execute(
      "UPDATE sesiones SET orden_url = ? WHERE id_sesion = ?",
      [nuevoNombre, id_sesion]
    );

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar la sesión");
    }

    return { id: id_sesion, filename: nuevoNombre };
  } else if (type === "acta") {
    console.log("entro al acta:", id_sesion, fecha_sesion, nombre_acta);
    if (!id_sesion || !fecha_sesion || !nombre_acta) {
      throw new Error("Faltan parámetros obligatorios para sesión");
    }
    console.log("Procesando archivo de consejo con ID de sesión:", id_sesion);
    const sesion = await db.queryOne(
      "SELECT * FROM sesiones WHERE id_sesion = ?",
      [id_sesion]
    );
    if (!sesion || sesion.length === 0) {
      throw new Error(
        "Sesión no encontrada, recibimos el id_sesion: " + id_sesion
      );
    }

    const fechaFormateada = new Date(fecha_sesion).toISOString().split("T")[0];
    const nuevoNombre = `ACTA_DEL_DIA_${fechaFormateada}.pdf`;
    const carpetaOrdenes = path.join(carpeta, "Actas");
    const nuevoPath = path.join(carpetaOrdenes, nuevoNombre);
    await fs.rename(viejoPath, nuevoPath);
    const result = await db.execute(
      "UPDATE sesiones SET acta_url = ?, nombre_acta = ? WHERE id_sesion = ?",
      [nuevoNombre, nombre_acta, id_sesion]
    );
    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar la sesión");
    }
    return { id: id_sesion, filename: nuevoNombre };
  } else {
    throw new Error("Tipo de procesamiento no reconocido");
  }
}

export default {
  procesarArchivoDeNormativa,
};

import express from "express";
import sesionesDB from "../services/sesiones.js";

const router = express.Router();


 // ajustá el path si es necesario


router.post("/create", async (req, res) => {
  const { fecha_sesion, orden_url, nombre_orden } = req.body;

  console.log("Datos recibidos para crear sesión:", req.body);

  if (!fecha_sesion || !orden_url || !nombre_orden) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const result = await sesionesDB.create({ fecha_sesion, orden_url, nombre_orden });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear la sesión:", error);
    res.status(500).json({ error: "Error al crear la sesión" });
  }
});



router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Obteniendo sesión con ID: ${id}`);
  try {
    const sesion = await sesionesDB.getSesionById(id);
    if
  (sesion) {
      res.status(200).json(sesion);
    } else {
      res.status(404).json({ error: "Sesión no encontrada" });
    }
  } catch (error) {
    console.error("Error al obtener la sesión:", error);
    res.status(500).json({ error: "Error al obtener la sesión" });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Eliminando sesión con ID: ${id}`);
  try {
    const result = await sesionesDB.eliminar(id);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Sesión eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Sesión no encontrada" });
    }
  } catch (error) {
    console.error("Error al eliminar la sesión:", error);
    res.status(500).json({ error: "Error al eliminar la sesión" });
  }
});

export default router;
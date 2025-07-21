import express from "express";
import sesionesDB from "../services/sesiones.js";

const router = express.Router();

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
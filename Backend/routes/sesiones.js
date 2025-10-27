import express from "express";
import sesionesDB from "../services/sesiones.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.delete(
  "/eliminar/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await sesionesDB.eliminar(id);
    if (result.affectedRows === 0) {
      const err = new Error("Sesion no encontrada o ya eliminada");
      err.status = 404;
      throw err;
    }
    res.status(200).json({ ok: true, msg: "Sesion eliminada correctamente" });
  })
);

router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const { fecha_sesion, orden_url, nombre_orden } = req.body;

    console.log("Datos recibidos para crear sesión:", req.body);
    const result = await sesionesDB.create({
      fecha_sesion,
      orden_url,
      nombre_orden,
    });
    res.status(201).json({
      ok: true,
      msg: "Sesión creada correctamente",
      id_sesion: result.id_sesion,
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sesion = await sesionesDB.getSesionById(id);
    res.status(200).json(sesion);
  })
);

export default router;

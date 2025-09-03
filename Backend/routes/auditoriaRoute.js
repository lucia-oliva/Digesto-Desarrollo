import express from "express";
import auditoriaDB from "../services/auditoria.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = express.Router();

router.post(
  "/search",
  asyncHandler(async (req, res) => {
    const { titulo, usuario, accion, dependencia } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (page - 1) * limite;
    try {
      const { data, totalResults } =
        await auditoriaDB.searchAuditoriaByParameters(
          titulo,
          usuario,
          accion,
          dependencia,
          limite,
          offset
        );
      res.status(200).json({ data, totalResults });
    } catch (error) {
      res.status(500).json({ error: "Error al buscar auditorías" });
    }
  })
);

router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const { id_normativa, id_usuario, tipo } = req.body;
    if (!id_normativa || !id_usuario || !tipo) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    try {
      const result = await auditoriaDB.crearRegistroAuditoria({
        id_normativa,
        id_usuario,
        tipo,
      });
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({ error: "Error al crear registro de auditoría" });
    }
  })
);

export default router;

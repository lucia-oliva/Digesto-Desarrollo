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

export default router;

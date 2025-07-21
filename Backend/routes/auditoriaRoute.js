import express from "express";
import auditoriaDB from "../services/auditoria.js";
const router = express.Router();


router.post("/seaaarch", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limite = parseInt(req.query.limite) || 10;
    try {
        const { data, totalResults } = await auditoriaDB.getAuditoriasPaginado(page, limite);
        res.status(200).json({ data, totalResults });
    } catch (error) {
        console.error("Error al obtener auditorías:", error);
        res.status(500).json({ error: "Error al obtener auditorías" });
    }
});


// En auditoriaRoute.js
router.post("/search", async (req, res) => {
  const { titulo, usuario, accion, dependencia } = req.body;
  const page = parseInt(req.query.page) || 1;
  const limite = parseInt(req.query.limite) || 10;
  const offset = (page - 1) * limite;
  try {
    const { data, totalResults } = await auditoriaDB.searchAuditoriaByParameters(
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
});


export default router;

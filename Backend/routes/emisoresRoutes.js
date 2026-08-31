import emisoresDB from "../services/emisores.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticateToken } from "../Middleware/authMiddleware.js";
const router = express.Router();


router.get(
  "/datos/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const emisor = await emisoresDB.getById(id);
    if (!emisor) {
      throw new Error("Emisor no encontrado", 404);
    }
    res.json(emisor);
  })
);

router.get(
  "/name",
  asyncHandler(async (req, res) => {
    const emisores = await emisoresDB.getAllEmisoresName();
    res.json(emisores);
  })
);

router.post(
  "/edit",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const emisorDataEdit = req.body;
    const result = await emisoresDB.edit(emisorDataEdit);
    res.status(200).json({ ok: true, msg: result.mensaje });
  })
);

router.get(
  "/getEmisores",
  asyncHandler(async (req, res) => {
    const emisores = await emisoresDB.getEmisores();
    res.json(emisores);
  })
);

router.post(
  "/create",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const emisorData = req.body;
    const result = await emisoresDB.create(emisorData);
    if (result.affectedRows === 0) {
      const err = new Error("Error al crear el emisor");
      err.status = 400;
      throw err;
    }
    res.status(201).json(result);
  })
);

router.post(
  "/search",
  authenticateToken,
  asyncHandler(async (req, res) => {
    let { nombre, estado } = req.body;
    let { page, limite } = req.query;
    limite = parseInt(limite, 10) || 10;
    page = parseInt(page, 10) || 1;
    const offset = (page - 1) * limite;
    const { data, totalResults } = await emisoresDB.searchEmisorByParameters(
      nombre,
      estado,
      limite,
      offset
    );
    if (!data || data.length === 0) {
      throw new Error(
        "No se encontraron emisores con los parámetros especificados",
        404
      );
    }
    res.status(200).json({ data, totalResults });
  })
);

router.delete(
  "/eliminar/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await emisoresDB.eliminar(id);
    if (result.affectedRows === 0) {
      const err = new Error("Emisor no encontrado o ya eliminado");
      err.status = 404;
      throw err;
    }
    res.status(200).json({ ok: true, msg: "Emisor eliminado correctamente" });
  })
);

export default router;

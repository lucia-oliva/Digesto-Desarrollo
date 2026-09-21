import emisoresDB from "../services/emisores.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticateToken } from "../Middleware/authMiddleware.js";
import { authorizePolicy } from "../Middleware/rbacMiddleware.js";
import { POLICIES } from "../security/policies.js";

const router = express.Router();

router.get(
  "/datos/:id",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const emisor = await emisoresDB.getById(id);

    if (!emisor) {
      const error = new Error("Emisor no encontrado");
      error.status = 404;
      error.publicMessage = "Emisor no encontrado.";
      throw error;
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
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const emisorDataEdit = req.body;
    const result = await emisoresDB.edit(emisorDataEdit);

    res.status(200).json({
      ok: true,
      msg: result.mensaje,
    });
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
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const emisorData = req.body;
    const result = await emisoresDB.create(emisorData);

    res.status(201).json(result);
  })
);

router.post(
  "/search",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    let { nombre, estado } = req.body;
    let { page, limite } = req.query;

    limite = parseInt(limite, 10) || 10;
    page = parseInt(page, 10) || 1;

    const offset = (page - 1) * limite;

    const { data, totalResults } =
      await emisoresDB.searchEmisorByParameters(
        nombre,
        estado,
        limite,
        offset
      );

    if (!data || data.length === 0) {
      const error = new Error("No se encontraron emisores");
      error.status = 404;
      error.publicMessage =
        "No se encontraron emisores con los parámetros especificados.";
      throw error;
    }

    res.status(200).json({
      data,
      totalResults,
    });
  })
);

router.delete(
  "/eliminar/:id",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await emisoresDB.eliminar(id);

    if (result.affectedRows === 0) {
      const error = new Error("Emisor no encontrado o ya eliminado");
      error.status = 404;
      error.publicMessage = "Emisor no encontrado o ya eliminado.";
      throw error;
    }

    res.status(200).json({
      ok: true,
      msg: "Emisor eliminado correctamente",
    });
  })
);

export default router;
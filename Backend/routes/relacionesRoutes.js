import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import normativaVinculosDB from "../services/relaciones.js";

const router = express.Router();

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vinculos = await normativaVinculosDB.getByNormativaOriginal(id);
    res.json({ data: vinculos });
  })
);

router.get(
  "/complementaria/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vinculos = await normativaVinculosDB.getByNormativaComplementaria(id);
    res.json({ data: vinculos });
  })
);

export default router;
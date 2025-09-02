import tipoNDB from "../services/tipo_normativa.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/name",
  asyncHandler(async (req, res) => {
    const tipo_normativa = await tipoNDB.getAllTipoNormativa();
    res.json(tipo_normativa);
  })
);

export default router;

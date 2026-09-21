import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import normativaVinculosDB from "../services/relaciones.js";
import normativaDB from "../services/normativa.js";
import { optionalAuthenticateToken } from "../Middleware/authMiddleware.js";
import { authorizePolicy } from "../Middleware/rbacMiddleware.js";
import { POLICIES } from "../security/policies.js";

const router = express.Router();

router.get(
  "/:id",
  optionalAuthenticateToken,
  authorizePolicy(POLICIES.PUBLIC_PUBLISHED, {
    getResourceAccessContext: (req) =>
      normativaDB.getNormativaAccessContext(req.params.id),
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vinculos = await normativaVinculosDB.getByNormativaOriginal(id);
    res.json({ data: vinculos });
  })
);

router.get(
  "/complementaria/:id",
  optionalAuthenticateToken,
  authorizePolicy(POLICIES.PUBLIC_PUBLISHED, {
    getResourceAccessContext: (req) =>
      normativaDB.getNormativaAccessContext(req.params.id),
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vinculos = await normativaVinculosDB.getByNormativaComplementaria(id);
    res.json({ data: vinculos });
  })
);

export default router;
import tagsDB from "../services/tag.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import normativaDB from "../services/normativa.js";
import {
  authenticateToken,
  optionalAuthenticateToken,
} from "../Middleware/authMiddleware.js";
import { authorizePolicy } from "../Middleware/rbacMiddleware.js";
import { POLICIES } from "../security/policies.js";
import { httpError } from "../utils/httpError.js";
const router = express.Router();

router.delete(
  "/eliminar/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await tagsDB.eliminar(id);
    res.status(200).json({ ok: true, msg: "Tag eliminado correctamente" });
  })
);

router.get(
  "/datos/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const tag = await tagsDB.getById(id);
    res.status(200).json(tag);
  })
);


router.get(
  "/tags",
  asyncHandler(async (req, res) => {
    const tags = await tagsDB.getAllTags();
    res.status(200).json({ tags });
  })
);


router.post(
  "/edit",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const dataTagEdit = req.body;
    const result = await tagsDB.edit(dataTagEdit);
    if(!result.success){
      throw httpError(400, result.message);
    }
    res.status(200).json({ ok: true, msg: "Tag editado correctamente." });
  })
);


router.post(
  "/create",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const tagData = req.body; 
    const result = await tagsDB.create(tagData);
    if(!result.success){
      throw httpError(400, result.message);
    }
    res.status(200).json({ ok: true, msg: "Tags insertados correctamente." });
  })
);


router.get(
  "/tags/:id",
  optionalAuthenticateToken,
  authorizePolicy(POLICIES.PUBLIC_PUBLISHED, {
    getResourceAccessContext: (req) =>
      normativaDB.getNormativaAccessContext(req.params.id),
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tags = await tagsDB.getTagsByNormativaId(id);
    res.status(200).json(tags);
  })
);

router.post(
  "/tags/normativa/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { tags } = req.body; 
    if (!Array.isArray(tags) || tags.length === 0) {
      throw httpError(400, "No se proporcionaron tags válidos.");
    }
    await tagsDB.insertTagsForNormativa(id, tags);
    res
      .status(200)
      .json({ message: "Tags asociados correctamente a la normativa." });
  })
);


router.post(
  "/search",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { nombre, letra } = req.body;
    let page = req.query.page ?? 1;
    let limite = req.query.limite ?? 10;
    limite = parseInt(limite, 10) || 10;
    page = parseInt(page, 10) || 1;
    const offset = (page - 1) * limite;
    const { data, totalResults } =
      await tagsDB.searchTagsByParameters(
        nombre,
        letra,
        limite,
        offset,
      );
    return res.status(200).json({
      data,
      totalResults,
    });
  }),
);

export default router;
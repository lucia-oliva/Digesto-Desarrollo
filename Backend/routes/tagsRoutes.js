import tagsDB from "../services/tag.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = express.Router();

router.delete(
  "/eliminar/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await tagsDB.eliminar(id);
    res.status(200).json({ ok: true, msg: "Tag eliminado correctamente" });
  })
);

router.get(
  "/datos/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);

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
  asyncHandler(async (req, res) => {
    console.log("Cuerpo de la solicitud:", req.body);
    const dataTagEdit = req.body;
    const result = await tagsDB.edit(dataTagEdit);
    if(!result.success){
      return res.status(400).json({ ok: false, msg: result.message });
    }
    res.status(200).json({ ok: true, msg: "Tag editado correctamente." });
  })
);


router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const tagData = req.body; 
    const result = await tagsDB.create(tagData);
    if(!result.success){
      return res.status(400).json({ ok: false, msg: result.message });
    }
    res.status(200).json({ ok: true, msg: "Tags insertados correctamente." });
  })
);


router.get(
  "/tags/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tags = await tagsDB.getTagsByNormativaId(id);
    res.status(200).json(tags);
  })
);

router.post(
  "/tags/normativa/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { tags } = req.body; 
    if (!Array.isArray(tags) || tags.length === 0) {
      return res
        .status(400)
        .json({ error: "No se proporcionaron tags válidos." });
    }
    await tagsDB.insertTagsForNormativa(id, tags);
    res
      .status(200)
      .json({ message: "Tags asociados correctamente a la normativa." });
  })
);


router.post(
  "/search",
  asyncHandler(async (req, res) => {
    try {
      let { nombre, letra } = req.body;
      console.log("parametros:", nombre, letra);
      console.log("query:", req.query);
      let page = req.query.page !== undefined ? req.query.page : 1;
      let limite = req.query.limite !== undefined ? req.query.limite : 10;
      limite = parseInt(limite, 10) || 10;
      page = parseInt(page, 10) || 1;
  
      const offset = (page - 1) * limite;
   
      const { data, totalResults } = await tagsDB.searchTagsByParameters(
        nombre,
        letra,
        limite,
        offset
      );
      res.status(200).json({ data, totalResults });
    } catch (error) {
      console.error("Error en /search:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  })
);

export default router;

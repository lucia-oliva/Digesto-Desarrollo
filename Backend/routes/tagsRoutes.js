import tagsDB from "../services/tag.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = express.Router();

// Eliminar un tag por id
router.delete(
  "/eliminar/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await tagsDB.eliminar(id);
    res.status(200).json({ ok: true, msg: "Tag eliminado correctamente" });
  })
);

//traer datos para la funcion de editar
router.get(
  "/datos/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const tag = await tagsDB.getById(id);
    res.status(200).json(tag);
  })
);

// Obtener todos los tags
router.get(
  "/tags",
  asyncHandler(async (req, res) => {
    const tags = await tagsDB.getAllTags();
    res.status(200).json({ tags });
  })
);

// Editar un tag
router.post(
  "/edit",
  asyncHandler(async (req, res) => {
    console.log("Cuerpo de la solicitud:", req.body);
    const dataTagEdit = req.body;
    const result = await tagsDB.edit(dataTagEdit);
    res.status(200).json({ ok: true, msg: "Tag editado correctamente." });
  })
);

// Crear tags
router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const tagData = req.body; // Array de tags
    await tagsDB.create(tagData);
    res.status(200).json({ ok: true, msg: "Tags insertados correctamente." });
  })
);

//Obtener tags de normativa
router.get(
  "/tags/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tags = await tagsDB.getTagsByNormativaId(id);
    res.status(200).json(tags);
  })
);

// Asociar tags con una normativa
router.post(
  "/tags/normativa/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params; // ID de la normativa
    const { tags } = req.body; // Array de tags
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

//Filtrar Tags por parametros
router.post(
  "/search",
  asyncHandler(async (req, res) => {
    try {
      let { nombre, letra } = req.body;
      console.log("parametros:", nombre, letra);
      let page = req.query.page !== undefined ? req.query.page : 1;
      let limite = req.query.limite !== undefined ? req.query.limite : 10;
      limite = parseInt(limite, 10) || 10;
      page = parseInt(page, 10) || 1;
      // Si hay otros parámetros, filtrar por ellos
      const offset = (page - 1) * limite;
      //Get the total count of results
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

import tagsDB from '../services/tag.js';
import express from "express";
const router = express.Router();

router.get("/tags", async (req, res) => {
try{
    const tags = await tagsDB.getAllTags(); 
    res.status(200).json({tags});
}catch(err){
    console.log("Error al obtener los tags", err);
    res.status(500).json({ error: "Error al obtener los tags" });   
}}
);


//Obtener tags de normativa 

router.get("/tags/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tags = await tagsDB.getTagsByNormativaId(id);
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error al obtener los tags:", error);
    res.status(500).json({ error: "Error al obtener los tags" });
  }
});


// Asociar tags con una normativa
router.post("/tags/normativa/:id", async (req, res) => {
  const { id } = req.params; // ID de la normativa
  const { tags } = req.body; // Array de tags

  if (!Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ error: "No se proporcionaron tags válidos." });
  }

  try {
    await tagsDB.insertTagsForNormativa(id, tags);
    res.status(200).json({ message: "Tags asociados correctamente a la normativa." });
  } catch (error) {
    console.error("Error al asociar tags con la normativa:", error);
    res.status(500).json({ error: "Error al asociar tags con la normativa." });
  }
});

export default router;
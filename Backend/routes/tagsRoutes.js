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


//Filtrar dependencia por parametros
router.post("/search", async (req, res) => {
  let {nombre,letra} = req.body;
  console.log("parametros:",nombre,letra);
  let { page , limite } = req.query;
  limite = parseInt(limite, 10) || 10;
  page = parseInt(page, 10) || 1;
  try {
    // Si hay otros parámetros, filtrar por ellos
    const offset = (page - 1) * limite;
    //Get the total count of results
    const { tags, totalResults } =
      await tagsDB.searchTagsByParameters(
        nombre,
        letra,
        limite,
        offset,
      );
    if (!tags || tags.length === 0) {
      return res
        .status(404)
        .json({
          error: "No se encontró los tags que coincidan con su búsqueda",
        });
    }
    res.status(200).json({ tags, totalResults });
  } catch (err) {
    console.log("Error al buscar el tag", err);
    res.status(500).json({ error: "Error al buscar el tag" });
  }
});



export default router;
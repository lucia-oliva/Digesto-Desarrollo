import emisoresDB from "../services/emisores.js";
import express from "express";

const router = express.Router();

router.get("/name", async (req, res) => {
  try{
    const emisores = await emisoresDB.getAllEmisoresName(); 
    res.json(emisores);
  }catch(err){
    console.log("Error al obtener emisores",error);
    res.status(500).json({ error: "Error al obtener emisores" });   
  }}
);


router.post("/edit", async (req, res) => {
  console.log("Cuerpo de la solicitud:", req.body);
  const emisorDataEdit = req.body; 
  try {
    const result = await emisoresDB.edit(emisorDataEdit);
    if (result.success) {
      res.status(200).json({ message: "Emisor editado correctamente." });
    } else {
      res.status(400).json({ error: result.mensaje });
    }
  } catch (error) {
    console.error("Error al editar el emisor:", error);
    res.status(500).json({ error: "Error al editar el emisor" });
  }
});

router.post("/create", async (req, res) => {
  const emisorData = req.body;
  try {
    const result = await emisoresDB.create(emisorData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear el emisor:", error);
    res.status(500).json({ error: "Error al crear el emisor" });
  }
});

//Filtrar dependencia por parametros
router.post("/search", async (req, res) => {
  let {nombre,estado} = req.body;
  console.log("parametros:",nombre,estado);
  let { page , limite } = req.query;
  limite = parseInt(limite, 10) || 10;
  page = parseInt(page, 10) || 1;
  try {
    // Si hay otros parámetros, filtrar por ellos
    const offset = (page - 1) * limite;
    //Get the total count of results
    const { data, totalResults } =
      await emisoresDB.searchEmisorByParameters(
        nombre,
        estado,
        limite,
        offset,
      );
    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({
          error: "No se encontró los emisores que coincidan con su búsqueda",
        });
    }
    res.status(200).json({ data, totalResults });
  } catch (err) {
    console.log("Error al buscar el emisor", err);
    res.status(500).json({ error: "Error al buscar el emisor" });
  }
});

export default router;
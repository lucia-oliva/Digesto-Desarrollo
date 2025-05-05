import normativaDB from "../services/normativa.js";
import express from "express";

//TODO: A la hora de hacer auditorias, verificar en la funcion de eliminar normativas
//se se elimina todo lo que corresponde, al igual que la funcion de editar. 


const router = express.Router();

router.get("/id/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const normativas = await normativaDB.searchById(id);
    res.json(normativas);
  } catch (error) {
    console.log("Error al obtener las normativas", error);
    res.status(500).json({ error: "Error al obtener las normativas" });
  }
});

//Eliminar normativa por id

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await normativaDB.deleteNormativaById(id);
    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error al eliminar la normativa:", error);
    res.status(500).json({ error: "Error al eliminar la normativa" });
  }
});

//Filtrar normativa por parametros
router.post("/search", async (req, res) => {
  let { numero, emisor, documento, anio, tags } = req.body;
  let { dependencia } = req.query;
  console.log("parametros:", numero,emisor,documento,anio,tags,dependencia);
  if (!dependencia) {
    dependencia = req.body.dependencia;
  }
  let { page } = req.query;
  let limite = 10;
  page = parseInt(page, 10) || 1;
  try {
    // Si hay otros parámetros, filtrar por ellos
    const offset = (page - 1) * limite;
    //Get the total count of results
    const { normativas, totalResults } =
      await normativaDB.searchNormativaByParameters(
        numero,
        dependencia,
        emisor,
        documento,
        anio,
        limite,
        offset,
        tags
      );

    if (!normativas || normativas.length === 0) {
      return res
        .status(404)
        .json({
          error: "No se encontró la normativa que coincida con su búsqueda",
        });
    }

    res.status(200).json({ normativas, totalResults });
  } catch (err) {
    console.log("Error al buscar la normativa", err);
    res.status(500).json({ error: "Error al buscar la normativa" });
  }
});

//Filtrar normativas por tags
router.get("/search/tag", async (req, res) => {
  let { dependencia } = req.query;
  if (!dependencia) {
    dependencia = req.body.dependencia;
  }
  let { tags } = req.body;
  if (tags.length === 0 || !tags) {
    return res
      .status(400)
      .json({ error: "Debe especificar al menos un tag para la búsqueda" });
  }
  try {
    const normativa = await normativaDB.searchNormativasByTags(
      dependencia,
      tags
    );
    if (!normativa || normativa.length === 0) {
      return res
        .status(400)
        .json({
          error:
            "No se encontraron normativas para los parametros proporcionados",
        });
    }
    res.status(200).json({ normativas, totalResults });
  } catch (err) {
    console.log("Error al buscar las normativas", err);
    res.status(500).json({ error: "Error al realizar la busqueda" });
  }
});

//Filtrar años de las normativas

router.get("/yearNormativa", async (req, res) => {
  try {
    const years = await normativaDB.getAllYears();
    if (!years) {
      return res
        .status(404)
        .json({ error: "No se encontraron anios de normativas" });
    }
    res.json(years);
    
  } catch (err) {
    console.log("Error al obtener los anios de normativas", error);
    res.status(500).json({ error: "Error al obtener los anios de normativa" });
  }
});

//Filtrar normativas por anio

router.get("/year/:year", async (req, res) => {
  let { year } = req.params;
  year = parseInt(year, 10);

  if (isNaN(year) || !Number.isInteger(year)) {
    return res
      .status(400)
      .json({ error: "El año debe ser un número entero válido" });
  }

  try {
    const normativa = await normativaDB.searchByNumber(year);
    if (!normativa) {
      return res
        .status(404)
        .json({ error: "No se encontró la normativa para el año solicitado" });
    }
    res.json(normativa);
  } catch (err) {
    console.log("Error al obtener la normativa del año", error);
    res.status(500).json({ error: "Error al obtener la normativa del año" });
  }
});

//Obtener todas las normativas
router.get("/normativas", async (req, res) => {
  try {
    const normativas = await normativaDB.getAllNormativas();
    res.json(normativas);
  } catch (error) {
    console.log("Error al obtener las normativas", error);
    res.status(500).json({ error: "Error al obtener las normativas" });
  }
});


//Normativas eliminadas 

router.get("/deleted", async (req, res) => {
  try{
    const normativas = await normativaDB.getEliminatedNormatives();
    res.json(normativas);
  }catch (error) {
    console.log("Error al obtener las normativas eliminadas", error);
    res.status(500).json({ error: "Error al obtener las normativas eliminadas" });
  }

});

//Filtrar normativas mas buscadas
router.get("/mas-buscadas", function (req, res) {
  normativaDB
    .getMostPopularNormatives()
    .then((getMostPopularNormatives) => {
      res.json(getMostPopularNormatives);
    })
    .catch((error) => {
      console.error("Error al obtener las normativas más buscadas:", error);
      res
        .status(500)
        .json({ error: "Error al obtener las normativas mas buscadas" });
    });
});

//Obtener tags de normativa

router.get("/tags/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tags = await normativaDB.getTagsByNormativaId(id);
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error al obtener los tags:", error);
    res.status(500).json({ error: "Error al obtener los tags" });
  }
});

export default router;

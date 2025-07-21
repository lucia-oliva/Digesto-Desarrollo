import normativaDB from "../services/normativa.js";
import express from "express";


//TODO: A la hora de hacer auditorias, verificar en la funcion de eliminar normativas
//se se elimina todo lo que corresponde, al igual que la funcion de editar. 

const router = express.Router();


//editar normativa
router.post("/edit", async (req, res) => {
  console.log("Cuerpo de la solicitud:", req.body);
  const normativaDataEdit = req.body;
  try {
    const result = await normativaDB.edit(normativaDataEdit);
    if (result.success) {
      res.status(200).json({ message: "Normativa editada correctamente." });
    } else {
      res.status(400).json({ error: result.mensaje });
    }
  } catch (error) {
    console.error("Error al editar la normativa:", error);
    res.status(500).json({ error: "Error al editar la normativa" });
  }
});

//Crear normativa
router.post("/create", async (req, res) => {
   // Obtener el ID 
  console.log("lo que llega del front...", req.body);
  const normativaData = req.body;
  console.log("Datos recibidos para crear normativa:", normativaData);
  // Validaciones básicas
  if (!normativaData.numero || !normativaData.titulo || !normativaData.fecha) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  try {
    const result = await normativaDB.create(normativaData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear la normativa:", error);
    res.status(500).json({ error: "Error al crear la normativa" });
  }
});

//Obtener normativa por id
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

router.delete("/eliminar/:id", async (req, res) => {
  const id = req.params.id;
  const userId = req.headers["x-user-id"]; 
  console.log(userId);
  if (!userId) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }
  try {
    const result = await normativaDB.eliminar(id,userId);
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
  let { page , limite } = req.query;
  page = parseInt(page, 10) || 1;
  limite = parseInt(limite, 10) || 10;
  try {
    // Si hay otros parámetros, filtrar por ellos
    const offset = (page - 1) * limite;
    //Get the total count of results
    const { data, totalResults } =
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

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({
          error: "No se encontró la normativa que coincida con su búsqueda",
        });
    }

    res.status(200).json({ data, totalResults });
  } catch (err) {
    console.log("Error al buscar la normativa", err);
    res.status(500).json({ error: "Error al buscar la normativa" });
  }
});

//Buscar normativas despublicadas 
router.post("/searchDespublicadas", async (req, res) => {
  let { numero, emisor, documento, anio, tags } = req.body;
  let { dependencia } = req.query;
  console.log("parametros:", numero,emisor,documento,anio,tags,dependencia);
  if (!dependencia) {
    dependencia = req.body.dependencia;
  }
  let { page , limite } = req.query;
  page = parseInt(page, 10) || 1;
  limite = parseInt(limite, 10) || 10;
  try {
    // Si hay otros parámetros, filtrar por ellos
    const offset = (page - 1) * limite;
    //Get the total count of results
    const { data, totalResults } =
      await normativaDB.searchNormativaDespublicadas(
        numero,
        dependencia,
        emisor,
        documento,
        anio,
        limite,
        offset,
        tags
      );

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({
          error: "No se encontró la normativa que coincida con su búsqueda",
        });
    }

    res.status(200).json({ data, totalResults });
  } catch (err) {
    console.log("Error al buscar la normativa", err);
    res.status(500).json({ error: "Error al buscar la normativa" });
  }
});


//Buscar normativas eliminadas 
router.post("/searchEliminadas", async (req, res) => {
  let { numero, emisor, documento, anio, tags } = req.body;
  let { dependencia } = req.query;
  console.log("parametros:", numero,emisor,documento,anio,tags,dependencia);
  if (!dependencia) {
    dependencia = req.body.dependencia;
  }
  let { page , limite } = req.query;
  page = parseInt(page, 10) || 1;
  limite = parseInt(limite, 10) || 10;
  try {
    // Si hay otros parámetros, filtrar por ellos
    const offset = (page - 1) * limite;
    //Get the total count of results
    const { data, totalResults } =
      await normativaDB.searchNormativaEliminadas(
        numero,
        dependencia,
        emisor,
        documento,
        anio,
        limite,
        offset,
        tags
      );

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({
          error: "No se encontró la normativa que coincida con su búsqueda",
        });
    }

    res.status(200).json({ data, totalResults });
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
      res.status(200).json(getMostPopularNormatives);
    })
    .catch((error) => {
      console.error("Error al obtener las normativas más buscadas:", error);
      res.status(500).json({ error: "Error al obtener las normativas más buscadas" });
    });
});



//Actualizar normativa por id

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const normativaData = req.body;

  try {
    const result = await normativaDB.updateNormativa(id, normativaData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al actualizar la normativa:", error);
    res.status(500).json({ error: "Error al actualizar la normativa" });
  }
});

//edit normativa
router.put("/edit", async (req, res) => {
  const normativaData = req.body;
  try {
    const result = await normativaDB.edit(normativaData);
    if (result.success) {
      res.status(200).json({ message: "Normativa editada correctamente." });
    } else {
      res.status(400).json({ error: result.mensaje });
    }
  } catch (error) {
    console.error("Error al editar la normativa:", error);
    res.status(500).json({ error: "Error al editar la normativa" });
  }
});


export default router;

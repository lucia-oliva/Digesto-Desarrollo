import dependenciaDB from "../services/dependencia.js";
import express from "express";

const router = express.Router();


router.post("/create", async (req, res) => {
  const dependenciaData = req.body;
  try {
    const result = await dependenciaDB.create(dependenciaData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear la dependencia:", error);
    res.status(500).json({ error: "Error al crear la dependencia" });
  }
});

router.get("/", async (req, res) => {
  const dependencias = await dependenciaDB.getAllDependencias();
  res.json(dependencias);
});

router.get("/name", async (req, res) => {
    try{
        const dependencias = await dependenciaDB.getAllNamesDependencias();
    res.json(dependencias);
    }catch(err){
        console.log("No se puedo mostrar las dependencias",err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const users = await dependenciaDB.getUsuarioById(id);
  res.json(users);
});

router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const users = await dependenciaDB.createUsuario(data);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const data = req.params.id;
  try {
    const users = await dependenciaDB.deleteUsuario(data);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id; // Capturamos el ID desde la URL
  const data = req.body; // Capturamos los datos del usuario desde el cuerpo

  try {
    const result = await dependenciaDB.updateUsuario(id, data);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado o sin cambios" });
    }
    
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      await dependenciaDB.searchDependenciaByParameters(
        nombre,
        estado,
        limite,
        offset,
      );
    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({
          error: "No se encontró las dependencias que coincidan con su búsqueda",
        });
    }
    res.status(200).json({ data, totalResults });
  } catch (err) {
    console.log("Error al buscar la dependencia", err);
    res.status(500).json({ error: "Error al buscar la dependencia" });
  }
});


export default router;
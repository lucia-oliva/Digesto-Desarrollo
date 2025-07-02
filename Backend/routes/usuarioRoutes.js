import UsuariosDB from "../services/usuarios.js";
import express from "express";

const router = express.Router();

router.post("/create", async (req, res) => {
    const usuarioData = req.body;
    try{
      const result = await UsuariosDB.create(usuarioData);
      res.status(201).json(result);
    }catch(error){
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error al crear el usuario" });
    }
});

//Editar usuario
router.post("/edit", async (req, res) => {
  console.log("Cuerpo de la solicitud:", req.body);
  const usuarioDataEdit = req.body;
  try {
    const result = await UsuariosDB.edit(usuarioDataEdit);
    if (result) {
      res.status(200).json({ message: "Usuario editado correctamente." });
    } else {
      res.status(400).json({ error: "No se pudo editar el usuario." });
    }
  } catch (error) {
    console.error("Error al editar el usuario:", error);
    res.status(500).json({ error: "Error al editar el usuario" });
}});

//Mostrar todos los usuarios
async function getAllUsuarios() {
  const sql = "SELECT nombre,email,telefono,id_dependencia  FROM usuario";
  const results = await db.query(sql);
  return results;
}


router.get("/", async (req, res) => {
  const users = await UsuariosDB.getAllUsuarios();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const users = await UsuariosDB.getUsuarioById(id);
  res.json(users);
});

router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const users = await UsuariosDB.createUsuario(data);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const data = req.params.id;
  try {
    const users = await UsuariosDB.deleteUsuario(data);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await UsuariosDB.updateUsuario(req.params.id, req.body);
    res.json({ success: true, message: "Usuario actualizado" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/filter/:id", async (req, res) => {
  const id = req.params.id;
  try{
  const users = await UsuariosDB.filterUsuariosporDepartament(id);
  res.json(users);
    if(users.affectedRows === 0){
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    }catch(error){
    res.status(500).json({ error: error.message });
  }
});

router.post("/userEmail", async (req, res) => {
  const {email} = req.body;
  console.log("Datos recibimos:", email);
  
  if (!email) {
    return res.status(400).json({ error: "Faltan parámetros 'email'" });
  }

  try{
  const result = await UsuariosDB.UsuarioByEmailAndEstado(email);

    if(result.affectedRows === 0){
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result);
    }catch(error){
    res.status(500).json({ error: error.message });
  }
});

//Filtrar usuarios por parametros
router.post("/search", async (req, res) => {
  let {tipoUsuario,nombre,estado} = req.body;
  let {dependencia} = req.query;
  if (!dependencia) {
    dependencia = req.body.dependencia;
  }
  let { page , limite } = req.query;
  limite = parseInt(limite, 10) || 10;
  page = parseInt(page, 10) || 1;
  try {
    // Si hay otros parámetros, filtrar por ellos
    const offset = (page - 1) * limite;
    //Get the total count of results
    const { data, totalResults } =
      await UsuariosDB.searchUsuariosByParameters(
        tipoUsuario,
        nombre,
        dependencia,
        estado,
        limite,
        offset,
      );
    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({
          error: "No se encontró los usuarios que coincidan con su búsqueda",
        });
    }
    res.status(200).json({ data, totalResults });
  } catch (err) {
    console.log("Error al buscar el usuario", err);
    res.status(500).json({ error: "Error al buscar el usuario" });
  }
});

export default router;

import UsuariosDB from "../services/usuarios.js";
import express from "express";

const router = express.Router();

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
  console.log("Resultado de la consulta:", result);

    if(result.affectedRows === 0){
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result);
    }catch(error){
    res.status(500).json({ error: error.message });
  }
});
export default router;

import dependenciaDB from "../services/dependencia.js";
import express from "express";

const router = express.Router();

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

export default router;
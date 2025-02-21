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

export default router;

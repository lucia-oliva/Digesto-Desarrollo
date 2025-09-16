import express from "express";
import UsuariosDB from "../services/usuarios.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();


//Cambiar estado (activar/desactivar)
router.post(
  "/cambiar-estado",
  asyncHandler(async (req, res) => {
    const { id_usuario, nuevo_estado } = req.body;
    const result = await UsuariosDB.cambiarEstado({
      id_usuario,
      nuevo_estado
      });
    res.status(200).json({
      ok: true,
      message: result.mensaje,
      ...(result.noChange ? { noChange: true } : {}),
    });
  })
);

// Crear usuario
router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const usuarioData = req.body;
    const result = await UsuariosDB.create(usuarioData);
    res.status(201).json({ ok: true, message: result.mensaje });
  })
);

// Editar usuario
router.post(
  "/edit",
  asyncHandler(async (req, res) => {
    const usuarioDataEdit = req.body;
    const result = await UsuariosDB.edit(usuarioDataEdit);
    res.status(200).json({ ok: true, message: result.mensaje });
  })
);

// Mostrar todos los usuarios
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await UsuariosDB.getAllUsuarios();
    res.json(users);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const users = await UsuariosDB.getUsuarioById(id);
    res.json(users);
  })
);

router.get(
  "/datos/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const users = await UsuariosDB.getUsuarioByIdDatos(id);
    res.json(users);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = req.body;
    const users = await UsuariosDB.createUsuario(data);
    res.json(users);
  })
);

router.delete(
  "/eliminar/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await UsuariosDB.eliminar(id);
    if(result.affectedRows === 0){
      const err = new Error("Error al eliminar el usuario, usuario no encontrado o ya eliminado");
      err.status = 404;
      throw err;
    }
    res.status(200).json({ ok: true, message: "Usuario eliminado correctamente" });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    await UsuariosDB.updateUsuario(req.params.id, req.body);
    res.json({ success: true, message: "Usuario actualizado" });
  })
);

router.get(
  "/filter/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const users = await UsuariosDB.filterUsuariosporDepartament(id);
    if (!users || users.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(users);
  })
);

router.post(
  "/userEmail",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Faltan parámetros 'email'" });
    }
    const result = await UsuariosDB.UsuarioByEmailAndEstado(email);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result);
  })
);

// Filtrar usuarios por parámetros
router.post(
  "/search",
  asyncHandler(async (req, res) => {
    let { tipoUsuario, nombre, estado } = req.body;
    let {
      dependencia = req.body.dependencia,
      page = 1,
      limite = 10,
    } = req.query;

    limite = parseInt(limite, 10) || 10;
    page = parseInt(page, 10) || 1;
    const offset = (page - 1) * limite;

    const { data, totalResults } = await UsuariosDB.searchUsuariosByParameters(
      tipoUsuario,
      nombre,
      dependencia,
      estado,
      limite,
      offset
    );
    res.status(200).json({ data, totalResults });
  })
);

export default router;

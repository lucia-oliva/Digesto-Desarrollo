import dependenciaDB from "../services/dependencia.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/datos/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const dependencia = await dependenciaDB.getDepenendenciaById(id);
      if (!dependencia) {
        return res.status(404).json({ error: "Dependencia no encontrada" });
      }
      res.json(dependencia);
    } catch (error) {
      console.error("Error al obtener la dependencia:", error);
      res.status(500).json({ error: "Error al obtener la dependencia" });
    }
  })
);

router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const dependenciaData = req.body;
    try {
      const result = await dependenciaDB.create(dependenciaData);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error al crear la dependencia:", error);
      res.status(500).json({ error: "Error al crear la dependencia" });
    }
  })
);

router.post(
  "/edit",
  asyncHandler(async (req, res) => {
    console.log("Cuerpo de la solicitud:", req.body);
    const dependenciaDataEdit = req.body;
    try {
      const result = await dependenciaDB.edit(dependenciaDataEdit);
      if (result.success) {
        res.status(200).json({ message: "Dependencia editada correctamente." });
      } else {
        res.status(400).json({ error: result.mensaje });
      }
    } catch (error) {
      console.error("Error al editar la dependencia:", error);
      res.status(500).json({ error: "Error al editar la dependencia" });
    }
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const dependencias = await dependenciaDB.getAllDependencias();
    res.json(dependencias);
  })
);


router.get(
  "/getDependencias",
  asyncHandler(async (req, res) => {
    const dependencias = await dependenciaDB.getDependencias();
    res.json(dependencias);
  })
);


router.get(
  "/sesiones",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limite = parseInt(req.query.limite) || 10;
    try {
      const { data, totalResults } = await dependenciaDB.getSesionesPaginado(
        page,
        limite
      );
      res.json({ data, totalResults });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

router.get(
  "/name",
  asyncHandler(async (req, res) => {
    try {
      const dependencias = await dependenciaDB.getAllNamesDependencias();
      res.json(dependencias);
    } catch (err) {
      console.log("No se puedo mostrar las dependencias", err);
      res.status(500).json({ error: err.message });
    }
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const users = await dependenciaDB.getUsuarioById(id);
    res.json(users);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = req.body;
    try {
      const users = await dependenciaDB.createUsuario(data);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = req.params.id;
    try {
      const users = await dependenciaDB.deleteUsuario(data);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id; 
    const data = req.body; 

    try {
      const result = await dependenciaDB.updateUsuario(id, data);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Usuario no encontrado o sin cambios" });
      }

      res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);


router.post(
  "/search",
  asyncHandler(async (req, res) => {
    let { nombre, estado } = req.body;
    console.log("parametros:", nombre, estado);
    let { page, limite } = req.query;
    limite = parseInt(limite, 10) || 10;
    page = parseInt(page, 10) || 1;
    try {
      const offset = (page - 1) * limite;
      const { data, totalResults } =
        await dependenciaDB.searchDependenciaByParameters(
          nombre,
          estado,
          limite,
          offset
        );
      if (!data || data.length === 0) {
        return res.status(404).json({
          error:
            "No se encontró las dependencias que coincidan con su búsqueda",
        });
      }
      res.status(200).json({ data, totalResults });
    } catch (err) {
      console.log("Error al buscar la dependencia", err);
      res.status(500).json({ error: "Error al buscar la dependencia" });
    }
  })
);

router.delete(
  "/eliminar/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
      const result = await dependenciaDB.eliminar(id);
      if (result.affectedRows === 0) {
        const err = new Error("Dependencia no encontrada o ya eliminado");
        err.status = 404;
        throw err;
      }
       res.status(200).json({ ok: true, msg: "Dependencia eliminada correctamente" });
  })
);

export default router;

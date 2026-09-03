import dependenciaDB from "../services/dependencia.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticateToken } from "../Middleware/authMiddleware.js";
import { authorizePolicy } from "../Middleware/rbacMiddleware.js";
import { POLICIES } from "../security/policies.js";

const router = express.Router();

router.get(
  "/datos/:id",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
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
  }),
);

router.post(
  "/create",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const dependenciaData = req.body;
    try {
      const result = await dependenciaDB.create(dependenciaData);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error al crear la dependencia:", error);
      res.status(500).json({ error: "Error al crear la dependencia" });
    }
  }),
);

router.post(
  "/edit",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
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
  }),
);

router.get(
  "/",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const dependencias = await dependenciaDB.getAllDependencias();
    res.json(dependencias);
  }),
);

router.get(
  "/getDependencias",
  asyncHandler(async (req, res) => {
    const dependencias = await dependenciaDB.getDependencias();
    res.json(dependencias);
  }),
);

router.get(
  "/sesiones",
  authenticateToken,
  authorizePolicy(POLICIES.CONSEJO, {
    getUserDependency: (req) =>
      dependenciaDB.getDepenendenciaById(req.user.dependenciaId),
  }),

  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page);
    const limite = parseInt(req.query.limite);

    try {
      const { data, totalResults } = await dependenciaDB.getSesionesPaginado(
        page,
        limite,
      );

      res.json({
        data,
        totalResults,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }),
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
  }),
);

router.post(
  "/search",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
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
          offset,
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
  }),
);

router.delete(
  "/eliminar/:id",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await dependenciaDB.eliminar(id);
    if (result.affectedRows === 0) {
      const err = new Error("Dependencia no encontrada o ya eliminado");
      err.status = 404;
      throw err;
    }
    res
      .status(200)
      .json({ ok: true, msg: "Dependencia eliminada correctamente" });
  }),
);

export default router;

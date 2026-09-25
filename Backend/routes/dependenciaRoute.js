import dependenciaDB from "../services/dependencia.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticateToken } from "../Middleware/authMiddleware.js";
import { authorizePolicy } from "../Middleware/rbacMiddleware.js";
import { POLICIES } from "../security/policies.js";
import { httpError } from "../utils/httpError.js";
import {
  normalizeOptionalFields,
  validateRequiredFields,
} from "../utils/requestValidation.js";

const router = express.Router();

const DEPENDENCIA_REQUIRED_FIELDS = [
  { key: "nombre", label: "nombre" },
  { key: "estado", label: "estado" },
];

const DEPENDENCIA_EDIT_REQUIRED_FIELDS = [
  { key: "id", label: "id" },
  ...DEPENDENCIA_REQUIRED_FIELDS,
];

const DEPENDENCIA_OPTIONAL_DEFAULTS = {
  nombre_completo: "",
  codificacion: "",
};

router.get(
  "/datos/:id",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const dependencia = await dependenciaDB.getDepenendenciaById(id);

    if (!dependencia) {
      throw httpError(404, "Dependencia no encontrada.");
    }

    return res.json(dependencia);
  }),
);

router.post(
  "/create",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  validateRequiredFields(DEPENDENCIA_REQUIRED_FIELDS),
  normalizeOptionalFields(DEPENDENCIA_OPTIONAL_DEFAULTS),
  asyncHandler(async (req, res) => {
    const dependenciaData = req.body;
    const result = await dependenciaDB.create(dependenciaData);

    return res.status(201).json(result);
  }),
);

router.post(
  "/edit",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  validateRequiredFields(DEPENDENCIA_EDIT_REQUIRED_FIELDS),
  normalizeOptionalFields(DEPENDENCIA_OPTIONAL_DEFAULTS),
  asyncHandler(async (req, res) => {
    const dependenciaDataEdit = req.body;
    const result = await dependenciaDB.edit(dependenciaDataEdit);

    if (!result.success) {
      throw httpError(400, result.mensaje);
    }

    return res.status(200).json({
      message: "Dependencia editada correctamente.",
    });
  }),
);

router.get(
  "/",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const dependencias = await dependenciaDB.getAllDependencias();

    return res.json(dependencias);
  }),
);

router.get(
  "/getDependencias",
  asyncHandler(async (req, res) => {
    const dependencias = await dependenciaDB.getDependencias();

    return res.json(dependencias);
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
    const page = parseInt(req.query.page, 10);
    const limite = parseInt(req.query.limite, 10);

    const { data, totalResults } =
      await dependenciaDB.getSesionesPaginado(page, limite);

    return res.json({
      data,
      totalResults,
    });
  }),
);

router.get(
  "/name",
  asyncHandler(async (req, res) => {
    const dependencias = await dependenciaDB.getAllNamesDependencias();

    return res.json(dependencias);
  }),
);

router.post(
  "/search",
  authenticateToken,
  authorizePolicy(POLICIES.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const { nombre, estado } = req.body;
    let { page, limite } = req.query;

    limite = parseInt(limite, 10) || 10;
    page = parseInt(page, 10) || 1;

    const offset = (page - 1) * limite;

    const { data, totalResults } =
      await dependenciaDB.searchDependenciaByParameters(
        nombre,
        estado,
        limite,
        offset,
      );

    if (!data || data.length === 0) {
      throw httpError(
        404,
        "No se encontraron dependencias que coincidan con la búsqueda.",
      );
    }

    return res.status(200).json({
      data,
      totalResults,
    });
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
      const err = new Error(
        "Dependencia no encontrada o ya eliminada",
      );
      err.status = 404;
      throw err;
    }

    return res.status(200).json({
      ok: true,
      msg: "Dependencia eliminada correctamente",
    });
  }),
);

export default router;
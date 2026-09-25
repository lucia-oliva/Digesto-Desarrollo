import express from "express";
import normativaDB from "../services/normativa.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  authenticateToken,
  optionalAuthenticateToken,
} from "../Middleware/authMiddleware.js";
import { authorizePolicy } from "../Middleware/rbacMiddleware.js";
import { POLICIES } from "../security/policies.js";
import { ROLES } from "../security/roles.js";
import { getAuthorizedDependency } from "../security/accessScope.js";
import {
  validateRequiredFields,
} from "../utils/requestValidation.js";

const router = express.Router();

function getPagination(req, defaultLimit = 10) {
  let { page, limite } = req.query;
  const p = parseInt(page, 10) || 1;
  const l = parseInt(limite, 10) || defaultLimit;
  const offset = (p - 1) * l;
  return { page: p, limite: l, offset };
}


function attachAuthenticatedUserToBody(req, _res, next) {
  req.body.user = {
    ...(req.body.user || {}),
    id: req.user?.sub,
  };

  next();
}

const NORMATIVA_CREATE_REQUIRED_FIELDS = [
  { key: "numero", label: "número" },
  { key: "anio", label: "año" },
  { key: "titulo", label: "título" },
  { key: "resumen", label: "resumen" },
  { key: "fecha", label: "fecha" },
  { key: "dependencia", label: "dependencia" },
  { key: "emisor", label: "emisor" },
  { key: "tipo_normativa", label: "tipo de normativa" },
  { key: "estado", label: "estado" },
  { key: "tags", label: "tags" },
];

const NORMATIVA_EDIT_REQUIRED_FIELDS = [
  { key: "id", label: "id" },
  { key: "numero", label: "número" },
  { key: "anio", label: "año" },
  { key: "titulo", label: "título" },
  { key: "resumen", label: "resumen" },
  { key: "fecha_normativa", label: "fecha" },
  { key: "id_dependencia", label: "dependencia" },
  { key: "id_emisor", label: "emisor" },
  { key: "id_tipo_normativa", label: "tipo de normativa" },
  { key: "estado", label: "estado" },
  { key: "tags", label: "tags" },
];

router.get(
  "/datos/:id",

  optionalAuthenticateToken,

  authorizePolicy(POLICIES.PUBLIC_PUBLISHED, {
    getResourceAccessContext: (req) =>
      normativaDB.getNormativaAccessContext(req.params.id),
  }),

  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await normativaDB.getNormativaCompletaById(id);

    res.json(data);
  }),
);

router.post(
  "/edit",
  authenticateToken,
  validateRequiredFields(NORMATIVA_EDIT_REQUIRED_FIELDS),
  authorizePolicy(POLICIES.NORM_ADMIN, {
    getResourceDependencyId: (req) =>
      normativaDB.getNormativaDependencyById(req.body.id),

    getTargetDependencyId: (req) => req.body.id_dependencia,
  }),
  asyncHandler(async (req, res) => {
    const result = await normativaDB.edit(req.body);

    res.status(200).json({
      ok: true,
      ...result,
    });
  }),
);

router.post(
  "/create",
  authenticateToken,
  attachAuthenticatedUserToBody,
  validateRequiredFields(NORMATIVA_CREATE_REQUIRED_FIELDS),
  authorizePolicy(POLICIES.NORM_ADMIN, {
    getTargetDependencyId: (req) => req.body.dependencia,
  }),
  asyncHandler(async (req, res) => {
    const result = await normativaDB.create(req.body);

    res.status(201).json({
      ok: true,
      ...result,
    });
  }),
);

router.get(
  "/traer/:id",
  authenticateToken,
  authorizePolicy(POLICIES.NORM_ADMIN, {
    getResourceDependencyId: (req) =>
      normativaDB.getNormativaDependencyById(req.params.id),
  }),
  asyncHandler(async (req, res) => {
    const row = await normativaDB.searchById(req.params.id);

    res.json({ data: row });
  }),
);

router.delete(
  "/eliminar/:id",
  authenticateToken,
  authorizePolicy(POLICIES.NORM_ADMIN, {
    getResourceDependencyId: (req) =>
      normativaDB.getNormativaDependencyById(req.params.id),
  }),
  asyncHandler(async (req, res) => {
    const userId = req.header("x-user-id");

    if (!userId) {
      throw httpError(401);
    }

    const result = await normativaDB.eliminar(req.params.id, userId);

    res.status(200).json({
      ok: true,
      ...result,
    });
  }),
);

router.post(
  "/search",
  asyncHandler(async (req, res) => {
    const {
      numero,
      emisor,
      documento,
      anio,
      fechaOrder,
      visitasOrder,
      resumen,
    } = req.body;
    const dependencia = req.query.dependencia ?? req.body.dependencia ?? null;
    const { limite, offset } = getPagination(req, 10);

    const { data, totalResults } =
      await normativaDB.searchNormativaByParameters(
        numero,
        dependencia,
        emisor,
        documento,
        anio,
        limite,
        offset,
        fechaOrder,
        visitasOrder,
        resumen,
      );

    res.status(200).json({ ok: true, data: data || [], totalResults });
  }),
);

router.post(
  "/searchEliminadas",
  authenticateToken,
  authorizePolicy(POLICIES.NORM_ADMIN, {
    getTargetDependencyId: (req) => req.user.dependenciaId,
  }),
  asyncHandler(async (req, res) => {
    const {
      numero,
      emisor,
      documento,
      anio,
      fechaOrder,
      visitasOrder,
      resumen,
    } = req.body;
    const dependencia = getAuthorizedDependency(req);
    const { limite, offset } = getPagination(req, 10);

    const { data, totalResults } =
      await normativaDB.searchNormativaEliminadaByParameters(
        numero,
        dependencia,
        emisor,
        documento,
        anio,
        limite,
        offset,
        fechaOrder,
        visitasOrder,
        resumen,
      );

    res.status(200).json({ ok: true, data: data || [], totalResults });
  }),
);

router.post(
  "/searchDespublicadas",
  authenticateToken,
  authorizePolicy(POLICIES.NORM_ADMIN, {
    getTargetDependencyId: (req) => req.user.dependenciaId,
  }),
  asyncHandler(async (req, res) => {
    const {
      numero,
      emisor,
      documento,
      anio,
      fechaOrder,
      visitasOrder,
      resumen,
    } = req.body;
    const dependencia = getAuthorizedDependency(req);
    const { limite, offset } = getPagination(req, 10);

    const { data, totalResults } =
      await normativaDB.searchNormativaDespublicadasByParameters(
        numero,
        dependencia,
        emisor,
        documento,
        anio,
        limite,
        offset,
        fechaOrder,
        visitasOrder,
        resumen,
      );

    res.status(200).json({ ok: true, data: data || [], totalResults });
  }),
);

router.post(
  "/publicar/:id",
  authenticateToken,
  authorizePolicy(POLICIES.PUBLISH_NORM, {
    getResourceDependencyId: (req) =>
      normativaDB.getNormativaDependencyById(req.params.id),
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const userId = req.header("x-user-id") || req.body.userId || null;

    const result = await normativaDB.publicar(id, userId);

    res.status(200).json({
      ok: true,
      ...result,
    });
  }),
);

router.get(
  "/yearNormativa",
  asyncHandler(async (_req, res) => {
    const years = await normativaDB.getAllYears();
    res.json({ data: years || [] });
  }),
);

router.get(
  "/deleted",
  authenticateToken,
  authorizePolicy(POLICIES.NORM_ADMIN, {
    getTargetDependencyId: (req) => req.user.dependenciaId,
  }),
  asyncHandler(async (req, res) => {
    const isSuperAdmin = req.user.roles.includes(ROLES.SUPER_ADMIN);

    const dependenciaId = isSuperAdmin ? null : req.user.dependenciaId;

    const rows = await normativaDB.getEliminatedNormatives(dependenciaId);

    res.json({
      ok: true,
      data: rows || [],
    });
  }),
);

router.get(
  "/mas-buscadas",
  asyncHandler(async (_req, res) => {
    const rows = await normativaDB.getMostPopularNormatives();
    res.status(200).json(rows);
  }),
);

router.post(
  "/restaurar/:id",
  authenticateToken,
  authorizePolicy(POLICIES.NORM_ADMIN, {
    getResourceDependencyId: (req) =>
      normativaDB.getNormativaDependencyById(req.params.id),
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.header("x-user-id") || req.body.userId || null;

    const result = await normativaDB.restaurar(id, userId);

    res.status(200).json({
      ok: true,
      ...result,
    });
  }),
);

export default router;

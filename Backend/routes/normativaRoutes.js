import express from "express";
import normativaDB from "../services/normativa.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
function getPagination(req, defaultLimit = 10) {
  let { page, limite } = req.query;
  const p = parseInt(page, 10) || 1;
  const l = parseInt(limite, 10) || defaultLimit;
  const offset = (p - 1) * l;
  return { page: p, limite: l, offset };
}

router.get(
  "/datos/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await normativaDB.getNormativaCompletaById(id);
    res.json(data);
  }),
);

router.post(
  "/edit",
  asyncHandler(async (req, res) => {
    const result = await normativaDB.edit(req.body);
    res.status(200).json({ ok: true, ...result });
  }),
);

router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const { numero, titulo, fecha } = req.body;
    if (!numero || !titulo || !fecha) {
      const err = new Error(
        "Faltan datos obligatorios (numero, titulo, fecha)",
      );
      err.status = 400;
      throw err;
    }
    const result = await normativaDB.create(req.body);
    res.status(201).json({ ok: true, ...result });
  }),
);

router.get(
  "/traer/:id",
  asyncHandler(async (req, res) => {
    const row = await normativaDB.searchById(req.params.id);
    res.json({ data: row });
  }),
);

router.delete(
  "/eliminar/:id",
  asyncHandler(async (req, res) => {
    const userId = req.header("x-user-id");
    if (!userId) {
      const err = new Error("Usuario no autenticado");
      err.status = 401;
      throw err;
    }
    const result = await normativaDB.eliminar(req.params.id, userId);
    res.status(200).json({ ok: true, ...result });
  }),
);

router.post(
  "/search",
  asyncHandler(async (req, res) => {
    const { numero, emisor, documento, anio, fechaOrder, visitasOrder, resumen} = req.body;
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
        resumen
      );
  
    res.status(200).json({ ok: true, data: data || [], totalResults }); 
  } 
)  
);

router.post(
  "/searchEliminadas",
  asyncHandler(async (req, res) => {
    const { numero, emisor, documento, anio, fechaOrder, visitasOrder, resumen} =
      req.body;
    const dependencia = req.query.dependencia ?? req.body.dependencia ?? null;
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
        resumen
      );

    res.status(200).json({ ok: true, data: data || [], totalResults });
  }),
);

router.post(
  "/searchDespublicadas",
  asyncHandler(async (req, res) => {
    const { numero, emisor, documento, anio, fechaOrder, visitasOrder, resumen } =
      req.body;
    const dependencia = req.query.dependencia ?? req.body.dependencia ?? null;
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
        resumen
      );

    res.status(200).json({ ok: true, data: data || [], totalResults });
  }),
);

router.post(
  "/publicar/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.header("x-user-id") || req.body.userId || null;
    const result = await normativaDB.publicar(id, userId);
    res.status(200).json({ ok: true, ...result });
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
  asyncHandler(async (_req, res) => {
    const rows = await normativaDB.getEliminatedNormatives();
    res.json({ ok: true, data: rows || [] });
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
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.header("x-user-id") || req.body.userId || null;
    const result = await normativaDB.restaurar(id, userId);
    res.status(200).json({ ok: true, ...result });
  }),
);

export default router;

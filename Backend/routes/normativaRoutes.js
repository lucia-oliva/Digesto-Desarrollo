// routes/normativas.js
import express from "express";
import normativaDB from "../services/normativa.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

/** Helper para extraer paginación */
function getPagination(req, defaultLimit = 10) {
  let { page, limite } = req.query;
  const p = parseInt(page, 10) || 1;
  const l = parseInt(limite, 10) || defaultLimit;
  const offset = (p - 1) * l;
  return { page: p, limite: l, offset };
}

/** -----------------------------------------
 * GET: datos completos para edición
 * ----------------------------------------*/
router.get(
  "/datos/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await normativaDB.getNormativaCompletaById(id); // lanza 404 si no existe
    res.json(data);
  })
);

/** -----------------------------------------
 * POST: editar (modo “wizard”)
 * El servicio lanza en errores (404/400) y devuelve { message }
 * ----------------------------------------*/
router.post(
  "/edit",
  asyncHandler(async (req, res) => {
    const result = await normativaDB.edit(req.body);
    res.status(200).json({ ok: true, ...result });
  })
);

/** -----------------------------------------
 * POST: crear
 * El servicio lanza en errores y devuelve { id, message }
 * ----------------------------------------*/
router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const { numero, titulo, fecha } = req.body;
    if (!numero || !titulo || !fecha) {
      const err = new Error(
        "Faltan datos obligatorios (numero, titulo, fecha)"
      );
      err.status = 400;
      throw err;
    }
    const result = await normativaDB.create(req.body);
    res.status(201).json({ ok: true, ...result });
  })
);

/** -----------------------------------------
 * GET: traer por id (vista pública/detalle)
 * El servicio lanza 404 si no existe
 * ----------------------------------------*/
router.get(
  "/traer/:id",
  asyncHandler(async (req, res) => {
    const row = await normativaDB.searchById(req.params.id);
    res.json({ data: row });
  })
);

/** -----------------------------------------
 * DELETE: soft-delete (marcar eliminada)
 * Requiere userId (x-user-id)
 * ----------------------------------------*/
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
  })
);

/** -----------------------------------------
 * POST: búsqueda avanzada (publicadas)
 * Devuelve 200 con data vacía (no 404) para mejor DX
 * ----------------------------------------*/
router.post(
  "/search",
  asyncHandler(async (req, res) => {
    const { numero, emisor, documento, anio, tags } = req.body;
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
        tags
      );

    res.status(200).json({ ok: true, data: data || [], totalResults });
  })
);

/** -----------------------------------------
 * POST: búsqueda de ELIMINADAS
 * ----------------------------------------*/
router.post(
  "/searchEliminadas",
  asyncHandler(async (req, res) => {
    const { numero, emisor, documento, anio, tags } = req.body;
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
        tags
      );

    res.status(200).json({ ok: true, data: data || [], totalResults });
  })
);

/** -----------------------------------------
 * POST: búsqueda de DESPUBLICADAS
 * ----------------------------------------*/
router.post(
  "/searchDespublicadas",
  asyncHandler(async (req, res) => {
    const { numero, emisor, documento, anio, tags } = req.body;
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
        tags
      );

    res.status(200).json({ ok: true, data: data || [], totalResults });
  })
);

/** -----------------------------------------
 * POST: búsqueda por TAGS
 * (cambié a POST: recibís array en body)
 * ----------------------------------------*/
router.post(
  "/search/tag",
  asyncHandler(async (req, res) => {
    const dependencia = req.query.dependencia ?? req.body.dependencia ?? null;
    const { tags } = req.body;

    if (!Array.isArray(tags) || tags.length === 0) {
      const err = new Error(
        "Debe especificar al menos un tag (array no vacío)"
      );
      err.status = 400;
      throw err;
    }

    const data = await normativaDB.searchNormativasByTags(dependencia, tags);
    res.status(200).json({ ok: true, data: data || [] });
  })
);

/** -----------------------------------------
 * POST: publicar
 * Servicio lanza 404/400 si corresponde
 * ----------------------------------------*/
router.post(
  "/publicar/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.header("x-user-id") || req.body.userId || null;
    const result = await normativaDB.publicar(id, userId);
    res.status(200).json({ ok: true, ...result });
  })
);

/** -----------------------------------------
 * GET: años disponibles
 * ----------------------------------------*/
router.get(
  "/yearNormativa",
  asyncHandler(async (_req, res) => {
    const years = await normativaDB.getAllYears();
    res.json({ data: years || [] });
  })
);

/** -----------------------------------------
 * GET: buscar por “número” (tu ruta decía year/:year pero llamaba searchByNumber)
 * Mantengo la firma pero devuelvo 404 si no hay
 * ----------------------------------------*/
router.get(
  "/year/:year",
  asyncHandler(async (req, res) => {
    const year = Number(req.params.year);
    if (!Number.isInteger(year)) {
      const err = new Error("El año debe ser un número entero válido");
      err.status = 400;
      throw err;
    }
    const row = await normativaDB.searchByNumber(year); // devuelve null si no hay
    if (!row) {
      const err = new Error(
        "No se encontró la normativa para el año solicitado"
      );
      err.status = 404;
      throw err;
    }
    res.json({ data: row });
  })
);

/** -----------------------------------------
 * GET: todas (top/últimas)
 * ----------------------------------------*/
router.get(
  "/normativas",
  asyncHandler(async (_req, res) => {
    const rows = await normativaDB.getAllNormativas();
    res.json({ data: rows || [] });
  })
);

/** -----------------------------------------
 * GET: eliminadas (listado)
 * ----------------------------------------*/
router.get(
  "/deleted",
  asyncHandler(async (_req, res) => {
    const rows = await normativaDB.getEliminatedNormatives();
    res.json({ ok: true, data: rows || [] });
  })
);

/** -----------------------------------------
 * GET: más buscadas
 * ----------------------------------------*/
router.get(
  "/mas-buscadas",
  asyncHandler(async (_req, res) => {
    const rows = await normativaDB.getMostPopularNormatives();
    res.status(200).json(rows);
  })
);

/** -----------------------------------------
 * PUT: actualizar (modo REST clásico)
 * ----------------------------------------*/
router.put(
  "/update/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await normativaDB.updateNormativa(id, req.body);
    res.status(200).json({ ok: true, ...result });
  })
);

/** -----------------------------------------
 * PUT: editar (ruta duplicada de “/edit”)
 * Si vas a mantenerla, que haga lo mismo que POST /edit
 * ----------------------------------------*/
router.put(
  "/edit",
  asyncHandler(async (req, res) => {
    const result = await normativaDB.edit(req.body);
    res.status(200).json({ ok: true, ...result });
  })
);

/** -----------------------------------------
 * POST: restaurar (eliminada → despublicado)
 * ----------------------------------------*/
router.post(
  "/restaurar/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.header("x-user-id") || req.body.userId || null;
    const result = await normativaDB.restaurar(id, userId);
    res.status(200).json({ ok: true, ...result });
  })
);

export default router;

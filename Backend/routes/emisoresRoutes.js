import emisoresDB from "../services/emisores.js";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Obtener datos de un emisor por ID
router.get(
  "/datos/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const emisor = await emisoresDB.getById(id);
    if (!emisor) {
      throw new Error("Emisor no encontrado", 404);
    }
    res.json(emisor);
  })
);

// Que uso tiene?? TODO CHECK
router.get(
  "/name",
  asyncHandler(async (req, res) => {
    const emisores = await emisoresDB.getAllEmisoresName();
    res.json(emisores);
  })
);

// Editar emisor
router.post(
  "/edit",
  asyncHandler(async (req, res) => {
    const emisorDataEdit = req.body;
    const result = await emisoresDB.edit(emisorDataEdit);
    res.status(200).json({ ok: true, msg: result.mensaje });
  })
);


//emisores para mapeo

router.get(
  "/getEmisores",
  asyncHandler(async (req, res) => {
    const emisores = await emisoresDB.getEmisores();
    res.json(emisores);
  })
);

// Crear emisor
router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const emisorData = req.body;
    const result = await emisoresDB.create(emisorData);
    if (result.affectedRows === 0) {
      const err = new Error("Error al crear el emisor");
      err.status = 400;
      throw err;
    }
    res.status(201).json(result);
  })
);

//Filtrar dependencia por parametros
router.post(
  "/search",
  asyncHandler(async (req, res) => {
    let { nombre, estado } = req.body;
    let { page, limite } = req.query;
    limite = parseInt(limite, 10) || 10;
    page = parseInt(page, 10) || 1;
    // Si hay otros parámetros, filtrar por ellos
    const offset = (page - 1) * limite;
    //Get the total count of results
    const { data, totalResults } = await emisoresDB.searchEmisorByParameters(
      nombre,
      estado,
      limite,
      offset
    );
    if (!data || data.length === 0) {
      throw new Error(
        "No se encontraron emisores con los parámetros especificados",
        404
      );
    }
    res.status(200).json({ data, totalResults });
  })
);

// Eliminar emisor
router.delete(
  "/eliminar/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await emisoresDB.eliminar(id);
    if (result.affectedRows === 0) {
      const err = new Error("Emisor no encontrado o ya eliminado");
      err.status = 404;
      throw err;
    }
    res.status(200).json({ ok: true, msg: "Emisor eliminado correctamente" });
  })
);

export default router;

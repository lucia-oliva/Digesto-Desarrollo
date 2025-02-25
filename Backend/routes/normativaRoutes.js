import normativaDB from "../services/normativa.js";
import express from "express";

const router = express.Router();

router.get('/search', async (req, res) => {
    const { numero, dependencia, emisor, documento, anio } = req.query;

    try {
        console.log("Ruta /search alcanzada");
        console.log("Parámetros recibidos:", { numero, dependencia, emisor, documento, anio });

        let normativa;

        if (!numero && !dependencia && !emisor && !documento && !anio) {
            // ✅ Si no hay parámetros, devolver todas las normativas
            normativa = await normativaDB.getAllNormativas();
        } else if (numero && !dependencia && !emisor && !documento && !anio) {
            // 🔹 Si solo se pasa número, buscar solo por número
            normativa = await normativaDB.searchByNumber(numero);
        } else {
            // 🔹 Si hay otros parámetros, filtrar por ellos
            normativa = await normativaDB.searchNormativaByParameters(numero, dependencia, emisor, documento, anio);
        }

        if (!normativa || normativa.length === 0) {
            return res.status(404).json({ error: "No se encontró la normativa que coincida con su búsqueda" });
        }

        res.json(normativa);
    } catch (err) {
        console.log("Error al buscar la normativa", err);
        res.status(500).json({ error: "Error al buscar la normativa" });
    }
});


router.get("/year", async (req, res) => {
try{
    const normativa = await normativaDB.getAllYears(); 
    res.json(normativa);
}catch(err){
    console.log("Error al obtener los anios de normativas",error);
    res.status(500).json({ error: "Error al obtener los anios de normativa" });   
}}
);

router.get("/year/:year", async (req, res) => {
    let {year} = req.params;
    year = parseInt(year, 10);

    if (isNaN(year) || !Number.isInteger(year)) {
        return res.status(400).json({ error: "El año debe ser un número entero válido" });
    }

    try{
    const normativa = await normativaDB.searchByNumber(year);
    if(!normativa){
        return res.status(404).json({ error: "No se encontró la normativa para el año solicitado" });
    }
    res.json(normativa);
    }catch(err){
    console.log("Error al obtener la normativa del año",error);
    res.status(500).json({ error: "Error al obtener la normativa del año" });   
    }}
);



export default router;


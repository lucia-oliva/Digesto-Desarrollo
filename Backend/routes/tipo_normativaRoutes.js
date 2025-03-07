import tipoNDB from "../services/tipo_normativa.js";
import express from "express";

const router = express.Router();

router.get("/name", async (req, res) => {
  try{
    const tipo_normativa = await tipoNDB.getAllTipoNormativa(); 
    res.json(tipo_normativa);
  }catch(err){
    console.log("Error al obtener el tipo de normativas",error);
    res.status(500).json({ error: "Error al obtener tipo normativa" });   
  }}
);

export default router;
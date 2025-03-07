import emisoresDB from "../services/emisores.js";
import express from "express";

const router = express.Router();

router.get("/name", async (req, res) => {
  try{
    const emisores = await emisoresDB.getAllEmisoresName(); 
    res.json(emisores);
  }catch(err){
    console.log("Error al obtener emisores",error);
    res.status(500).json({ error: "Error al obtener emisores" });   
  }}
);

export default router;
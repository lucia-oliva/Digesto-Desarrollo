import tagsDB from '../services/tag.js';
import express from "express";
const router = express.Router();

router.get("/tags", async (req, res) => {
try{
    const tags = await tagsDB.getAllTags(); 
    res.status(200).json({tags});
}catch(err){
    console.log("Error al obtener los tags", err);
    res.status(500).json({ error: "Error al obtener los tags" });   
}}
);

export default router;
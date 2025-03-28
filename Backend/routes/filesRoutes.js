import files from '../utils/files.js'
import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);  // 
const __dirname = path.dirname(__filename);

const router = express.Router();
router.get("/verificar-archivo/:filename", async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'public', 'pdf', filename); 

     fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // El archivo no existe
        return res.json({ exists: false });
      }
      // El archivo existe
      res.json({ exists: true });
    });
  });
  


  export default router;
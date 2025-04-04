import nodeMailer from '../utils/nodemailer.js'
import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  let {nombre, email, mensaje, destinatario} = req.body;
    try {
      const response = await nodeMailer(nombre, email, mensaje, destinatario);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message});
    }
  });

  export default router;

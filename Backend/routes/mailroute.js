import express from "express";
import nodeMailer from "../utils/nodemailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { nombre, email, mensaje, destinatario } = req.body;

    const response = await nodeMailer(
      nombre,
      email,
      mensaje,
      destinatario,
    );

    return res.json(response);
  }),
);

export default router;
import express from "express";
import nodeMailer from "../utils/nodemailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateContactRequest } from "../utils/contactValidation.js";
import { resolveContactRecipient } from "../config/contact.js";
import { verifyContactCaptcha } from "../utils/turnstile.js";
import { contactRateLimiter } from "../Middleware/contactRateLimiter.js";

const router = express.Router();

router.post(
  "/",
  contactRateLimiter,
  asyncHandler(async (req, res) => {
    const contact = validateContactRequest(req.body);
    const dependency = resolveContactRecipient(contact.dependenciaId);

    await verifyContactCaptcha(contact.captchaToken, req.ip);

    const response = await nodeMailer({
      nombre: contact.nombre,
      email: contact.email,
      mensaje: contact.mensaje,
      recipient: dependency.recipient,
    });

    return res.json(response);
  }),
);

export default router;
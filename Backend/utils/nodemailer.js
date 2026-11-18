import { createTransport } from "nodemailer";
import { isValidEmailAddress } from "../config/contact.js";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function mailConfigurationError() {
  const error = new Error("Mail service is not configured");
  error.status = 503;
  error.publicMessage =
    "El servicio de correo no está disponible. Intente nuevamente más tarde.";
  return error;
}

const enviarCorreo = async ({ nombre, email, mensaje, recipient }) => {
  const sender = process.env.MAIL_USER?.trim();

  if (
    !nombre ||
    !mensaje ||
    !isValidEmailAddress(email) ||
    !isValidEmailAddress(recipient) ||
    !isValidEmailAddress(sender) ||
    !process.env.MAIL_PASS
  ) {
    throw mailConfigurationError();
  }

  try {
    await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Nuevo mensaje de: " + nombre,
      text: mensaje,
      replyTo: email,
    });

    return {
      success: true,
      message: "Correo enviado correctamente",
    };
  } catch (error) {
    const publicError = new Error("Mail delivery failed", { cause: error });
    publicError.status = 502;
    publicError.publicMessage =
      "No se pudo enviar el correo. Intente nuevamente más tarde.";
    throw publicError;
  }
};

export default enviarCorreo;
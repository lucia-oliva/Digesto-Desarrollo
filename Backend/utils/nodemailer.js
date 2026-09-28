import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const enviarCorreo = async (nombre, email, mensaje, destinatario) => {
  if (!nombre || !email || !mensaje || !destinatario) {
    const error = new Error("Faltan datos obligatorios");
    error.status = 400;
    error.publicMessage = "Faltan datos obligatorios.";
    throw error;
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: destinatario,
      subject: "Nuevo mensaje de: " + nombre,
      text: mensaje,
      replyTo: email,
    });

    return {
      success: true,
      message: "Correo enviado correctamente",
    };
  } catch (error) {
    error.status = 502;
    error.publicMessage =
      "No se pudo enviar el correo. Intente nuevamente más tarde.";
    throw error;
  }
};

export default enviarCorreo;
import { createTransport } from "nodemailer";

const userGmail=  process.env.MAIL_USER
const passAppGmail = process.env.MAIL_PASS


const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, 

    },
  });
  
  const enviarCorreo = async (nombre, email, mensaje, destinatario) => {
    if (!nombre || !email || !mensaje || !destinatario) {
      throw new Error("Faltan datos obligatorios");
    }
  
    try {
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER, 
        to: destinatario, 
        subject: "Nuevo mensaje de: " + nombre,
        text: mensaje, 
        replyTo: email, 
      });
  
      console.log("Correo enviado: ", info.messageId);
      return { success: true, message: "Correo enviado correctamente" };
    } catch (error) {
      console.error("Error al enviar correo:", error);
      throw new Error("No se pudo enviar el correo");
    }
  };

export default enviarCorreo;
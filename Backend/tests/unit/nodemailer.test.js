import { beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";

const sendMail = jest.fn(async () => ({ messageId: "test-message" }));
const createTransport = jest.fn(() => ({ sendMail }));

jest.unstable_mockModule("nodemailer", () => ({ createTransport }));

let enviarCorreo;

beforeAll(async () => {
  ({ default: enviarCorreo } = await import("../../utils/nodemailer.js"));
});

beforeEach(() => {
  sendMail.mockClear();
});

describe("utils/nodemailer - contrato del formulario", () => {
  test("usa MAIL_USER como from, receptor autorizado como to y usuario como replyTo", async () => {
    await enviarCorreo({
      nombre: "Ana Pérez",
      email: "Ana.Personal@example.net",
      mensaje: "Consulta institucional",
      recipient: "exactas@example.test",
    });

    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith({
      from: "digesto@example.test",
      to: "exactas@example.test",
      subject: "Nuevo mensaje de: Ana Pérez",
      text: "Consulta institucional",
      replyTo: "Ana.Personal@example.net",
    });
  });

  test("rechaza listas de destinatarios incluso si llegan desde código interno", async () => {
    await expect(
      enviarCorreo({
        nombre: "Ana Pérez",
        email: "ana@example.net",
        mensaje: "Consulta institucional",
        recipient: "uno@example.test,otro@example.test",
      }),
    ).rejects.toMatchObject({ status: 503 });

    expect(sendMail).not.toHaveBeenCalled();
  });

  test("no expone el error SMTP original como mensaje público", async () => {
    sendMail.mockRejectedValueOnce(new Error("SMTP test-mail-password"));

    await expect(
      enviarCorreo({
        nombre: "Ana Pérez",
        email: "ana.personal@example.net",
        mensaje: "Consulta institucional",
        recipient: "exactas@example.test",
      }),
    ).rejects.toMatchObject({
      status: 502,
      publicMessage:
        "No se pudo enviar el correo. Intente nuevamente más tarde.",
    });
  });
});
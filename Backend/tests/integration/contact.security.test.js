import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const sendContactEmail = jest.fn(async () => ({
  success: true,
  message: "Correo enviado correctamente",
}));
const verifyContactCaptcha = jest.fn(async () => true);

jest.unstable_mockModule("../../utils/nodemailer.js", () => ({
  default: sendContactEmail,
}));

jest.unstable_mockModule("../../utils/turnstile.js", () => ({
  verifyContactCaptcha,
}));

const [{ default: contactRouter }, { errorHandler }, rateLimitModule] =
  await Promise.all([
    import("../../routes/mailroute.js"),
    import("../../Middleware/errorHandler.js"),
    import("../../Middleware/contactRateLimiter.js"),
  ]);

const app = express();
app.use(express.json());
app.use("/api/contacto", contactRouter);
app.use(errorHandler);

const validPayload = Object.freeze({
  dependenciaId: "2",
  nombre: "Ana Pérez",
  email: "Ana.Personal@example.net",
  mensaje: "Necesito información sobre una normativa.",
  captchaToken: "valid-captcha-token",
});

beforeEach(() => {
  sendContactEmail.mockClear();
  verifyContactCaptcha.mockClear();
  rateLimitModule.resetContactRateLimiter();
});

describe("POST /api/contacto (SEC-08 / SEC-12)", () => {
  test("resuelve el receptor autorizado y conserva replyTo del visitante", async () => {
    const response = await request(app).post("/api/contacto").send(validPayload);

    expect(response.status).toBe(200);
    expect(sendContactEmail).toHaveBeenCalledWith({
      nombre: "Ana Pérez",
      email: "Ana.Personal@example.net",
      mensaje: validPayload.mensaje,
      recipient: "exactas@example.test",
    });
    expect(verifyContactCaptcha).toHaveBeenCalledWith(
      "valid-captcha-token",
      expect.any(String),
    );
  });

  test.each([
    "to",
    "To",
    "cc",
    "bcc",
    "from",
    "replyTo",
    "ReplyTo",
    "destinatario",
    "recipient",
  ])("rechaza el campo SMTP manipulable %s", async (field) => {
    const response = await request(app)
      .post("/api/contacto")
      .send({ ...validPayload, [field]: "attacker@example.test" });

    expect(response.status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();
    expect(verifyContactCaptcha).not.toHaveBeenCalled();
    expect(response.body.msg).toBe(
      "La solicitud contiene campos no permitidos.",
    );
  });

  test("una petición manipulada no puede cambiar el receptor autorizado", async () => {
    const response = await request(app)
      .post("/api/contacto")
      .send({
        ...validPayload,
        destinatario: "attacker@example.test",
        to: "attacker@example.test",
      });

    expect(response.status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  test("rechaza una dependencia no autorizada", async () => {
    const response = await request(app)
      .post("/api/contacto")
      .send({ ...validPayload, dependenciaId: "999" });

    expect(response.status).toBe(422);
    expect(sendContactEmail).not.toHaveBeenCalled();
    expect(verifyContactCaptcha).not.toHaveBeenCalled();
  });

  test.each([
    [{ nombre: "A" }, "nombre"],
    [{ email: "correo-invalido" }, "email"],
    [{ email: "uno@example.test,otro@example.test" }, "lista de emails"],
    [{ email: "persona@example.test\r\nBcc:evil@example.test" }, "inyección"],
    [{ mensaje: "" }, "mensaje"],
    [{ captchaToken: "" }, "captcha"],
  ])("rechaza datos inválidos: %s (%s)", async (overrides) => {
    const response = await request(app)
      .post("/api/contacto")
      .send({ ...validPayload, ...overrides });

    expect(response.status).toBe(422);
    expect(sendContactEmail).not.toHaveBeenCalled();
    expect(verifyContactCaptcha).not.toHaveBeenCalled();
  });

  test("un CAPTCHA inválido impide el envío", async () => {
    verifyContactCaptcha.mockRejectedValueOnce(
      Object.assign(new Error("invalid captcha"), {
        status: 422,
        publicMessage: "No se pudo validar la verificación anti-bot.",
      }),
    );

    const response = await request(app).post("/api/contacto").send(validPayload);

    expect(response.status).toBe(422);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  test("limita solicitudes excesivas", async () => {
    for (let index = 0; index < 3; index += 1) {
      const accepted = await request(app)
        .post("/api/contacto")
        .send(validPayload);
      expect(accepted.status).toBe(200);
    }

    const limited = await request(app).post("/api/contacto").send(validPayload);

    expect(limited.status).toBe(429);
    expect(limited.headers["retry-after"]).toBeDefined();
    expect(sendContactEmail).toHaveBeenCalledTimes(3);
    expect(verifyContactCaptcha).toHaveBeenCalledTimes(3);
  });

  test("no revela errores internos del transporte", async () => {
    sendContactEmail.mockRejectedValueOnce(
      Object.assign(new Error("SMTP password=test-mail-password"), {
        status: 502,
        publicMessage:
          "No se pudo enviar el correo. Intente nuevamente más tarde.",
      }),
    );

    const response = await request(app).post("/api/contacto").send(validPayload);
    const serializedBody = JSON.stringify(response.body);

    expect(response.status).toBe(502);
    expect(serializedBody).not.toContain("test-mail-password");
    expect(serializedBody).not.toContain("SMTP");
    expect(response.body).toEqual({
      ok: false,
      msg: "No se pudo enviar el correo. Intente nuevamente más tarde.",
    });
  });
});
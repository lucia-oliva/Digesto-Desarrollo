import { isValidEmailAddress } from "../config/contact.js";

const ALLOWED_FIELDS = new Set([
  "dependenciaId",
  "nombre",
  "email",
  "mensaje",
  "captchaToken",
]);

const FORBIDDEN_MAIL_FIELDS = new Set([
  "to",
  "cc",
  "bcc",
  "from",
  "replyto",
  "destinatario",
  "recipient",
  "recipients",
]);

const NAME_PATTERN =
  /^[\p{L}\p{M}][\p{L}\p{M}'’.-]*(?:\s+[\p{L}\p{M}][\p{L}\p{M}'’.-]*)*$/u;

function validationError(message) {
  const error = new Error(message);
  error.status = 422;
  error.publicMessage = message;
  return error;
}

function forbiddenFieldError() {
  const error = new Error("Mail header fields are not accepted");
  error.status = 400;
  error.publicMessage = "La solicitud contiene campos no permitidos.";
  return error;
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactRequest(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw validationError("Los datos enviados no son válidos.");
  }

  const fields = Object.keys(body);
  const lowerCaseFields = fields.map((field) => field.toLowerCase());

  if (
    lowerCaseFields.some((field) => FORBIDDEN_MAIL_FIELDS.has(field)) ||
    fields.some((field) => !ALLOWED_FIELDS.has(field))
  ) {
    throw forbiddenFieldError();
  }

  const dependenciaId = normalizeText(body.dependenciaId);
  const nombre = normalizeText(body.nombre).replace(/\s+/g, " ");
  const email = normalizeText(body.email);
  const mensaje = normalizeText(body.mensaje);
  const captchaToken = normalizeText(body.captchaToken);

  if (!/^\d{1,3}$/.test(dependenciaId)) {
    throw validationError("La dependencia seleccionada no es válida.");
  }

  if (
    nombre.length < 3 ||
    nombre.length > 100 ||
    /[\r\n\0]/.test(nombre) ||
    !NAME_PATTERN.test(nombre)
  ) {
    throw validationError("El nombre ingresado no es válido.");
  }

  if (!isValidEmailAddress(email)) {
    throw validationError("El correo electrónico ingresado no es válido.");
  }

  if (
    mensaje.length < 1 ||
    mensaje.length > 5000 ||
    /[\0\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(mensaje)
  ) {
    throw validationError("El mensaje ingresado no es válido.");
  }

  if (!captchaToken || captchaToken.length > 2048) {
    throw validationError("Debe completar la verificación anti-bot.");
  }

  return Object.freeze({
    dependenciaId,
    nombre,
    email,
    mensaje,
    captchaToken,
  });
}
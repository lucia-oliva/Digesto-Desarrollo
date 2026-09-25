import { httpError } from "./httpError.js";

export function isBlank(value) {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0 || value.every(isBlank);
  }
  return false;
}

export function assertRequiredFields(source, fields) {
  const missing = fields.filter(({ key, when }) => {
    if (typeof when === "function" && !when(source)) {
      return false;
    }

    return isBlank(source?.[key]);
  });

  if (missing.length === 0) {
    return;
  }

  const labels = missing.map(({ label }) => label).join(", ");

  throw httpError(400, `Faltan datos obligatorios: ${labels}.`);
}

export function validateRequiredFields(fields) {
  return (req, _res, next) => {
    try {
      assertRequiredFields(req.body, fields);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function normalizeOptionalFields(defaults) {
  return (req, _res, next) => {
    req.body = { ...(req.body || {}) };

    for (const [key, fallback] of Object.entries(defaults)) {
      if (req.body[key] === undefined || req.body[key] === null) {
        req.body[key] = fallback;
      }
    }

    next();
  };
}

import { verifyAccessToken } from "../utils/authToken.js";

function getBearerToken(authHeader) {
  if (!authHeader) {
    return {
      missing: true,
      invalid: false,
      token: null,
    };
  }

  const parts = authHeader
    .trim()
    .split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0].toLowerCase() !== "bearer" ||
    !parts[1]
  ) {
    return {
      missing: false,
      invalid: true,
      token: null,
    };
  }

  return {
    missing: false,
    invalid: false,
    token: parts[1],
  };
}

function authenticateRequest(req, token) {
  const payload = verifyAccessToken(token);

  if (payload.sub == null) {
    throw new Error(
      "Token sin identificador de usuario",
    );
  }

  req.user = {
    sub: String(payload.sub),

    roles: Array.isArray(payload.roles)
      ? payload.roles
      : [],

    dependenciaId:
      payload.dependenciaId ?? null,
  };
}

export const authenticateToken = (
  req,
  res,
  next,
) => {
  const auth = getBearerToken(
    req.headers.authorization,
  );

  if (auth.missing) {
    return res.status(401).json({
      error:
        "No se proporcionó un token",
    });
  }

  if (auth.invalid) {
    return res.status(401).json({
      error:
        "Token de autenticación inválido",
    });
  }

  try {
    authenticateRequest(req, auth.token);

    return next();
  } catch {
    return res.status(401).json({
      error:
        "Token de autenticación inválido o vencido",
    });
  }
};

export const optionalAuthenticateToken = (
  req,
  res,
  next,
) => {
  const auth = getBearerToken(
    req.headers.authorization,
  );

  if (auth.missing) {
    return next();
  }

  if (auth.invalid) {
    return res.status(401).json({
      error:
        "Token de autenticación inválido",
    });
  }

  try {
    authenticateRequest(req, auth.token);

    return next();
  } catch {
    return res.status(401).json({
      error:
        "Token de autenticación inválido o vencido",
    });
  }
};
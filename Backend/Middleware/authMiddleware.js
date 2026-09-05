import { verifyAccessToken } from "../utils/authToken.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "No se proporcionó un token",
    });
  }

  const parts = authHeader.trim().split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0].toLowerCase() !== "bearer" ||
    !parts[1]
  ) {
    return res.status(401).json({
      error: "Token de autenticación inválido",
    });
  }

  const token = parts[1];

  try {
    const payload = verifyAccessToken(token);

    if (payload.sub == null) {
      return res.status(401).json({
        error: "Token de autenticación inválido",
      });
    }

    req.user = {
      sub: String(payload.sub),
      roles: Array.isArray(payload.roles) ? payload.roles : [],
      dependenciaId: payload.dependenciaId ?? null,
    };

    next();
  } catch {
    return res.status(401).json({
      error: "Token de autenticación inválido o vencido",
    });
  }
};



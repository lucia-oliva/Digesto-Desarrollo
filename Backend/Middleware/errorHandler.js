const CONNECTION_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "PROTOCOL_CONNECTION_LOST",
  "ETIMEDOUT",
]);

const PUBLIC_MESSAGES = {
  400: "Solicitud incorrecta.",
  401: "No autenticado.",
  403: "Acceso denegado.",
  404: "Recurso no encontrado.",
  409: "Conflicto de datos.",
  413: "Archivo demasiado grande.",
  415: "Tipo de contenido no permitido.",
  422: "Datos inválidos.",
  429: "Demasiadas solicitudes.",
  500: "Error interno del servidor.",
  503: "Servicio temporalmente no disponible. Intente más tarde.",
};

function normalizeStatus(value) {
  const status = Number(value);

  if (Number.isInteger(status) && status >= 400 && status <= 599) {
    return status;
  }

  return 500;
}

export function mapPublicError(err = {}) {
  if (
    CONNECTION_ERROR_CODES.has(err.code) ||
    err.errno === 1045 ||
    err.errno === 1213
  ) {
    return {
      status: 503,
      message: PUBLIC_MESSAGES[503],
    };
  }

  if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
    return {
      status: 409,
      message: PUBLIC_MESSAGES[409],
    };
  }

  if (err.code === "ER_PARSE_ERROR" || err.errno === 1064) {
    return {
      status: 500,
      message: PUBLIC_MESSAGES[500],
    };
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return {
      status: 413,
      message: PUBLIC_MESSAGES[413],
    };
  }

  const status = normalizeStatus(err.status ?? err.statusCode);

  const message =
    typeof err.publicMessage === "string" && err.publicMessage.trim()
      ? err.publicMessage
      : PUBLIC_MESSAGES[status] ??
        (status < 500
          ? "No se pudo procesar la solicitud."
          : PUBLIC_MESSAGES[500]);

  return { status, message };
}

export function notFound(req, res) {
  return res.status(404).json({
    ok: false,
    msg: PUBLIC_MESSAGES[404],
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const { status, message } = mapPublicError(err);

  console.error("[ERROR]", {
    status,
    code: err?.code,
    errno: err?.errno,
    method: req.method,
    path: req.path,
  });

  return res.status(status).json({
    ok: false,
    msg: message,
  });
}
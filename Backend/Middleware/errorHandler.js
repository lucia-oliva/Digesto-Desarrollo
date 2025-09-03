export function notFound(err, req, res, next) {
  console.error("[ERROR]", {
    message: err.message,
    stack: err.stack,
  });

  if (err.status !== 404) {
    return next(err);
  }

  res.status(404).json({
    ok: false,
    msg: "Recurso no encontrado",
    path: req.originalUrl,
  });
}

export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", {
    message: err.message,
    code: err.code,
    errno: err.errno,
    stack: err.stack,
  });

  console.log(err.status, err.message);

  let status = err.status || 500;
  let message =
    err.message || err.publicMessage || "Error interno del servidor";

  const connectionIssues = new Set([
    "ECONNREFUSED",
    "PROTOCOL_CONNECTION_LOST",
    "ETIMEDOUT",
  ]);

  console.log(status, message);

  if (connectionIssues.has(err.code) || err.errno === 1045) {
    status = 503;
    message = "Servicio de base de datos no disponible. Intente más tarde.";
  } else if (err.errno === 1213) {
    status = 503;
    message = "Conflicto de concurrencia (deadlock). Intente nuevamente.";
  } else if (err.errno === 1064) {
    status = 500;
    message = "Error al procesar la consulta.";
  } else if (err.errno === 409) {
    status = 409;
    message = err.message || "Conflicto de datos.";
  } else if (err.errno === 400) {
    status = 400;
    message = err.message || "Solicitud incorrecta.";
  }

  res.status(status).json({ ok: false, msg: message });
}

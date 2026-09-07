import request from "supertest";

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

const DEFAULT_BODY = Object.freeze({
  id: 1,
  id_usuario: 1,
  nuevo_estado: "activo",
  dependencia: 3,
  id_dependencia: 3,
  id_emisor: 1,
  tipo_normativa: 1,
  rol: 1,
  nombre: "Dato de prueba",
  nombre_completo: "Dato completo de prueba",
  codificacion: "TEST",
  estado: "publicado",
  email: "prueba@example.test",
  password: "Clave-de-prueba-123",
  telefono: "3804000000",
  numero: "1",
  titulo: "Normativa de prueba",
  fecha: "2026-01-01",
  anio: "2026",
  resolucion: "1",
  fecha_sesion: "2026-01-01",
  orden_url: "orden-prueba.pdf",
  nombre_orden: "Orden de prueba",
  tags: [1],
});

export function resolveTestPath(path) {
  return path.replace(/:[^/]+/g, "1");
}

export function buildRbacRequest(
  app,
  endpoint,
  { token, body = {}, headers = {} } = {},
) {
  const method = endpoint.method.toUpperCase();
  const req = request(app)[method.toLowerCase()](
    resolveTestPath(endpoint.path),
  );

  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }

  req.set("x-user-id", "9001");

  for (const [name, value] of Object.entries(headers)) {
    req.set(name, value);
  }

  if (METHODS_WITH_BODY.has(method)) {
    req.send({ ...DEFAULT_BODY, ...body });
  }

  return req;
}

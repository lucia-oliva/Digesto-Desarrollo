import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeAll, describe, expect, jest, test } from "@jest/globals";

const ACCESS_SECRET = process.env.ACCESS_SECRET;

// Mock de servicios para que, cuando la autenticación NO esté aplicada,
// los handlers devuelvan respuestas deterministas sin depender de MariaDB.
jest.unstable_mockModule("../../services/db.js", () => {
  const dbMock = {
    pool: {},
    query: async () => [],
    queryOne: async () => null,
    execute: async () => ({ affectedRows: 1, insertId: 1 }),
    transaction: async (fn) => fn(async () => ({ affectedRows: 1 })),
    closePool: async () => {},
  };
  return { ...dbMock, default: dbMock };
});

jest.unstable_mockModule("../../services/usuarios.js", () => ({
  default: {
    getAllUsuarios: async () => [{ id: 1, nombre: "usuario-test" }],
  },
}));

jest.unstable_mockModule("../../services/normativa.js", () => ({
  default: {
    create: async () => ({ insertId: 1 }),
  },
}));

jest.unstable_mockModule("../../services/auditoria.js", () => ({
  default: {
    searchAuditoriaByParameters: async () => ({ data: [], totalResults: 0 }),
  },
}));

let app;

beforeAll(async () => {
  ({ default: app } = await import("../../app.js"));
});

const RUTAS_PROTEGIDAS = [
  { nombre: "usuarios", method: "get", path: "/api/usuarios" },
  {
    nombre: "normativas",
    method: "post",
    path: "/api/normativa/create",
    body: { numero: "1", titulo: "Normativa de prueba", fecha: "2024-01-01" },
  },
  {
    nombre: "auditoría",
    method: "post",
    path: "/api/auditoria/search",
    body: {},
  },
  {
    nombre: "archivos",
    method: "post",
    path: "/api/file/upload",
    body: {},
  },
];

function buildRequest(ruta, authorization, body) {
  const req = request(app)[ruta.method](ruta.path);

  if (authorization !== undefined) {
    req.set("Authorization", authorization);
  }

  if (body !== undefined) {
    req.send(body);
  }

  return req;
}

describe("rutas críticas protegidas por authenticateToken", () => {
  for (const ruta of RUTAS_PROTEGIDAS) {
    describe(`${ruta.method.toUpperCase()} ${ruta.path}`, () => {
      test("sin Authorization responde 401", async () => {
        const res = await buildRequest(ruta, undefined, ruta.body);

        expect(res.status).toBe(401);
      });

      test("token malformado responde 401", async () => {
        const res = await buildRequest(ruta, "Bearer", ruta.body);

        expect(res.status).toBe(401);
      });

      test("token inválido responde 401", async () => {
        const token = jwt.sign({ sub: "1", roles: [] }, "otra-clave", {
          expiresIn: "15m",
        });
        const res = await buildRequest(ruta, `Bearer ${token}`, ruta.body);

        expect(res.status).toBe(401);
      });

      test("token expirado responde 401", async () => {
        const token = jwt.sign({ sub: "1", roles: [] }, ACCESS_SECRET, {
          expiresIn: -10,
        });
        const res = await buildRequest(ruta, `Bearer ${token}`, ruta.body);

        expect(res.status).toBe(401);
      });

      test("token válido no responde 401", async () => {
        const token = jwt.sign(
          { sub: "1", roles: ["SuperAdministrador"] },
          ACCESS_SECRET,
          { expiresIn: "15m" },
        );
        const res = await buildRequest(ruta, `Bearer ${token}`, ruta.body);

        expect(res.status).not.toBe(401);
      });
    });
  }
});

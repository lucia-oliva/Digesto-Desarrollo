import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

const dbMock = {
  pool: {},
  query: jest.fn(),
  queryOne: jest.fn(),
  execute: jest.fn(),
  transaction: jest.fn(),
  closePool: jest.fn(),
};

jest.unstable_mockModule("../../services/db.js", () => ({
  ...dbMock,
  default: dbMock,
}));

let procesarArchivoDeNormativa;

const FILES_ROOT = path.resolve("archivos");
const pathsToCleanup = new Set();

beforeAll(async () => {
  ({ procesarArchivoDeNormativa } = await import("../../services/file.js"));
});

beforeEach(async () => {
  await fs.mkdir(FILES_ROOT, { recursive: true });

  dbMock.queryOne.mockImplementation(async (sql) => {
    const query = String(sql);

    if (query.includes("FROM normativa")) {
      return {
        id: 1,
        archivo: "archivo-anterior.pdf",
      };
    }

    if (query.includes("FROM dependencia")) {
      return {
        codificacion: "TEST",
      };
    }

    return null;
  });
});

afterEach(async () => {
  for (const filePath of pathsToCleanup) {
    await fs.rm(filePath, { force: true }).catch(() => {});
  }

  pathsToCleanup.clear();
  jest.clearAllMocks();
});

async function crearTemporal() {
  const filename = `${crypto.randomUUID()}.pdf`;
  const filePath = path.join(FILES_ROOT, filename);

  await fs.writeFile(filePath, Buffer.from("%PDF-1.4\n"));

  pathsToCleanup.add(filePath);

  return {
    filename,
    path: filePath,
  };
}

describe("procesarArchivoDeNormativa: rollback de archivo", () => {
  test("elimina el archivo definitivo si falla el UPDATE de BD", async () => {
    const file = await crearTemporal();
    const uploadId = path.parse(file.filename).name;

    const destino = path.join(
      FILES_ROOT,
      `TEST_1_2026_${uploadId}.pdf`,
    );

    pathsToCleanup.add(destino);

    dbMock.execute.mockRejectedValueOnce(new Error("Fallo de BD"));

    await expect(
      procesarArchivoDeNormativa({
        file,
        normativaId: 1,
        body: {
          type: "normativa",
          id_dependencia: 1,
          resolucion: "1",
          anio: "2026",
        },
      }),
    ).rejects.toThrow("Fallo de BD");

    await expect(fs.access(destino)).rejects.toThrow();
  });

  test("elimina el archivo definitivo si affectedRows es 0", async () => {
    const file = await crearTemporal();
    const uploadId = path.parse(file.filename).name;

    const destino = path.join(
      FILES_ROOT,
      `TEST_1_2026_${uploadId}.pdf`,
    );

    pathsToCleanup.add(destino);

    dbMock.execute.mockResolvedValueOnce({
      affectedRows: 0,
    });

    await expect(
      procesarArchivoDeNormativa({
        file,
        normativaId: 1,
        body: {
          type: "normativa",
          id_dependencia: 1,
          resolucion: "1",
          anio: "2026",
        },
      }),
    ).rejects.toThrow("No se pudo actualizar la normativa");

    await expect(fs.access(destino)).rejects.toThrow();
  });
});
import fs from "fs/promises";
import path from "path";

import request from "supertest";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import { MAX_PDF_SIZE_BYTES } from "../../config/files.js";
import { generateAccessToken } from "../../utils/authToken.js";

const FILES_ROOT = path.resolve("archivos");
const DEFAULT_DEPENDENCY_ID = 3;
const OTHER_DEPENDENCY_ID = 999;
const TEST_USER_ID = "9001";

const UUID_PDF_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$/i;

const VALID_PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n",
);

// ---------------------------------------------------------------------------
// Mocks de la capa de servicios.
// NO se mockea fileMiddleware.js: se prueba el middleware real (multer + limite
// de tamano + filtro por extension + verificacion de magic bytes).
// ---------------------------------------------------------------------------

let normativaDependencyId = DEFAULT_DEPENDENCY_ID;

const dbMock = {
  pool: {},
  query: jest.fn(),
  queryOne: jest.fn(),
  execute: jest.fn(),
  transaction: jest.fn(),
  closePool: jest.fn(),
};

const fileServiceMock = {
  procesarArchivoDeNormativa: jest.fn(),
  getFileAccessContextById: jest.fn(),
  getFileDownloadInfo: jest.fn(),
};

const normativaMock = {
  getNormativaDependencyById: jest.fn(),
};

const dependenciaMock = {
  getDepenendenciaById: jest.fn(),
};

jest.unstable_mockModule("../../services/db.js", () => ({
  ...dbMock,
  default: dbMock,
}));
jest.unstable_mockModule("../../services/file.js", () => ({
  ...fileServiceMock,
  default: fileServiceMock,
}));
jest.unstable_mockModule("../../services/normativa.js", () => ({
  default: normativaMock,
}));
jest.unstable_mockModule("../../services/dependencia.js", () => ({
  default: dependenciaMock,
}));

function dbQueryImplementation(sql) {
  return String(sql).trim().toUpperCase().startsWith("SELECT")
    ? []
    : { affectedRows: 1, insertId: 1 };
}

// `restoreMocks: true` (jest.config.js) resetea las implementaciones antes de
// cada test, por lo que se reaplican aca.
function applyServiceMocks() {
  dbMock.query.mockImplementation(dbQueryImplementation);
  dbMock.queryOne.mockImplementation(async () => null);
  dbMock.execute.mockImplementation(async () => ({
    affectedRows: 1,
    insertId: 1,
  }));
  dbMock.transaction.mockImplementation(async (fn) =>
    fn(async () => ({ affectedRows: 1, insertId: 1 })),
  );
  dbMock.closePool.mockImplementation(async () => {});

  fileServiceMock.procesarArchivoDeNormativa.mockImplementation(
    async ({ file }) => ({
      id: 1,
      filename: file?.filename ?? "test.pdf",
    }),
  );
  fileServiceMock.getFileAccessContextById.mockImplementation(async () => ({
    estado: "publicado",
    dependenciaId: DEFAULT_DEPENDENCY_ID,
    resourceType: "normativa",
  }));
  fileServiceMock.getFileDownloadInfo.mockImplementation(async () => ({
    absolutePath: path.join(FILES_ROOT, "test.pdf"),
    downloadName: "test.pdf",
    tipo: "normativa",
  }));

  normativaMock.getNormativaDependencyById.mockImplementation(
    async () => normativaDependencyId,
  );

  dependenciaMock.getDepenendenciaById.mockImplementation(async (id) => ({
    id: Number(id),
    nombre: "Dependencia de prueba",
  }));
}

let app;

beforeAll(async () => {
  ({ default: app } = await import("../../app.js"));

  await fs.mkdir(FILES_ROOT, { recursive: true });
});

// ---------------------------------------------------------------------------
// Helpers de disco: baseline/diff para no dejar archivos residuales.
// ---------------------------------------------------------------------------

async function listFiles() {
  try {
    return (await fs.readdir(FILES_ROOT)).sort();
  } catch {
    return [];
  }
}

// La limpieza por `res.on("close")` es asincrona: se espera un margen acotado.
async function waitForNoNewFiles(baseline, timeoutMs = 1000) {
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    const created = (await listFiles()).filter(
      (name) => !baseline.includes(name),
    );

    if (created.length === 0 || Date.now() >= deadline) {
      return created;
    }

    await new Promise((resolve) => setTimeout(resolve, 25));
  }
}

async function removeNewFiles(baseline) {
  const created = (await listFiles()).filter(
    (name) => !baseline.includes(name),
  );

  await Promise.all(
    created.map((name) => fs.rm(path.join(FILES_ROOT, name), { force: true })),
  );
}

let baselineFiles = [];

beforeEach(async () => {
  baselineFiles = await listFiles();
  normativaDependencyId = DEFAULT_DEPENDENCY_ID;
  applyServiceMocks();
});

afterEach(async () => {
  await removeNewFiles(baselineFiles);
});

// ---------------------------------------------------------------------------
// Builders de requests
// ---------------------------------------------------------------------------

function tokenForDependency(dependenciaId) {
  return generateAccessToken({
    id: TEST_USER_ID,
    roles: ["Supervisor"],
    dependenciaId,
  });
}

function buildUploadRequest({
  token,
  id_dependencia = DEFAULT_DEPENDENCY_ID,
} = {}) {
  const req = request(app).post("/api/file/upload");

  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }

  return req
    .field("id_dependencia", String(id_dependencia))
    .field("id_emisor", "1")
    .field("tipo_normativa", "1")
    .field("titulo", "Normativa de prueba")
    .field("resolucion", "1")
    .field("anio", "2026");
}

function buildUploadByIdRequest({ token, id = "1" } = {}) {
  const req = request(app).post(`/api/file/upload/${id}`);

  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }

  return req
    .field("type", "normativa")
    .field("id_dependencia", String(DEFAULT_DEPENDENCY_ID))
    .field("resolucion", "1")
    .field("anio", "2026");
}

// ---------------------------------------------------------------------------
// PDF real
// ---------------------------------------------------------------------------

describe("POST /api/file/upload: PDF real", () => {
  test("acepta un PDF valido y responde 201 con nombre aleatorio", async () => {
    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", VALID_PDF, {
      filename: "documento.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(201);
    expect(String(res.body.filename)).toMatch(UUID_PDF_PATTERN);
  });
});

describe("POST /api/file/upload/:id: PDF real", () => {
  test("acepta un PDF valido y responde 200", async () => {
    const res = await buildUploadByIdRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", VALID_PDF, {
      filename: "documento.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(200);
    expect(fileServiceMock.procesarArchivoDeNormativa).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// .txt renombrado / MIME falso
// ---------------------------------------------------------------------------

describe(".txt renombrado / MIME falso", () => {
  test("rechaza un .txt renombrado a .pdf (415) sin residuo", async () => {
    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", Buffer.from("esto no es un PDF"), {
      filename: "nota.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(415);
    expect(await waitForNoNewFiles(baselineFiles)).toEqual([]);
  });

  test("no confia en el mimetype: application/pdf con contenido ajeno => 415", async () => {
    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", Buffer.from('{"no":"es un pdf"}'), {
      filename: "documento.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(415);
  });

  test("no confia en el mimetype: PDF valido con text/plain => 201", async () => {
    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", VALID_PDF, {
      filename: "documento.pdf",
      contentType: "text/plain",
    });

    expect(res.status).toBe(201);
  });
});

// ---------------------------------------------------------------------------
// Archivo vacio
// ---------------------------------------------------------------------------

describe("archivo vacio", () => {
  test("rechaza un archivo de 0 bytes (415)", async () => {
    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", Buffer.alloc(0), {
      filename: "vacio.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(415);
  });

  test("sin campo file responde 400", async () => {
    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    });

    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Demasiado grande
// ---------------------------------------------------------------------------

describe("archivo demasiado grande", () => {
  test("rechaza > 10 MB con 413 y sin residuo", async () => {
    const oversized = Buffer.concat([
      VALID_PDF,
      Buffer.alloc(MAX_PDF_SIZE_BYTES, 0x41),
    ]);

    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", oversized, {
      filename: "grande.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(413);
    expect(await waitForNoNewFiles(baselineFiles)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Usuario sin permiso
// ---------------------------------------------------------------------------

describe("usuario sin permiso", () => {
  test("dependencia destino ajena => 403 sin residuo", async () => {
    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
      id_dependencia: OTHER_DEPENDENCY_ID,
    }).attach("file", VALID_PDF, {
      filename: "documento.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(403);
    expect(await waitForNoNewFiles(baselineFiles)).toEqual([]);
  });

  test("/upload/:id con recurso de otra dependencia => 403", async () => {
    normativaDependencyId = OTHER_DEPENDENCY_ID;

    const res = await buildUploadByIdRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", VALID_PDF, {
      filename: "documento.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// Upload sin token
// ---------------------------------------------------------------------------

describe("upload sin token", () => {
  test("sin Authorization responde 401", async () => {
    const res = await buildUploadRequest({}).attach("file", VALID_PDF, {
      filename: "documento.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Filename malicioso
// ---------------------------------------------------------------------------

describe("filename malicioso", () => {
  test("ignora el nombre del cliente y guarda con UUID dentro de FILES_ROOT", async () => {
    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", VALID_PDF, {
      filename: "../../../evil.pdf",
      contentType: "application/pdf",
    });

    expect(res.status).toBe(201);

    const savedName = String(res.body.filename);

    expect(savedName).not.toContain("..");
    expect(savedName).not.toContain("evil");
    expect(savedName).toMatch(UUID_PDF_PATTERN);

    await expect(
      fs.access(path.join(FILES_ROOT, savedName)),
    ).resolves.toBeUndefined();
  });

  test("nombre sin extension .pdf => 415", async () => {
    const res = await buildUploadRequest({
      token: tokenForDependency(DEFAULT_DEPENDENCY_ID),
    }).attach("file", VALID_PDF, {
      filename: "documento.exe",
      contentType: "application/octet-stream",
    });

    expect(res.status).toBe(415);
  });
});

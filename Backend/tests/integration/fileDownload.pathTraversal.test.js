import fs from "fs/promises";
import path from "path";

import request from "supertest";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

const ARTIFACTS_ROOT = path.resolve("archivos");
const FIXTURE_NAME = "adversarial_fixture.pdf";
const FIXTURE_PATH = path.join(ARTIFACTS_ROOT, FIXTURE_NAME);
const FIXTURE_CONTENT = "%PDF-1.4 adversarial fixture %%EOF";
const VALID_ID = "1";

let accessContextRow = null;
let downloadRow = null;

function queryOneImplementation(sql, params) {
  const text = String(sql);

  if (String(params?.[0]) !== VALID_ID) {
    return Promise.resolve(null);
  }

  if (text.includes("id_dependencia AS dependenciaId")) {
    return Promise.resolve(accessContextRow);
  }

  if (text.includes("SELECT archivo")) {
    return Promise.resolve(downloadRow);
  }

  return Promise.resolve(null);
}

const dbMock = {
  pool: {},
  query: jest.fn(async () => []),
  queryOne: jest.fn(queryOneImplementation),
  execute: jest.fn(async () => ({ affectedRows: 1, insertId: 1 })),
  transaction: jest.fn(async (fn) => fn(async () => ({ affectedRows: 1 }))),
  closePool: jest.fn(async () => {}),
};

jest.unstable_mockModule("../../services/db.js", () => ({
  ...dbMock,
  default: dbMock,
}));

let app;

beforeAll(async () => {
  ({ default: app } = await import("../../app.js"));

  await fs.mkdir(ARTIFACTS_ROOT, { recursive: true });
  await fs.writeFile(FIXTURE_PATH, FIXTURE_CONTENT);
});

afterAll(async () => {
  await fs.rm(FIXTURE_PATH, { force: true });
});

beforeEach(() => {
  accessContextRow = { estado: "publicado", dependenciaId: 3 };
  downloadRow = { archivo: FIXTURE_NAME };
  dbMock.queryOne.mockImplementation(queryOneImplementation);
});

const TRAVERSAL_TIPO_URLS = [
  "/api/file/download?tipo=../package.json&id=1",
  "/api/file/download?tipo=../../&id=1",
  "/api/file/download?tipo=..%5C&id=1",
  "/api/file/download?tipo=%2e%2e/&id=1",
  "/api/file/download?tipo=..%2F&id=1",
  "/api/file/download?tipo=%252e%252e%252f&id=1",
  "/api/file/download?tipo=/etc/passwd&id=1",
  "/api/file/download?tipo=C:%5CWindows%5CSystem32&id=1",
];

describe("GET /api/file/download: traversal en tipo", () => {
  test.each(TRAVERSAL_TIPO_URLS)("%s => 400", async (url) => {
    const response = await request(app).get(url);

    expect(response.status).toBe(400);
    expect(response.headers["content-disposition"]).toBeUndefined();
    expect(String(response.headers["content-type"] ?? "")).not.toContain(
      "application/pdf",
    );
  });
});

const ID_URLS = [
  "/api/file/download?tipo=normativa&id=../package.json",
  "/api/file/download?tipo=normativa&id=..%2F..%2Fpackage.json",
  "/api/file/download?tipo=normativa&id=999999",
];

describe("GET /api/file/download: id manipulado o inexistente", () => {
  test.each(ID_URLS)("%s => 404", async (url) => {
    const response = await request(app).get(url);

    expect(response.status).toBe(404);
    expect(response.headers["content-disposition"]).toBeUndefined();
  });
});

const FILENAME_URLS = [
  "/api/file/download?filename=../package.json",
  "/api/file/download?filename=../../etc/passwd",
  "/api/file/download?filename=test_normativa.pdf",
];

describe("GET /api/file/download: filename manipulado", () => {
  test.each(FILENAME_URLS)("%s => 400", async (url) => {
    const response = await request(app).get(url);

    expect(response.status).toBe(400);
    expect(response.headers["content-disposition"]).toBeUndefined();
  });
});

describe("GET /api/file/download: archivo valido", () => {
  test("descarga el archivo del recurso (200)", async () => {
    const response = await request(app).get(
      `/api/file/download?tipo=normativa&id=${VALID_ID}`,
    );

    expect(response.status).toBe(200);
    expect(String(response.headers["content-disposition"])).toContain(
      FIXTURE_NAME,
    );
  });
});

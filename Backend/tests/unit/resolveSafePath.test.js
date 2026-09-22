import path from "path";

import { beforeAll, describe, expect, jest, test } from "@jest/globals";

// resolveSafePath no usa la base de datos. Se mockea db.js para no inicializar
// el pool de MySQL al importar el servicio.
jest.unstable_mockModule("../../services/db.js", () => {
  const dbMock = {
    pool: {},
    query: jest.fn(),
    queryOne: jest.fn(),
    execute: jest.fn(),
    transaction: jest.fn(),
    closePool: jest.fn(),
  };

  return { ...dbMock, default: dbMock };
});

const BACKSLASH = String.fromCharCode(92);

let resolveSafePath;

beforeAll(async () => {
  ({ resolveSafePath } = await import("../../services/file.js"));
});

const FILES_ROOT = path.resolve("archivos");
const ROOT_PREFIX = FILES_ROOT.endsWith(path.sep)
  ? FILES_ROOT
  : FILES_ROOT + path.sep;

function isInsideRoot(absolutePath) {
  return absolutePath === FILES_ROOT || absolutePath.startsWith(ROOT_PREFIX);
}

function tryResolve(payload) {
  try {
    return resolveSafePath(payload);
  } catch {
    return null;
  }
}

// Casos exigidos por la auditoria: normales, codificados y doblemente codificados.
const ADVERSARIAL_PAYLOADS = [
  "../package.json",
  "../../",
  `..${BACKSLASH}`,
  "%2e%2e/",
  "..%2F",
  "%252e%252e%252f",
  "/etc/passwd",
  `C:${BACKSLASH}Windows${BACKSLASH}System32`,
];

// Casos que deben rechazarse (escape real o ruta absoluta POSIX).
const REJECTED_PAYLOADS = [
  "../package.json",
  "../../",
  "../",
  "/etc/passwd",
  "/etc/shadow",
];

describe("resolveSafePath: contencion en la raiz permitida", () => {
  test.each(ADVERSARIAL_PAYLOADS)(
    "ningun intento resuelve fuera de la raiz (%s)",
    (payload) => {
      const resolved = tryResolve(payload);

      expect(resolved === null || isInsideRoot(resolved)).toBe(true);
    },
  );
});

describe("resolveSafePath: rechazo de escape y rutas absolutas POSIX", () => {
  test.each(REJECTED_PAYLOADS)("rechaza %s", (payload) => {
    let thrown = null;

    try {
      resolveSafePath(payload);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).not.toBeNull();
    expect(thrown.status).toBe(400);
  });
});

describe("resolveSafePath: archivo valido", () => {
  test("un nombre valido resuelve dentro de la raiz", () => {
    const resolved = resolveSafePath("test_normativa.pdf");

    expect(resolved).toBe(path.join(FILES_ROOT, "test_normativa.pdf"));
    expect(isInsideRoot(resolved)).toBe(true);
  });
});

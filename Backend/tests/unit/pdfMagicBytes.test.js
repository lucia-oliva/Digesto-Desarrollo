import { describe, expect, test } from "@jest/globals";

import { isPdfMagicBytes } from "../../Middleware/fileMiddleware.js";
import { PDF_MAGIC_BYTES } from "../../config/files.js";

// fileMiddleware.js no usa la base de datos: solo instancia multer y define
// helpers, por lo que puede importarse directamente en un test unitario.
describe("isPdfMagicBytes: firma de cabecera PDF", () => {
  test("acepta una cabecera PDF valida (%PDF-1.4)", () => {
    expect(isPdfMagicBytes(Buffer.from("%PDF-1.4\n1 0 obj\n%%EOF\n"))).toBe(
      true,
    );
  });

  test("acepta exactamente la firma %PDF-", () => {
    expect(isPdfMagicBytes(Buffer.from(PDF_MAGIC_BYTES))).toBe(true);
  });

  test("considera solo los primeros bytes de la firma", () => {
    const buffer = Buffer.concat([
      Buffer.from(PDF_MAGIC_BYTES),
      Buffer.from([0x00, 0xff, 0xfe]),
    ]);

    expect(isPdfMagicBytes(buffer)).toBe(true);
  });

  test("rechaza contenido de texto plano", () => {
    expect(isPdfMagicBytes(Buffer.from("esto no es un pdf"))).toBe(false);
  });

  test("rechaza contenido binario arbitrario", () => {
    expect(isPdfMagicBytes(Buffer.from("hello world"))).toBe(false);
  });

  test("rechaza un buffer vacio", () => {
    expect(isPdfMagicBytes(Buffer.alloc(0))).toBe(false);
  });

  test("rechaza un buffer mas corto que la firma", () => {
    expect(isPdfMagicBytes(Buffer.from("%PDF"))).toBe(false);
  });

  test("rechaza un valor que no es Buffer", () => {
    expect(isPdfMagicBytes("%PDF-1.4")).toBe(false);
    expect(isPdfMagicBytes(null)).toBe(false);
    expect(isPdfMagicBytes(undefined)).toBe(false);
  });
});

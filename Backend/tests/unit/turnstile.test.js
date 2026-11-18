import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { verifyContactCaptcha } from "../../utils/turnstile.js";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  delete process.env.TURNSTILE_EXPECTED_HOSTNAME;
});

describe("verificación Turnstile", () => {
  test("envía secreto y token solo desde el backend", async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ success: true, action: "contact" }),
    }));

    await expect(
      verifyContactCaptcha("visitor-token", "127.0.0.1"),
    ).resolves.toBe(true);

    const [url, options] = global.fetch.mock.calls[0];
    const body = new URLSearchParams(options.body);

    expect(url).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    expect(body.get("secret")).toBe("test-turnstile-secret");
    expect(body.get("response")).toBe("visitor-token");
    expect(body.get("remoteip")).toBe("127.0.0.1");
  });

  test("rechaza tokens inválidos con un mensaje público", async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        success: false,
        "error-codes": ["invalid-input-response"],
      }),
    }));

    await expect(
      verifyContactCaptcha("invalid-token", "127.0.0.1"),
    ).rejects.toMatchObject({
      status: 422,
      publicMessage: "No se pudo validar la verificación anti-bot.",
    });
  });

  test("valida action y hostname cuando está configurado", async () => {
    process.env.TURNSTILE_EXPECTED_HOSTNAME = "digesto.unlar.edu.ar";
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        action: "otro-formulario",
        hostname: "evil.example",
      }),
    }));

    await expect(
      verifyContactCaptcha("wrong-context-token", "127.0.0.1"),
    ).rejects.toMatchObject({ status: 422 });
  });
});
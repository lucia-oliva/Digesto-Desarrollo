const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EXPECTED_ACTION = "contact";
const DEFAULT_TIMEOUT_MS = 5000;

function captchaError(status, publicMessage) {
  const error = new Error(publicMessage);
  error.status = status;
  error.publicMessage = publicMessage;
  return error;
}

export async function verifyContactCaptcha(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    throw captchaError(
      503,
      "La verificación anti-bot no está disponible. Intente más tarde.",
    );
  }

  const configuredTimeout = Number(process.env.TURNSTILE_TIMEOUT_MS);
  const timeoutMs =
    Number.isFinite(configuredTimeout) && configuredTimeout > 0
      ? configuredTimeout
      : DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const form = new URLSearchParams({
      secret,
      response: token,
    });

    if (remoteIp) {
      form.set("remoteip", remoteIp);
    }

    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw captchaError(
        503,
        "La verificación anti-bot no está disponible. Intente más tarde.",
      );
    }

    const result = await response.json();
    const expectedHostname = process.env.TURNSTILE_EXPECTED_HOSTNAME?.trim();
    const validHostname =
      !expectedHostname || result.hostname === expectedHostname;
    const validAction = result.action === EXPECTED_ACTION;

    if (!result.success || !validHostname || !validAction) {
      throw captchaError(
        422,
        "No se pudo validar la verificación anti-bot.",
      );
    }

    return true;
  } catch (error) {
    if (error?.status) {
      throw error;
    }

    throw captchaError(
      503,
      "La verificación anti-bot no está disponible. Intente más tarde.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
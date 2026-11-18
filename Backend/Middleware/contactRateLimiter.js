const clients = new Map();
let requestsSinceCleanup = 0;

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function cleanupExpired(now) {
  for (const [key, entry] of clients) {
    if (entry.resetAt <= now) {
      clients.delete(key);
    }
  }
}

export function contactRateLimiter(req, res, next) {
  const windowMs = positiveInteger(
    process.env.CONTACT_RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000,
  );
  const maxRequests = positiveInteger(
    process.env.CONTACT_RATE_LIMIT_MAX,
    5,
  );
  const now = Date.now();
  const key = req.ip || req.socket?.remoteAddress || "unknown";

  requestsSinceCleanup += 1;
  if (requestsSinceCleanup >= 100) {
    cleanupExpired(now);
    requestsSinceCleanup = 0;
  }

  let entry = clients.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    clients.set(key, entry);
  }

  entry.count += 1;
  const remaining = Math.max(0, maxRequests - entry.count);

  res.set("RateLimit-Limit", String(maxRequests));
  res.set("RateLimit-Remaining", String(remaining));
  res.set("RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

  if (entry.count > maxRequests) {
    res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
    return res.status(429).json({
      ok: false,
      msg: "Demasiadas solicitudes. Intente nuevamente más tarde.",
    });
  }

  return next();
}

export function resetContactRateLimiter() {
  clients.clear();
  requestsSinceCleanup = 0;
}
import cors from "cors";
import { ENV } from "./env.js";

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permite herramientas como Postman (sin origin)
    if (!origin) return callback(null, true);
    const ok = ENV.FRONT_ORIGINS.includes(origin);
    return ok ? callback(null, true) : callback(new Error("CORS not allowed"));
  },
  credentials: true,
});

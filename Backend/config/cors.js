import cors from "cors";
import { ENV } from "./env.js";

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed = ENV.FRONT_ORIGINS.includes(origin);

    if (isAllowed) {
      return callback(null, true);
    }

    const error = new Error("CORS origin not allowed");
    error.status = 403;
    error.publicMessage = "Origen no permitido.";

    return callback(error);
  },
  credentials: true,
});

import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./config/cors.js";
import api from "./routes/index.js";
import { notFound, errorHandler } from "./Middleware/errorHandler.js";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

const app = express();


app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMiddleware);


app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);


app.get("/health", (req, res) => res.json({ ok: true, status: "up" }));
app.get("/", (req, res) => res.send("Bienvenido a la API de Digesto!"));


app.use("/api", api);

app.use(notFound);
app.use(errorHandler);

export default app;

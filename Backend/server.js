import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuarios from "./routes/usuarioRoutes.js";
import dependencia from "./routes/dependenciaRoute.js";
import emisores from "./routes/emisoresRoutes.js";
import tipo_normativa from "./routes/tipo_normativaRoutes.js";
import normativa from "./routes/normativaRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import tag from "../Backend/routes/tagsRoutes.js";
import authRoutes from "./routes/authRoute.js";
import contactoRoutes from "../Backend/routes/mailroute.js";
import dashboardRoutes from "../Backend/routes/dashboardRoute.js";


// crear el servidor
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // <--- Dirección de tu frontend
  credentials: true              // <--- Para permitir cookies como el refresh token
}));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    console.log(`[${req.method}] ${req.originalUrl} =>`, body);
    return originalJson.call(this, body);
  };
  next();
});

// rutas de la api
app.use("/api/usuarios", usuarios);
app.use("/api/dependencia", dependencia);
app.use("/api/emisores", emisores);
app.use("/api/tipo_normativa", tipo_normativa);
app.use("/api/normativa", normativa);
app.use("/api/file", fileRoutes);
app.use("/api/tag", tag);
app.use("/api/auth", authRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/dashboard", dashboardRoutes);
//endpoints del login
app.use("/protected", (req,res) => {
  res.send("Esta es una ruta protegida");
})

app.get("/", (req, res) => {
  res.send("Bienvenido a la api de Digesto!");
});

// iniciar el servidor
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

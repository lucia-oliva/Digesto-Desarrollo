// src/routes/index.js
import { Router } from "express";

import usuarios from "./usuarioRoutes.js";
import dependencia from "./dependenciaRoute.js";
import emisores from "./emisoresRoutes.js";
import sesiones from "./sesiones.js";
import tipo_normativa from "./tipo_normativaRoutes.js";
import normativa from "./normativaRoutes.js";
import fileRoutes from "./fileRoutes.js";
import tag from "./tagsRoutes.js";
import authRoutes from "./authRoute.js";
import contactoRoutes from "./mailroute.js";
import dashboardRoutes from "./dashboardRoute.js";
import auditoriaRoutes from "./auditoriaRoute.js";

const api = Router();

const routesMap = [
  ["/usuarios", usuarios],
  ["/dependencia", dependencia],
  ["/emisores", emisores],
  ["/sesiones", sesiones],
  ["/tipo_normativa", tipo_normativa],
  ["/normativa", normativa],
  ["/file", fileRoutes],
  ["/tag", tag],
  ["/auth", authRoutes],
  ["/contacto", contactoRoutes],
  ["/dashboard", dashboardRoutes],
  ["/auditoria", auditoriaRoutes],
];

// Montaje en bucle
for (const [prefix, router] of routesMap) {
  api.use(prefix, router);
}

export default api;

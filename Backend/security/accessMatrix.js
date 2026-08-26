import { POLICIES } from "./policies.js";

export const ENDPOINT_LIFECYCLE = Object.freeze({
  ACTIVE: "active",
  LEGACY: "legacy",
  REMOVE: "remove",
});

export const ROUTE_GROUPS = Object.freeze({
  AUDITORIA: "auditoria",
  AUTH: "auth",
  DASHBOARD: "dashboard",
  DEPENDENCIA: "dependencia",
  EMISORES: "emisores",
  FILE: "file",
  CONTACTO: "contacto",
  NORMATIVA: "normativa",
  RELACIONES: "relaciones",
  SESIONES: "sesiones",
  TAG: "tag",
  TIPO_NORMATIVA: "tipo_normativa",
  USUARIOS: "usuarios",
});

export function normalizeEndpointPath(path) {
  const normalizedPath = String(path).trim();

  return normalizedPath === "/" ? normalizedPath : normalizedPath.replace(/\/+$/, "");
}

function defineEndpoint(
  group,
  method,
  path,
  policy,
  lifecycle = ENDPOINT_LIFECYCLE.ACTIVE,
) {
  return Object.freeze({
    group,
    method: method.toUpperCase(),
    path: normalizeEndpointPath(path),
    policy,
    lifecycle,
  });
}

const endpointRows = [
  // Auditoría 
  [ROUTE_GROUPS.AUDITORIA, "POST", "/api/auditoria/search", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.AUDITORIA, "POST", "/api/auditoria/create", POLICIES.INTERNAL_REMOVE, ENDPOINT_LIFECYCLE.REMOVE],

  // Autenticación 
  [ROUTE_GROUPS.AUTH, "POST", "/api/auth/login", POLICIES.PUBLIC],
  [ROUTE_GROUPS.AUTH, "POST", "/api/auth/refresh-token", POLICIES.PUBLIC],
  [ROUTE_GROUPS.AUTH, "POST", "/api/auth/logout", POLICIES.PUBLIC],

  // Dashboard 
  [ROUTE_GROUPS.DASHBOARD, "GET", "/api/dashboard/resumen", POLICIES.AUTHENTICATED],

  // Dependencias 
  [ROUTE_GROUPS.DEPENDENCIA, "GET", "/api/dependencia/datos/:id", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.DEPENDENCIA, "POST", "/api/dependencia/create", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.DEPENDENCIA, "POST", "/api/dependencia/edit", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.DEPENDENCIA, "GET", "/api/dependencia", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.DEPENDENCIA, "GET", "/api/dependencia/getDependencias", POLICIES.PUBLIC],
  [ROUTE_GROUPS.DEPENDENCIA, "GET", "/api/dependencia/sesiones", POLICIES.CONSEJO],
  [ROUTE_GROUPS.DEPENDENCIA, "GET", "/api/dependencia/name", POLICIES.PUBLIC],
  [ROUTE_GROUPS.DEPENDENCIA, "POST", "/api/dependencia/search", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.DEPENDENCIA, "DELETE", "/api/dependencia/eliminar/:id", POLICIES.SUPER_ADMIN],

  // Emisores 
  [ROUTE_GROUPS.EMISORES, "GET", "/api/emisores/datos/:id", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.EMISORES, "GET", "/api/emisores/name", POLICIES.PUBLIC],
  [ROUTE_GROUPS.EMISORES, "POST", "/api/emisores/edit", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.EMISORES, "GET", "/api/emisores/getEmisores", POLICIES.PUBLIC],
  [ROUTE_GROUPS.EMISORES, "POST", "/api/emisores/create", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.EMISORES, "POST", "/api/emisores/search", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.EMISORES, "DELETE", "/api/emisores/eliminar/:id", POLICIES.SUPER_ADMIN],

  // Archivos 
  [ROUTE_GROUPS.FILE, "GET", "/api/file/download", POLICIES.PUBLIC_PUBLISHED],
  [ROUTE_GROUPS.FILE, "POST", "/api/file/upload/:id", POLICIES.RESOURCE_UPLOAD],
  [ROUTE_GROUPS.FILE, "POST", "/api/file/upload", POLICIES.RESOURCE_UPLOAD],

  // Contacto 
  [ROUTE_GROUPS.CONTACTO, "POST", "/api/contacto", POLICIES.PUBLIC],

  // Normativas 
  [ROUTE_GROUPS.NORMATIVA, "GET", "/api/normativa/datos/:id", POLICIES.PUBLIC_PUBLISHED],
  [ROUTE_GROUPS.NORMATIVA, "POST", "/api/normativa/edit", POLICIES.NORM_ADMIN],
  [ROUTE_GROUPS.NORMATIVA, "POST", "/api/normativa/create", POLICIES.NORM_ADMIN],
  [ROUTE_GROUPS.NORMATIVA, "GET", "/api/normativa/traer/:id", POLICIES.NORM_ADMIN],
  [ROUTE_GROUPS.NORMATIVA, "DELETE", "/api/normativa/eliminar/:id", POLICIES.NORM_ADMIN],
  [ROUTE_GROUPS.NORMATIVA, "POST", "/api/normativa/search", POLICIES.PUBLIC],
  [ROUTE_GROUPS.NORMATIVA, "POST", "/api/normativa/searchEliminadas", POLICIES.NORM_ADMIN],
  [ROUTE_GROUPS.NORMATIVA, "POST", "/api/normativa/searchDespublicadas", POLICIES.NORM_ADMIN],
  [ROUTE_GROUPS.NORMATIVA, "POST", "/api/normativa/search/tag", POLICIES.INTERNAL_REMOVE, ENDPOINT_LIFECYCLE.REMOVE],
  [ROUTE_GROUPS.NORMATIVA, "POST", "/api/normativa/publicar/:id", POLICIES.PUBLISH_NORM],
  [ROUTE_GROUPS.NORMATIVA, "GET", "/api/normativa/yearNormativa", POLICIES.PUBLIC],
  [ROUTE_GROUPS.NORMATIVA, "GET", "/api/normativa/year/:year", POLICIES.INTERNAL_REMOVE, ENDPOINT_LIFECYCLE.REMOVE],
  [ROUTE_GROUPS.NORMATIVA, "GET", "/api/normativa/normativas", POLICIES.INTERNAL_REMOVE, ENDPOINT_LIFECYCLE.REMOVE],
  [ROUTE_GROUPS.NORMATIVA, "GET", "/api/normativa/deleted", POLICIES.NORM_ADMIN],
  [ROUTE_GROUPS.NORMATIVA, "GET", "/api/normativa/mas-buscadas", POLICIES.PUBLIC],
  [ROUTE_GROUPS.NORMATIVA, "PUT", "/api/normativa/update/:id", POLICIES.NORM_ADMIN, ENDPOINT_LIFECYCLE.LEGACY],
  [ROUTE_GROUPS.NORMATIVA, "PUT", "/api/normativa/edit", POLICIES.NORM_ADMIN, ENDPOINT_LIFECYCLE.LEGACY],
  [ROUTE_GROUPS.NORMATIVA, "POST", "/api/normativa/restaurar/:id", POLICIES.NORM_ADMIN],

  // Relaciones 
  [ROUTE_GROUPS.RELACIONES, "GET", "/api/relaciones/:id", POLICIES.PUBLIC_PUBLISHED],
  [ROUTE_GROUPS.RELACIONES, "GET", "/api/relaciones/complementaria/:id", POLICIES.PUBLIC_PUBLISHED],

  // Sesiones del Consejo Superior 
  [ROUTE_GROUPS.SESIONES, "DELETE", "/api/sesiones/eliminar/:id", POLICIES.CONSEJO],
  [ROUTE_GROUPS.SESIONES, "POST", "/api/sesiones/create", POLICIES.CONSEJO],
  [ROUTE_GROUPS.SESIONES, "GET", "/api/sesiones/:id", POLICIES.CONSEJO],

  // Tags 
  [ROUTE_GROUPS.TAG, "DELETE", "/api/tag/eliminar/:id", POLICIES.AUTHENTICATED],
  [ROUTE_GROUPS.TAG, "GET", "/api/tag/datos/:id", POLICIES.AUTHENTICATED],
  [ROUTE_GROUPS.TAG, "GET", "/api/tag/tags", POLICIES.PUBLIC],
  [ROUTE_GROUPS.TAG, "POST", "/api/tag/edit", POLICIES.AUTHENTICATED],
  [ROUTE_GROUPS.TAG, "POST", "/api/tag/create", POLICIES.AUTHENTICATED],
  [ROUTE_GROUPS.TAG, "GET", "/api/tag/tags/:id", POLICIES.PUBLIC_PUBLISHED],
  [ROUTE_GROUPS.TAG, "POST", "/api/tag/tags/normativa/:id", POLICIES.NORM_ADMIN],
  [ROUTE_GROUPS.TAG, "POST", "/api/tag/search", POLICIES.AUTHENTICATED],

  // Tipo de normativa 
  [ROUTE_GROUPS.TIPO_NORMATIVA, "GET", "/api/tipo_normativa/name", POLICIES.PUBLIC],

  // Usuarios 
  [ROUTE_GROUPS.USUARIOS, "POST", "/api/usuarios/cambiar-estado", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.USUARIOS, "POST", "/api/usuarios/create", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.USUARIOS, "POST", "/api/usuarios/edit", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.USUARIOS, "GET", "/api/usuarios", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.USUARIOS, "GET", "/api/usuarios/:id", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.USUARIOS, "GET", "/api/usuarios/datos/:id", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.USUARIOS, "POST", "/api/usuarios", POLICIES.SUPER_ADMIN, ENDPOINT_LIFECYCLE.LEGACY],
  [ROUTE_GROUPS.USUARIOS, "DELETE", "/api/usuarios/eliminar/:id", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.USUARIOS, "PUT", "/api/usuarios/:id", POLICIES.SUPER_ADMIN, ENDPOINT_LIFECYCLE.LEGACY],
  [ROUTE_GROUPS.USUARIOS, "GET", "/api/usuarios/filter/:id", POLICIES.SUPER_ADMIN],
  [ROUTE_GROUPS.USUARIOS, "POST", "/api/usuarios/userEmail", POLICIES.INTERNAL_REMOVE, ENDPOINT_LIFECYCLE.REMOVE],
  [ROUTE_GROUPS.USUARIOS, "POST", "/api/usuarios/search", POLICIES.SUPER_ADMIN],
];

export const ACCESS_MATRIX = Object.freeze(
  endpointRows.map((row) => defineEndpoint(...row)),
);

export function endpointKey(method, path) {
  return `${String(method).toUpperCase()} ${normalizeEndpointPath(path)}`;
}

export function findAccessRule(method, path) {
  const requestedKey = endpointKey(method, path);

  return (
    ACCESS_MATRIX.find(
      (endpoint) => endpointKey(endpoint.method, endpoint.path) === requestedKey,
    ) ?? null
  );
}
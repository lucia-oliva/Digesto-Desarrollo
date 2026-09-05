import { ROLES } from "./roles.js";

export function getAuthorizedDependency(req) {
  const userRoles = Array.isArray(req.user?.roles)
    ? req.user.roles
    : [];

  const isSuperAdmin = userRoles.includes(
    ROLES.SUPER_ADMIN,
  );

  if (isSuperAdmin) {
    return (
      req.query.dependencia ??
      req.body.dependencia ??
      null
    );
  }

  return req.user?.dependenciaId ?? null;
}
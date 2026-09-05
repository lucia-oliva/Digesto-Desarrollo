import {
  ACCESS_SCOPES,
  AUTH_MODES,
  POLICIES,
  getPolicyDefinition,
} from "../security/policies.js";

import { ROLES } from "../security/roles.js";

export function authorizePolicy(
  policy,
  {
    getResourceDependencyId,
    getTargetDependencyId,
    getResourceAccessContext,
    getUserDependency,
    getDestinationType,
  } = {},
) {
  const definition = getPolicyDefinition(policy);

  if (!definition) {
    throw new Error(`Política RBAC desconocida: ${policy}`);
  }

  const supportedAuthMode =
    definition.authMode === AUTH_MODES.REQUIRED ||
    definition.authMode === AUTH_MODES.CONDITIONAL;

  if (!supportedAuthMode) {
    throw new Error(
      `La política ${policy} no corresponde a una ruta RBAC protegida`,
    );
  }

  return async (req, res, next) => {
    try {
    
      if (
        definition.authMode === AUTH_MODES.CONDITIONAL &&
        definition.scope === ACCESS_SCOPES.PUBLISHED_RESOURCE
      ) {
        if (typeof getResourceAccessContext !== "function") {
          throw new Error(
            `La política ${policy} requiere resolver el estado y la dependencia del recurso`,
          );
        }

        const resource = await getResourceAccessContext(req);

        if (resource.estado === "publicado") {
          return next();
        }

        if (!req.user) {
          return res.status(401).json({
            error: "Usuario no autenticado",
          });
        }

        const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [];

        const normAdminDefinition = getPolicyDefinition(POLICIES.NORM_ADMIN);

        const hasNormAdminRole = userRoles.some((role) =>
          normAdminDefinition.allowedRoles.includes(role),
        );

        if (!hasNormAdminRole) {
          return res.status(403).json({
            error: "No tiene permisos para acceder a este recurso",
          });
        }

        const isSuperAdmin = userRoles.includes(ROLES.SUPER_ADMIN);

        if (isSuperAdmin) {
          return next();
        }

        if (resource.resourceType === "consejo") {
          if (!req.user.dependenciaId) {
            return res.status(403).json({
              error: "No tiene una dependencia autorizada",
            });
          }

          if (typeof getUserDependency !== "function") {
            throw new Error(
              `La política ${policy} requiere resolver la dependencia del usuario`,
            );
          }

          const userDependency = await getUserDependency(req);

          const isConsejoSuperior =
            String(userDependency?.nombre ?? "")
              .trim()
              .toLowerCase() === "consejo superior";

          if (!isConsejoSuperior) {
            return res.status(403).json({
              error:
                "No tiene permisos sobre este recurso del Consejo Superior",
            });
          }

          return next();
        }

        if (
          resource.resourceType === "normativa" ||
          resource.resourceType == null
        ) {
          if (!req.user.dependenciaId) {
            return res.status(403).json({
              error: "No tiene una dependencia autorizada",
            });
          }

          const sameDependency =
            String(resource.dependenciaId) === String(req.user.dependenciaId);

          if (!sameDependency) {
            return res.status(403).json({
              error: "No tiene permisos sobre este recurso",
            });
          }

          return next();
        }

        return res.status(403).json({
          error: "Tipo de recurso no autorizado",
        });
      }

  
      if (!req.user) {
        return res.status(401).json({
          error: "Usuario no autenticado",
        });
      }

      const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [];

      const hasAllowedRole = userRoles.some((role) =>
        definition.allowedRoles.includes(role),
      );

      if (!hasAllowedRole) {
        return res.status(403).json({
          error: "No tiene permisos para realizar esta operación",
        });
      }

      if (definition.scope === ACCESS_SCOPES.CONSEJO_SUPERIOR) {
        const isSuperAdmin = userRoles.includes(ROLES.SUPER_ADMIN);

        if (isSuperAdmin) {
          return next();
        }

        if (!req.user.dependenciaId) {
          return res.status(403).json({
            error: "No tiene una dependencia autorizada",
          });
        }

        if (typeof getUserDependency !== "function") {
          throw new Error(
            `La política ${policy} requiere resolver la dependencia del usuario`,
          );
        }

        const userDependency = await getUserDependency(req);

        if (!userDependency) {
          return res.status(403).json({
            error: "No tiene una dependencia autorizada",
          });
        }

        const isConsejoSuperior =
          String(userDependency.nombre).trim().toLowerCase() ===
          "consejo superior";

        if (!isConsejoSuperior) {
          return res.status(403).json({
            error:
              "No tiene permisos para acceder a sesiones del Consejo Superior",
          });
        }

        return next();
      }

      if (definition.scope === ACCESS_SCOPES.RESOURCE_DESTINATION) {
        const isSuperAdmin = userRoles.includes(ROLES.SUPER_ADMIN);

        if (isSuperAdmin) {
          return next();
        }

        if (!req.user.dependenciaId) {
          return res.status(403).json({
            error: "No tiene una dependencia autorizada",
          });
        }

        if (typeof getDestinationType !== "function") {
          throw new Error(
            `La política ${policy} requiere resolver el tipo de recurso destino`,
          );
        }

        const destinationType = await getDestinationType(req);

        if (destinationType === "consejo" || destinationType === "acta") {
          if (typeof getUserDependency !== "function") {
            throw new Error(
              `La política ${policy} requiere resolver la dependencia del usuario`,
            );
          }

          const userDependency = await getUserDependency(req);

          const isConsejoSuperior =
            String(userDependency?.nombre ?? "")
              .trim()
              .toLowerCase() === "consejo superior";

          if (!isConsejoSuperior) {
            return res.status(403).json({
              error:
                "No tiene permisos para subir archivos del Consejo Superior",
            });
          }

          return next();
        }

        if (destinationType === "normativa") {
          const hasResourceDependencyResolver =
            typeof getResourceDependencyId === "function";

          const hasTargetDependencyResolver =
            typeof getTargetDependencyId === "function";

          if (!hasResourceDependencyResolver && !hasTargetDependencyResolver) {
            throw new Error(
              `La política ${policy} requiere resolver la dependencia del recurso destino`,
            );
          }

          if (hasResourceDependencyResolver) {
            const resourceDependencyId = await getResourceDependencyId(req);

            const sameResourceDependency =
              String(resourceDependencyId) === String(req.user.dependenciaId);

            if (!sameResourceDependency) {
              return res.status(403).json({
                error: "No tiene permisos sobre el recurso destino",
              });
            }
          }

          if (hasTargetDependencyResolver) {
            const targetDependencyId = await getTargetDependencyId(req);

            const sameTargetDependency =
              String(targetDependencyId) === String(req.user.dependenciaId);

            if (!sameTargetDependency) {
              return res.status(403).json({
                error:
                  "No tiene permisos para subir archivos a esa dependencia",
              });
            }
          }

          return next();
        }

        return res.status(403).json({
          error: "Tipo de recurso destino no autorizado",
        });
      }

      const requiresOwnDependency =
        definition.scope === ACCESS_SCOPES.OWN_DEPENDENCY_OR_GLOBAL ||
        definition.scope === ACCESS_SCOPES.OWN_DEPENDENCY_PUBLISH_OR_GLOBAL;

      if (requiresOwnDependency) {
        const isSuperAdmin = userRoles.includes(ROLES.SUPER_ADMIN);

        if (isSuperAdmin) {
          return next();
        }

        if (!req.user.dependenciaId) {
          return res.status(403).json({
            error: "No tiene una dependencia autorizada",
          });
        }

        const hasResourceDependencyResolver =
          typeof getResourceDependencyId === "function";

        const hasTargetDependencyResolver =
          typeof getTargetDependencyId === "function";

        if (!hasResourceDependencyResolver && !hasTargetDependencyResolver) {
          throw new Error(
            `La política ${policy} requiere resolver una dependencia`,
          );
        }

        if (hasResourceDependencyResolver) {
          const resourceDependencyId = await getResourceDependencyId(req);

          const sameResourceDependency =
            String(resourceDependencyId) === String(req.user.dependenciaId);

          if (!sameResourceDependency) {
            return res.status(403).json({
              error: "No tiene permisos sobre este recurso",
            });
          }
        }

        if (hasTargetDependencyResolver) {
          const targetDependencyId = await getTargetDependencyId(req);

          const sameTargetDependency =
            String(targetDependencyId) === String(req.user.dependenciaId);

          if (!sameTargetDependency) {
            return res.status(403).json({
              error:
                "No tiene permisos para asignar el recurso a esa dependencia",
            });
          }
        }
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function getAuthorizedDependency(req) {
  const userRoles = Array.isArray(req.user?.roles) ? req.user.roles : [];

  const isSuperAdmin = userRoles.includes(ROLES.SUPER_ADMIN);

  if (isSuperAdmin) {
    return req.query.dependencia ?? req.body.dependencia ?? null;
  }

  return req.user?.dependenciaId ?? null;
}

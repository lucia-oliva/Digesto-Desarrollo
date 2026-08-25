import { ALL_ROLES, ROLES } from "./roles.js";

export const POLICIES = Object.freeze({
  PUBLIC: "PUBLIC",
  PUBLIC_PUBLISHED: "PUBLIC_PUBLISHED",
  AUTHENTICATED: "AUTHENTICATED",
  SUPER_ADMIN: "SUPER_ADMIN",
  NORM_ADMIN: "NORM_ADMIN",
  PUBLISH_NORM: "PUBLISH_NORM",
  CONSEJO: "CONSEJO",
  RESOURCE_UPLOAD: "RESOURCE_UPLOAD",
  INTERNAL_REMOVE: "INTERNAL_REMOVE",
});

export const AUTH_MODES = Object.freeze({
  PUBLIC: "public",
  CONDITIONAL: "conditional",
  REQUIRED: "required",
  INTERNAL: "internal",
});

export const ACCESS_SCOPES = Object.freeze({
  PUBLIC: "public",
  PUBLISHED_RESOURCE: "published-resource",
  GLOBAL: "global",
  OWN_DEPENDENCY_OR_GLOBAL: "own-dependency-or-global",
  OWN_DEPENDENCY_PUBLISH_OR_GLOBAL:
    "own-dependency-publish-or-global",
  CONSEJO_SUPERIOR: "consejo-superior",
  RESOURCE_DESTINATION: "resource-destination",
  INTERNAL: "internal",
});

function createPolicy({
  authMode,
  allowedRoles,
  scope,
  external = true,
}) {
  return Object.freeze({
    authMode,
    allowedRoles: Object.freeze([...allowedRoles]),
    scope,
    external,
  });
}

export const POLICY_DEFINITIONS = Object.freeze({
  [POLICIES.PUBLIC]: createPolicy({
    authMode: AUTH_MODES.PUBLIC,
    allowedRoles: ALL_ROLES,
    scope: ACCESS_SCOPES.PUBLIC,
  }),

  [POLICIES.PUBLIC_PUBLISHED]: createPolicy({
    authMode: AUTH_MODES.CONDITIONAL,
    allowedRoles: ALL_ROLES,
    scope: ACCESS_SCOPES.PUBLISHED_RESOURCE,
  }),

  [POLICIES.AUTHENTICATED]: createPolicy({
    authMode: AUTH_MODES.REQUIRED,
    allowedRoles: ALL_ROLES,
    scope: ACCESS_SCOPES.GLOBAL,
  }),

  [POLICIES.SUPER_ADMIN]: createPolicy({
    authMode: AUTH_MODES.REQUIRED,
    allowedRoles: [ROLES.SUPER_ADMIN],
    scope: ACCESS_SCOPES.GLOBAL,
  }),

  [POLICIES.NORM_ADMIN]: createPolicy({
    authMode: AUTH_MODES.REQUIRED,
    allowedRoles: ALL_ROLES,
    scope: ACCESS_SCOPES.OWN_DEPENDENCY_OR_GLOBAL,
  }),

  [POLICIES.PUBLISH_NORM]: createPolicy({
    authMode: AUTH_MODES.REQUIRED,
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.SUPERVISOR,
    ],
    scope: ACCESS_SCOPES.OWN_DEPENDENCY_PUBLISH_OR_GLOBAL,
  }),

  [POLICIES.CONSEJO]: createPolicy({
    authMode: AUTH_MODES.REQUIRED,
    allowedRoles: ALL_ROLES,
    scope: ACCESS_SCOPES.CONSEJO_SUPERIOR,
  }),

  [POLICIES.RESOURCE_UPLOAD]: createPolicy({
    authMode: AUTH_MODES.REQUIRED,
    allowedRoles: ALL_ROLES,
    scope: ACCESS_SCOPES.RESOURCE_DESTINATION,
  }),

  [POLICIES.INTERNAL_REMOVE]: createPolicy({
    authMode: AUTH_MODES.INTERNAL,
    allowedRoles: [],
    scope: ACCESS_SCOPES.INTERNAL,
    external: false,
  }),
});

export const ALL_POLICIES = Object.freeze(
  Object.values(POLICIES),
);

export function isValidPolicy(policy) {
  return ALL_POLICIES.includes(policy);
}

export function getPolicyDefinition(policy) {
  return POLICY_DEFINITIONS[policy] ?? null;
}
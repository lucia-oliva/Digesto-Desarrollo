import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";

import { ACCESS_MATRIX, endpointKey } from "../../security/accessMatrix.js";
import {
  ACCESS_SCOPES,
  AUTH_MODES,
  getPolicyDefinition,
} from "../../security/policies.js";
import { ROLES } from "../../security/roles.js";
import {
  CONSEJO_DEPENDENCY_ID,
  DEFAULT_DEPENDENCY_ID,
  TEST_ROLES,
  createAccessTokenForRole,
} from "../helpers/authTokens.js";
import {
  resetRbacMockState,
  setRbacResourceState,
} from "../helpers/rbacMocks.js";
import { buildRbacRequest } from "../helpers/rbacRequests.js";

let app;

beforeAll(async () => {
  ({ default: app } = await import("../../app.js"));
});

beforeEach(() => {
  resetRbacMockState();
});

const requiredEndpoints = ACCESS_MATRIX.filter(
  ({ policy }) => getPolicyDefinition(policy)?.authMode === AUTH_MODES.REQUIRED,
);

const conditionalEndpoints = ACCESS_MATRIX.filter(
  ({ policy }) =>
    getPolicyDefinition(policy)?.authMode === AUTH_MODES.CONDITIONAL,
);

const roleCases = requiredEndpoints.flatMap((endpoint) => {
  const definition = getPolicyDefinition(endpoint.policy);

  return TEST_ROLES.map((role) => ({
    ...endpoint,
    role,
    roleAllowed: definition.allowedRoles.includes(role),
    scope: definition.scope,
  }));
});

const allowedRoleCases = roleCases.filter(({ roleAllowed }) => roleAllowed);
const deniedRoleCases = roleCases.filter(({ roleAllowed }) => !roleAllowed);

function dependencyForScope(scope) {
  return scope === ACCESS_SCOPES.CONSEJO_SUPERIOR
    ? CONSEJO_DEPENDENCY_ID
    : DEFAULT_DEPENDENCY_ID;
}

describe("matriz RBAC: cobertura", () => {
  test("incluye todas las rutas con autenticación obligatoria", () => {
    expect(requiredEndpoints).toHaveLength(44);
    expect(roleCases).toHaveLength(requiredEndpoints.length * TEST_ROLES.length);
  });

  test("genera una clave única para cada endpoint protegido", () => {
    const keys = requiredEndpoints.map(({ method, path }) =>
      endpointKey(method, path),
    );

    expect(new Set(keys).size).toBe(requiredEndpoints.length);
  });
});

describe("matriz RBAC: sin autenticación", () => {
  test.each(requiredEndpoints)(
    "$method $path | SIN_TOKEN => 401",
    async (endpoint) => {
      const response = await buildRbacRequest(app, endpoint);

      expect(response.status).toBe(401);
    },
  );
});

describe("matriz RBAC: roles rechazados", () => {
  test.each(deniedRoleCases)(
    "$method $path | $role => 403",
    async ({ role, ...endpoint }) => {
      const token = createAccessTokenForRole(role);
      const response = await buildRbacRequest(app, endpoint, { token });

      expect(response.status).toBe(403);
    },
  );
});

describe("matriz RBAC: roles permitidos", () => {
  test.each(allowedRoleCases)(
    "$method $path | $role => permitido",
    async ({ role, scope, ...endpoint }) => {
      const token = createAccessTokenForRole(role, {
        dependenciaId: dependencyForScope(scope),
      });
      const response = await buildRbacRequest(app, endpoint, { token });

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
    },
  );
});

const foreignDependencyCases = [
  ["POST", "/api/normativa/edit"],
  ["POST", "/api/normativa/create"],
  ["GET", "/api/normativa/traer/:id"],
  ["DELETE", "/api/normativa/eliminar/:id"],
  ["POST", "/api/normativa/publicar/:id"],
  ["POST", "/api/normativa/restaurar/:id"],
  ["POST", "/api/file/upload/:id"],
  ["POST", "/api/file/upload"],
  ["GET", "/api/dependencia/sesiones"],
  ["DELETE", "/api/sesiones/eliminar/:id"],
  ["POST", "/api/sesiones/create"],
  ["GET", "/api/sesiones/:id"],
].map(([method, path]) => ({ method, path }));

describe("matriz RBAC: alcance por dependencia", () => {
  test.each(foreignDependencyCases)(
    "$method $path | dependencia ajena => 403",
    async (endpoint) => {
      const token = createAccessTokenForRole(ROLES.SUPERVISOR, {
        dependenciaId: 99,
      });
      const response = await buildRbacRequest(app, endpoint, { token });

      expect(response.status).toBe(403);
    },
  );
});

describe("matriz RBAC: recursos de acceso condicionado", () => {
  test.each(conditionalEndpoints)(
    "$method $path | no publicado y SIN_TOKEN => 401",
    async (endpoint) => {
      setRbacResourceState("despublicado");

      const response = await buildRbacRequest(app, endpoint);

      expect(response.status).toBe(401);
    },
  );

  test.each(conditionalEndpoints)(
    "$method $path | no publicado y dependencia ajena => 403",
    async (endpoint) => {
      setRbacResourceState("despublicado");
      const token = createAccessTokenForRole(ROLES.SUPERVISOR, {
        dependenciaId: 99,
      });

      const response = await buildRbacRequest(app, endpoint, { token });

      expect(response.status).toBe(403);
    },
  );

  test.each(conditionalEndpoints)(
    "$method $path | no publicado y misma dependencia => permitido",
    async (endpoint) => {
      setRbacResourceState("despublicado");
      const token = createAccessTokenForRole(ROLES.SUPERVISOR);

      const response = await buildRbacRequest(app, endpoint, { token });

      expect([401, 403]).not.toContain(response.status);
      expect(response.status).toBeLessThan(500);
    },
  );

  test.each(conditionalEndpoints)(
    "$method $path | publicado y SIN_TOKEN => permitido",
    async (endpoint) => {
      setRbacResourceState("publicado");

      const response = await buildRbacRequest(app, endpoint);

      expect([401, 403]).not.toContain(response.status);
      expect(response.status).toBeLessThan(500);
    },
  );
});

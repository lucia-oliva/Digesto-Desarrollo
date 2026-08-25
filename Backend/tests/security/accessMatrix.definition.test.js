import { describe, expect, test } from "@jest/globals";

import {
  ALL_ROLES,
  ROLES,
  isValidRole,
} from "../../security/roles.js";

import {
  ACCESS_SCOPES,
  ALL_POLICIES,
  AUTH_MODES,
  POLICIES,
  POLICY_DEFINITIONS,
  getPolicyDefinition,
  isValidPolicy,
} from "../../security/policies.js";

describe("catálogo de roles de acceso", () => {
  test("define exactamente los tres roles aprobados", () => {
    expect(ALL_ROLES).toEqual([
      "SuperAdministrador",
      "Supervisor",
      "Administrador de Dependencia",
    ]);
  });

  test("no contiene roles repetidos", () => {
    expect(new Set(ALL_ROLES).size).toBe(ALL_ROLES.length);
  });

  test("reconoce solamente los nombres canónicos", () => {
    expect(isValidRole(ROLES.SUPER_ADMIN)).toBe(true);
    expect(isValidRole(ROLES.SUPERVISOR)).toBe(true);
    expect(isValidRole(ROLES.DEPENDENCY_ADMIN)).toBe(true);

    expect(isValidRole("supervisor")).toBe(false);
    expect(isValidRole("Administrador")).toBe(false);
    expect(isValidRole("")).toBe(false);
  });
});

describe("catálogo de políticas de acceso", () => {
  test("define exactamente las nueve políticas aprobadas", () => {
    expect(ALL_POLICIES).toEqual([
      "PUBLIC",
      "PUBLIC_PUBLISHED",
      "AUTHENTICATED",
      "SUPER_ADMIN",
      "NORM_ADMIN",
      "PUBLISH_NORM",
      "CONSEJO",
      "RESOURCE_UPLOAD",
      "INTERNAL_REMOVE",
    ]);

    expect(Object.keys(POLICY_DEFINITIONS)).toHaveLength(9);
  });

  test.each(ALL_POLICIES)(
    "%s tiene una definición válida",
    (policyName) => {
      const definition = getPolicyDefinition(policyName);

      expect(definition).not.toBeNull();
      expect(isValidPolicy(policyName)).toBe(true);
      expect(Object.values(AUTH_MODES)).toContain(
        definition.authMode,
      );
      expect(Object.values(ACCESS_SCOPES)).toContain(
        definition.scope,
      );
      expect(Array.isArray(definition.allowedRoles)).toBe(true);
      expect(typeof definition.external).toBe("boolean");

      expect(new Set(definition.allowedRoles).size).toBe(
        definition.allowedRoles.length,
      );

      for (const role of definition.allowedRoles) {
        expect(isValidRole(role)).toBe(true);
      }
    },
  );

  test("asigna correctamente los roles permitidos", () => {
    expect(
      POLICY_DEFINITIONS[POLICIES.AUTHENTICATED].allowedRoles,
    ).toEqual(ALL_ROLES);

    expect(
      POLICY_DEFINITIONS[POLICIES.SUPER_ADMIN].allowedRoles,
    ).toEqual([ROLES.SUPER_ADMIN]);

    expect(
      POLICY_DEFINITIONS[POLICIES.NORM_ADMIN].allowedRoles,
    ).toEqual(ALL_ROLES);

    expect(
      POLICY_DEFINITIONS[POLICIES.PUBLISH_NORM].allowedRoles,
    ).toEqual([
      ROLES.SUPER_ADMIN,
      ROLES.SUPERVISOR,
    ]);

    expect(
      POLICY_DEFINITIONS[POLICIES.CONSEJO].allowedRoles,
    ).toEqual(ALL_ROLES);

    expect(
      POLICY_DEFINITIONS[POLICIES.RESOURCE_UPLOAD].allowedRoles,
    ).toEqual(ALL_ROLES);
  });

  test("distingue acceso público de acceso condicionado", () => {
    expect(
      POLICY_DEFINITIONS[POLICIES.PUBLIC].authMode,
    ).toBe(AUTH_MODES.PUBLIC);

    expect(
      POLICY_DEFINITIONS[POLICIES.PUBLIC_PUBLISHED].authMode,
    ).toBe(AUTH_MODES.CONDITIONAL);

    expect(
      POLICY_DEFINITIONS[POLICIES.PUBLIC_PUBLISHED].scope,
    ).toBe(ACCESS_SCOPES.PUBLISHED_RESOURCE);
  });

  test("marca las rutas internas para retirar", () => {
    const internalPolicy =
      POLICY_DEFINITIONS[POLICIES.INTERNAL_REMOVE];

    expect(internalPolicy.authMode).toBe(AUTH_MODES.INTERNAL);
    expect(internalPolicy.scope).toBe(ACCESS_SCOPES.INTERNAL);
    expect(internalPolicy.allowedRoles).toEqual([]);
    expect(internalPolicy.external).toBe(false);
  });
});
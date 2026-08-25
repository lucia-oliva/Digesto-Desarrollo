import {
  ACCESS_MATRIX,
  ENDPOINT_LIFECYCLE,
  ROUTE_GROUPS,
  endpointKey,
  findAccessRule,
  normalizeEndpointPath,
} from "../../security/accessMatrix.js";
import { isValidPolicy } from "../../security/policies.js";

const ALLOWED_HTTP_METHODS = Object.freeze([
  "GET",
  "POST",
  "PUT",
  "DELETE",
]);

describe("integridad de la matriz de acceso", () => {
  test("contiene los 74 endpoints relevados", () => {
    expect(ACCESS_MATRIX).toHaveLength(74);
  });

  test("no contiene combinaciones de método y ruta repetidas", () => {
    const endpointKeys = ACCESS_MATRIX.map(({ method, path }) =>
      endpointKey(method, path),
    );

    expect(new Set(endpointKeys).size).toBe(endpointKeys.length);
  });

  test("todos los endpoints utilizan una política existente", () => {
    for (const endpoint of ACCESS_MATRIX) {
      expect({
        endpoint: endpointKey(endpoint.method, endpoint.path),
        policy: endpoint.policy,
        isValid: isValidPolicy(endpoint.policy),
      }).toEqual({
        endpoint: endpointKey(endpoint.method, endpoint.path),
        policy: endpoint.policy,
        isValid: true,
      });
    }
  });

  test("todos los endpoints pertenecen a un grupo conocido", () => {
    const validGroups = Object.values(ROUTE_GROUPS);

    for (const endpoint of ACCESS_MATRIX) {
      expect(validGroups).toContain(endpoint.group);
    }
  });

  test("todos los endpoints tienen un ciclo de vida válido", () => {
    const validLifecycles = Object.values(ENDPOINT_LIFECYCLE);

    for (const endpoint of ACCESS_MATRIX) {
      expect(validLifecycles).toContain(endpoint.lifecycle);
    }
  });

  test("todos los endpoints utilizan un método HTTP permitido", () => {
    for (const endpoint of ACCESS_MATRIX) {
      expect(ALLOWED_HTTP_METHODS).toContain(endpoint.method);
    }
  });

  test("todas las rutas tienen un formato normalizado", () => {
    for (const endpoint of ACCESS_MATRIX) {
      expect(endpoint.path).toMatch(/^\/api(?:\/|$)/);
      expect(endpoint.path).toBe(normalizeEndpointPath(endpoint.path));
      expect(endpoint.path).not.toContain("?");
    }
  });

  test("la matriz y sus endpoints son inmutables", () => {
    expect(Object.isFrozen(ACCESS_MATRIX)).toBe(true);

    for (const endpoint of ACCESS_MATRIX) {
      expect(Object.isFrozen(endpoint)).toBe(true);
    }
  });
});

describe("utilidades de la matriz de acceso", () => {
  test("normaliza espacios y barras finales", () => {
    expect(normalizeEndpointPath("  /api/usuarios/  ")).toBe(
      "/api/usuarios",
    );
    expect(normalizeEndpointPath("/")).toBe("/");
  });

  test("genera una clave canónica con método y ruta", () => {
    expect(endpointKey("post", "/api/usuarios/create/")).toBe(
      "POST /api/usuarios/create",
    );
  });

  test("encuentra una regla sin depender de mayúsculas o barra final", () => {
    const rule = findAccessRule("post", "/api/usuarios/create/");

    expect(rule).toMatchObject({
      method: "POST",
      path: "/api/usuarios/create",
      group: ROUTE_GROUPS.USUARIOS,
    });
  });

  test("devuelve null cuando el endpoint no está declarado", () => {
    expect(findAccessRule("GET", "/api/no-existe")).toBeNull();
  });
});
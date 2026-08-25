import { ROUTES_MAP } from "../../routes/index.js";
import {
  ACCESS_MATRIX,
  endpointKey,
  normalizeEndpointPath,
} from "../../security/accessMatrix.js";

function joinRoutePath(...parts) {
  const joinedPath = parts
    .map((part) => String(part).replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");

  return normalizeEndpointPath(`/${joinedPath}`);
}

function getRoutePaths(routePath) {
  const paths = Array.isArray(routePath) ? routePath : [routePath];

  for (const path of paths) {
    if (typeof path !== "string") {
      throw new TypeError(
        "El inventario automático solo admite rutas Express declaradas como texto.",
      );
    }
  }

  return paths;
}

function getExpressRouteInventory() {
  return ROUTES_MAP.flatMap(([prefix, router]) => {
    if (!Array.isArray(router?.stack)) {
      throw new TypeError(`El router montado en ${prefix} no expone su stack.`);
    }

    return router.stack.flatMap((layer) => {
      if (!layer.route) {
        return [];
      }

      const methods = Object.entries(layer.route.methods)
        .filter(([, enabled]) => enabled)
        .map(([method]) => method.toUpperCase());

      return getRoutePaths(layer.route.path).flatMap((path) =>
        methods.map((method) => ({
          method,
          path: joinRoutePath("/api", prefix, path),
        })),
      );
    });
  });
}

function sortedEndpointKeys(endpoints) {
  return endpoints
    .map(({ method, path }) => endpointKey(method, path))
    .sort((left, right) => left.localeCompare(right));
}

describe("correspondencia entre Express y la matriz de acceso", () => {
  const expressRoutes = getExpressRouteInventory();
  const expressKeys = sortedEndpointKeys(expressRoutes);
  const matrixKeys = sortedEndpointKeys(ACCESS_MATRIX);

  test("Express no registra endpoints duplicados", () => {
    expect(new Set(expressKeys).size).toBe(expressKeys.length);
  });

  test("la cantidad de rutas Express coincide con la matriz", () => {
    expect(expressRoutes).toHaveLength(ACCESS_MATRIX.length);
  });

  test("cada ruta Express tiene exactamente una regla de acceso", () => {
    const expressKeySet = new Set(expressKeys);
    const matrixKeySet = new Set(matrixKeys);

    const missingInMatrix = expressKeys.filter(
      (key) => !matrixKeySet.has(key),
    );
    const missingInExpress = matrixKeys.filter(
      (key) => !expressKeySet.has(key),
    );

    expect({ missingInMatrix, missingInExpress }).toEqual({
      missingInMatrix: [],
      missingInExpress: [],
    });
  });
});
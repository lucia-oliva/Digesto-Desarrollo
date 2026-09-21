import { describe, expect, jest, test } from "@jest/globals";

import { authorizePolicy } from "../../Middleware/rbacMiddleware.js";
import { POLICIES } from "../../security/policies.js";
import { ROLES } from "../../security/roles.js";

function createResponse() {
  const res = {};
  res.status = jest.fn((statusCode) => {
    res.statusCode = statusCode;
    return res;
  });
  res.json = jest.fn((body) => {
    res.body = body;
    return res;
  });
  return res;
}

async function executeMiddleware(policy, req, resolvers = {}) {
  const res = createResponse();
  const next = jest.fn();
  const middleware = authorizePolicy(policy, resolvers);

  await middleware(req, res, next);

  return { res, next };
}

function authenticatedUser(role, dependenciaId = 3) {
  return {
    user: {
      sub: "47",
      roles: [role],
      dependenciaId,
    },
  };
}

describe("authorizePolicy: configuración", () => {
  test("rechaza una política desconocida", () => {
    expect(() => authorizePolicy("NO_EXISTE")).toThrow(
      "Política RBAC desconocida",
    );
  });

  test.each([POLICIES.PUBLIC, POLICIES.INTERNAL_REMOVE])(
    "rechaza la política %s como middleware RBAC",
    (policy) => {
      expect(() => authorizePolicy(policy)).toThrow(
        "no corresponde a una ruta RBAC protegida",
      );
    },
  );
});

describe("authorizePolicy: autenticación y rol", () => {
  test("responde 401 cuando la política obligatoria no recibe usuario", async () => {
    const { res, next } = await executeMiddleware(
      POLICIES.AUTHENTICATED,
      {},
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("responde 403 cuando el rol no está autorizado", async () => {
    const { res, next } = await executeMiddleware(POLICIES.SUPER_ADMIN, {
      user: { sub: "47", roles: [ROLES.SUPERVISOR], dependenciaId: 3 },
    });

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("permite continuar al rol autorizado", async () => {
    const { res, next } = await executeMiddleware(
      POLICIES.SUPER_ADMIN,
      authenticatedUser(ROLES.SUPER_ADMIN),
    );

    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("authorizePolicy: alcance por dependencia", () => {
  test("permite operar sobre un recurso de la misma dependencia", async () => {
    const { next } = await executeMiddleware(
      POLICIES.NORM_ADMIN,
      authenticatedUser(ROLES.DEPENDENCY_ADMIN, 3),
      { getResourceDependencyId: async () => 3 },
    );

    expect(next).toHaveBeenCalledWith();
  });

  test("rechaza un recurso de otra dependencia", async () => {
    const { res, next } = await executeMiddleware(
      POLICIES.NORM_ADMIN,
      authenticatedUser(ROLES.DEPENDENCY_ADMIN, 3),
      { getResourceDependencyId: async () => 4 },
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("no permite publicar a un Administrador de Dependencia", async () => {
    const { res, next } = await executeMiddleware(
      POLICIES.PUBLISH_NORM,
      authenticatedUser(ROLES.DEPENDENCY_ADMIN, 3),
      { getResourceDependencyId: async () => 3 },
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("permite publicar al Supervisor dentro de su dependencia", async () => {
    const { next } = await executeMiddleware(
      POLICIES.PUBLISH_NORM,
      authenticatedUser(ROLES.SUPERVISOR, 3),
      { getResourceDependencyId: async () => 3 },
    );

    expect(next).toHaveBeenCalledWith();
  });
});

describe("authorizePolicy: Consejo Superior y uploads", () => {
  test("permite CONSEJO a un usuario de Consejo Superior", async () => {
    const { next } = await executeMiddleware(
      POLICIES.CONSEJO,
      authenticatedUser(ROLES.SUPERVISOR, 20),
      { getUserDependency: async () => ({ nombre: "Consejo Superior" }) },
    );

    expect(next).toHaveBeenCalledWith();
  });

  test("rechaza CONSEJO a una dependencia distinta", async () => {
    const { res, next } = await executeMiddleware(
      POLICIES.CONSEJO,
      authenticatedUser(ROLES.SUPERVISOR, 3),
      { getUserDependency: async () => ({ nombre: "Ciencias de la Salud" }) },
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("permite subir una normativa a la misma dependencia", async () => {
    const { next } = await executeMiddleware(
      POLICIES.RESOURCE_UPLOAD,
      authenticatedUser(ROLES.DEPENDENCY_ADMIN, 3),
      {
        getDestinationType: async () => "normativa",
        getResourceDependencyId: async () => 3,
      },
    );

    expect(next).toHaveBeenCalledWith();
  });

  test("rechaza subir una normativa de otra dependencia", async () => {
    const { res, next } = await executeMiddleware(
      POLICIES.RESOURCE_UPLOAD,
      authenticatedUser(ROLES.DEPENDENCY_ADMIN, 3),
      {
        getDestinationType: async () => "normativa",
        getResourceDependencyId: async () => 4,
      },
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("authorizePolicy: recurso publicado o condicionado", () => {
  test("permite un recurso publicado sin autenticación", async () => {
    const { next } = await executeMiddleware(
      POLICIES.PUBLIC_PUBLISHED,
      {},
      {
        getResourceAccessContext: async () => ({
          estado: "publicado",
          dependenciaId: 3,
          resourceType: "normativa",
        }),
      },
    );

    expect(next).toHaveBeenCalledWith();
  });

  test("exige autenticación para un recurso no publicado", async () => {
    const { res, next } = await executeMiddleware(
      POLICIES.PUBLIC_PUBLISHED,
      {},
      {
        getResourceAccessContext: async () => ({
          estado: "despublicado",
          dependenciaId: 3,
          resourceType: "normativa",
        }),
      },
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("permite un recurso no publicado de la misma dependencia", async () => {
    const { next } = await executeMiddleware(
      POLICIES.PUBLIC_PUBLISHED,
      authenticatedUser(ROLES.SUPERVISOR, 3),
      {
        getResourceAccessContext: async () => ({
          estado: "despublicado",
          dependenciaId: 3,
          resourceType: "normativa",
        }),
      },
    );

    expect(next).toHaveBeenCalledWith();
  });

  test("propaga al error handler los fallos de los resolvers", async () => {
    const resolverError = new Error("fallo controlado");
    const { next } = await executeMiddleware(
      POLICIES.PUBLIC_PUBLISHED,
      {},
      {
        getResourceAccessContext: async () => {
          throw resolverError;
        },
      },
    );

    expect(next).toHaveBeenCalledWith(resolverError);
  });
});

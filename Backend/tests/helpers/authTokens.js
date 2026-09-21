import { generateAccessToken } from "../../utils/authToken.js";
import { ALL_ROLES, ROLES } from "../../security/roles.js";

export const TEST_USER_ID = "9001";
export const DEFAULT_DEPENDENCY_ID = 3;
export const CONSEJO_DEPENDENCY_ID = 20;

export const TEST_ROLES = Object.freeze([...ALL_ROLES]);

export function createAccessTokenForRole(
  role,
  { dependenciaId = DEFAULT_DEPENDENCY_ID } = {},
) {
  if (!TEST_ROLES.includes(role)) {
    throw new Error(`Rol de prueba desconocido: ${role}`);
  }

  return generateAccessToken({
    id: TEST_USER_ID,
    roles: [role],
    dependenciaId:
      role === ROLES.SUPER_ADMIN ? null : dependenciaId,
  });
}

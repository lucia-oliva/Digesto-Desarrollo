export const ROLES = Object.freeze({
  SUPER_ADMIN: "SuperAdministrador",
  SUPERVISOR: "Supervisor",
  DEPENDENCY_ADMIN: "Administrador de Dependencia",
});

export const ALL_ROLES = Object.freeze(Object.values(ROLES));

export function isValidRole(role) {
  return ALL_ROLES.includes(role);
}
# Plan — Tests base de autenticación (Jest + Supertest)

Issue: AUD-03 (dependencia SEC-01 / CQ-01)

Serie numerada de grupos de tareas:

## Grupo 1 — Documentación
1. Crear `Docs/2026-08-31-tests-base-autenticacion/` con `plan.md`, `requirements.md` y `validation.md`.

## Grupo 2 — Configuración del entorno de test
2. Añadir `supertest` a `Backend/package.json` (`devDependencies`).
3. Crear `Backend/tests/setup-env.cjs` con `ACCESS_SECRET`/`REFRESH_SECRET` de prueba y `NODE_ENV=test`.
4. Registrar el setup en `Backend/jest.config.js` (`setupFiles`).
5. Verificar que el script `test` ejecuta Jest (sin test que falle deliberadamente).

## Grupo 3 — Tests unitarios
6. `Backend/tests/security/authToken.unit.test.js` (generación/verificación, expiración).
7. `Backend/tests/security/authMiddleware.unit.test.js` (5 casos: sin token, malformado, inválido, expirado, válido).

## Grupo 4 — Tests de integración
8. `Backend/tests/security/auth.middleware.integration.test.js` (Supertest contra una app mínima con `authenticateToken`).
9. `Backend/tests/security/auth.routes.integration.test.js` (Supertest contra `app.js` + rutas representativas, con servicios mockeados).

## Grupo 5 — Documentación global
10. Actualizar `constitucion/roadmap.md` (Fase 3).
11. Actualizar `constitucion/techStack.md` (Testing).
12. Actualizar `contexto.md` (testing + hallazgo SEC-01).
13. Actualizar `README.md` (enlace y cómo correr tests).

## Grupo 6 — Validación
14. Ejecutar `npm install` y `npm test`; documentar tests verdes y rojos (rojo esperado hasta el fix de SEC-01).

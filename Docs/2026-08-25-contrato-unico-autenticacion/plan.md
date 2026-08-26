# Plan — Contrato único de autenticación (JWT)

Serie numerada de grupos de tareas:

## Grupo 1 — Especificación
1. Crear la carpeta `Specs/2026-08-25-contrato-unico-autenticacion/` con `plan.md`, `requirements.md` y `validation.md`.
2. Relevar el flujo de autenticación actual (`Backend/routes/authRoute.js`, `Backend/utils/authToken.js`, `Backend/Middleware/authMiddleware.js`, frontend `Digesto/src/context/authProvider.jsx` y `Digesto/src/api/axiosPrivate.js`).
3. Documentar el hallazgo SEC-10: `authRoute.js` pasa `rol`, pero `authToken.js` espera `roles`.

## Grupo 2 — Definición del contrato
4. Definir claim identificador: `sub` (string, `String(usuario.id)`).
5. Definir claim rol: `roles` (array de strings, `[tipo_usuario.nombre]`).
6. Definir claim dependencia: `dependenciaId` (solo access token).
7. Definir duración access token: `15m`.
8. Definir duración refresh token: `7d`.
9. Documentar el contrato completo en `requirements.md`.

## Grupo 3 — Criterios de aceptación
10. Redactar `validation.md` con los criterios que permiten mergear la feature.

## Grupo 4 — Documentación global
11. Actualizar `Constitucion/roadmap.md` (Fase 2 — Contrato único de autenticación).
12. Actualizar `Constitucion/techStack.md` (sección Autenticación / JWT).
13. Actualizar `README.md` (enlace a la nueva spec).

## Grupo 5 — Validación documental
14. Verificar coherencia entre el contrato documentado y la implementación actual, sin refactorizar código (alcance de esta feature).

# Validation — Criterios de aceptación

La feature se considera exitosa (y mergeable) cuando se cumplan todos los siguientes criterios:

1. `Backend/package.json` declara `supertest` en `devDependencies`.
2. `Backend/jest.config.js` registra el setup de entorno (`setupFiles`).
3. Existen tests unitarios para `authToken` y `authMiddleware`.
4. Existe un test de integración HTTP del middleware (`supertest`) con los 5 casos.
5. Existe un test de integración de rutas (`supertest` contra `app.js`) para las rutas representativas.
6. `npm test` ejecuta toda la suite sin errores de infraestructura.
7. Quedan documentados los tests en rojo esperados (inválido/expirado y rutas sin enforcement) hasta el fix de SEC-01.
8. `constitucion/roadmap.md`, `constitucion/techStack.md`, `contexto.md` y `README.md` quedan actualizados.

## Resultado esperado de la suite

- **Verdes**: unit `authToken`; unit `authMiddleware` (sin token/malformado/válido); integration de middleware (sin token/malformado/válido).
- **Rojos (esperados)**: unit `authMiddleware` (inválido/expirado → hoy `403`); integration de middleware (inválido/expirado); integration de rutas (todos los casos que exigen `401`, porque el middleware no está cableado).

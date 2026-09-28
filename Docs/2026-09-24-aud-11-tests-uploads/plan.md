# Plan — Tests de uploads (AUD-11)

Serie numerada de grupos de tareas:

## Grupo 1 — Documentación
1. Crear la carpeta `Docs/2026-09-24-aud-11-tests-uploads/` con `plan.md`, `requirements.md` y `validation.md`.

## Grupo 2 — Test unitario del middleware de subida
2. Crear `Backend/tests/unit/pdfMagicBytes.test.js` sobre `isPdfMagicBytes` (`Backend/Middleware/fileMiddleware.js`).
3. Casos: `%PDF-1.4 …` → `true`; `%PDF-` exacto → `true`; texto plano → `false`; binario → `false`; buffer vacío → `false`; buffer de menos de 5 bytes → `false`; valor no-Buffer → `false`.

## Grupo 3 — Test de integración de los endpoints de upload
4. Crear `Backend/tests/integration/fileUpload.security.test.js` contra `POST /api/file/upload` y `POST /api/file/upload/:id`, usando el `fileMiddleware` **real** (multer + límite + magic bytes).
5. Mockear solo la capa de servicios (`services/db.js`, `services/file.js`, `services/normativa.js`, `services/dependencia.js`); **no** mockear `fileMiddleware.js`.
6. Cubrir los 8 casos de la issue: PDF real, `.txt` renombrado, MIME falso, archivo vacío, demasiado grande, usuario sin permiso, upload sin token y filename malicioso.
7. Añadir un helper de limpieza por diff de `archivos/` (`beforeEach` captura el baseline; `afterEach` elimina lo nuevo) y verificar que ningún archivo escapa de `FILES_ROOT`.

## Grupo 4 — Documentación global
8. Actualizar `Constitucion/roadmap.md` (Fase 6 — Tests de uploads, AUD-11).
9. Actualizar `README.md` (enlace a la nueva spec en "Documentación de la feature").
10. Actualizar `contexto.md` (sección Testing) y `Constitucion/techStack.md` (sección Testing) reflejando los tests de uploads.

## Grupo 5 — Ejecución y validación
11. Ejecutar `docker compose exec -T backend npm test` y confirmar que la suite queda en verde.
12. Confirmar que no quedan archivos residuales en `archivos/` tras correr la suite.

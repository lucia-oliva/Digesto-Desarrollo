# Plan — Tests adversariales de archivos (SEC-02)

Serie numerada de grupos de tareas:

## Grupo 1 — Documentación
1. Crear la carpeta `Docs/2026-09-22-tests-adversariales-archivos/` con `plan.md`, `requirements.md` y `validation.md`.

## Grupo 2 — Soporte de mocks
2. Actualizar `Backend/tests/helpers/rbacMocks.js`: reemplazar `getFileAccessContext` por `getFileAccessContextById` y agregar `getFileDownloadInfo`.

## Grupo 3 — Tests unitarios
3. Crear `Backend/tests/unit/resolveSafePath.test.js` con los casos de traversal y rutas absolutas sobre `resolveSafePath`.
4. Casos: `../package.json`, `../../`, `..\`, `%2e%2e/`, `..%2F`, `%252e%252e%252f`, ruta absoluta Linux, ruta absoluta Windows, archivo válido.

## Grupo 4 — Tests de integración
5. Crear `Backend/tests/integration/fileDownload.pathTraversal.test.js` contra `GET /api/file/download`.
6. Cubrir intentos normales, codificados y doblemente codificados, `filename` manipulado, ID inexistente y archivo válido.

## Grupo 5 — Ejecución
7. Ejecutar `docker compose exec -T backend npm test` y validar que el conjunto queda en verde.

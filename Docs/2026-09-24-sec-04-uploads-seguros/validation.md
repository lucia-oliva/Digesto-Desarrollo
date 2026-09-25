# Validation — Criterios de aceptación (SEC-04)

La feature se considera exitosa (y mergeable) cuando se cumplan todos los siguientes criterios:

1. Un PDF que excede el límite de tamaño es rechazado con `413` (y no queda archivo en `archivos/`).
2. Un archivo con extensión `.pdf` cuyo contenido no empieza por `%PDF-` es rechazado (400/415) y su temporal se borra.
3. Un archivo no PDF es rechazado incluso si declara `mimetype=application/pdf`.
4. El nombre del temporal es aleatorio (`crypto.randomUUID()`) y no deriva de `file.originalname`.
5. El directorio de subida es canónico (`path.resolve("archivos")`), idéntico al usado por `services/file.js`.
6. `POST /api/file/upload` y `/upload/:id` exigen `authenticateToken` (sin token → `401`).
7. La autorización `RESOURCE_UPLOAD` se sigue aplicando (sin permiso → `403`) y el temporal se limpia si rechaza.
8. `errorHandler` responde `LIMIT_FILE_SIZE` → `413` (no un 500 genérico).
9. Documentación actualizada (`plan.md`, `requirements.md`, `validation.md`).

## Verificación (manual, sin tests automatizados — issue aparte)

```text
POST /api/file/upload  (PDF > 10 MB)                    → 413, sin archivo residual
POST /api/file/upload  (.txt renombrado a .pdf)         → 400/415, sin archivo residual
POST /api/file/upload  (.pdf sin cabecera %PDF)         → 400/415, sin archivo residual
POST /api/file/upload  (sin Authorization)              → 401
POST /api/file/upload  (sin permiso sobre dependencia)  → 403, sin archivo residual
POST /api/file/upload  (PDF válido)                     → 200/201, nombre final generado por backend
```

## Verificación realizada

```bash
docker compose exec -T backend npm test
```

Resultado:

```text
Test Suites: 11 passed, 11 total
Tests:       329 passed, 329 total
Snapshots:   0 total
```

- `isPdfMagicBytes` verificado en el contenedor: `%PDF-1.4` → `true`; binario (`hello world`) → `false`; buffer vacío → `false`.
- Fines de línea de los archivos modificados: CRLF (consistente con el repositorio).

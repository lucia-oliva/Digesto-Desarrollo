# Plan — Uploads seguros (AUD-10 / SEC-04)

Serie numerada de grupos de tareas:

## Grupo 1 — Documentación
1. Crear la carpeta `Docs/2026-09-24-sec-04-uploads-seguros/` con `plan.md`, `requirements.md` y `validation.md`.

## Grupo 2 — Middleware de subida (`Backend/Middleware/fileMiddleware.js`)
2. Usar directorio canónico `path.resolve("archivos")` en `destination` (en lugar de `./archivos`), compartido con `services/file.js`.
3. Configurar `limits.fileSize` en `multer(...)` con un máximo explícito (10 MB por defecto).
4. Generar nombre interno aleatorio con `crypto.randomUUID()` (ej. `<uuid>.pdf`) en lugar de `temp_${Date.now()}.pdf`.
5. No usar `file.originalname` (nombre controlado por el usuario) para nombrar el archivo.

## Grupo 3 — Solo PDF y validación de contenido
6. Agregar `fileFilter` que rechace extensiones distintas de `.pdf` (filtro temprano).
7. Dejar de confiar en `file.mimetype` como criterio de aceptación.
8. Comprobar `%PDF` sobre los primeros bytes del archivo ya escrito; si no coincide, borrar el temporal y rechazar (400/415).

## Grupo 4 — Autenticación y autorización del upload (`Backend/routes/fileRoutes.js`)
9. Mantener `authenticateToken` ANTES de `pdfHandler.single("file")` en `/upload/:id` y `/upload` (autenticar upload).
10. Mantener `authorizePolicy(POLICIES.RESOURCE_UPLOAD)` en ambas rutas (autorizar upload).
11. Garantizar limpieza del temporal cuando la autorización o la validación rechaza (sin dejar archivos huérfanos).

## Grupo 5 — Manejo de errores
12. Mapear `LIMIT_FILE_SIZE` → `413` y archivo no-PDF → `400/415` (sin un 500 genérico).

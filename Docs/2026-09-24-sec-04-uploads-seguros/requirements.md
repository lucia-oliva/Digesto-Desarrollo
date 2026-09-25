# Requirements — Uploads seguros (AUD-10 / SEC-04)

## Alcance
Endurecer la subida de PDFs en `POST /api/file/upload/:id` y `POST /api/file/upload`:
limitar tamaño, admitir solo PDF (magic bytes `%PDF`), no confiar en el mimetype,
generar nombre interno aleatorio, evitar nombres controlados por el usuario, usar
directorio canónico y mantener autenticación/autorización sobre el upload.

## Contexto
Ver:
- `contexto.md` (Docker, archivos en `archivos/`).
- `Constitucion/techStack.md` (Express ESM, `multer`, `fs-extra`, `mysql2`).

Componentes afectados:
- `Backend/Middleware/fileMiddleware.js` — storage, límite, nombre, filtros, magic bytes.
- `Backend/routes/fileRoutes.js` — orden de middlewares y limpieza de temporales.
- `Backend/services/file.js` — ruta base canónica compartida.
- `Backend/Middleware/errorHandler.js` — mapeo de errores de multer.
- `Backend/config/files.js` (nuevo) — constantes compartidas (`FILES_ROOT`, `MAX_PDF_SIZE_BYTES`, `PDF_MAGIC_BYTES`).
- `Backend/tests/helpers/rbacMocks.js` — mock actualizado con los middlewares nuevos exportados.

## Estado actual (hallazgo SEC-04)
`fileMiddleware.js`:
- `destination: "./archivos"` (relativo, no canónico).
- valida solo `file.mimetype !== "application/pdf"` (confía en el mimetype del cliente).
- genera `temp_${Date.now()}.pdf` (predecible, con riesgo de colisión).
- no define `limits` (sin límite de tamaño).
- no verifica magic bytes (`%PDF`).

## Diseño correcto
```
cliente sube multipart (file + campos)
  → authenticateToken (antes de tocar el archivo)
  → multer escribe en directorio canónico con nombre aleatorio (límite de tamaño)
  → fileFilter: extensión .pdf (filtro temprano, no determinante)
  → autorización RESOURCE_UPLOAD
  → verificación de magic bytes (%PDF-) sobre el archivo ya escrito
  → si falla, se borra el temporal y se responde 4xx
  → procesamiento (rename a nombre final en services/file.js)
```

## Decisiones

| Aspecto | Decisión |
| --- | --- |
| Límite de tamaño | `limits.fileSize = 10 * 1024 * 1024` (10 MB), constante nombrada. |
| Solo PDF | `fileFilter` por extensión `.pdf` + verificación de magic bytes `%PDF-`. |
| Comprobar `%PDF` | Leer los primeros 5 bytes del archivo escrito y comparar con `%PDF-` (hex `25 50 44 46 2D`). |
| No confiar en mimetype | `file.mimetype` deja de ser criterio de aceptación. |
| Nombre interno | `crypto.randomUUID() + ".pdf"` para el temporal; el nombre final lo sigue generando el backend. |
| Nombres de usuario | Nunca usar `file.originalname`. |
| Directorio canónico | `path.resolve("archivos")`, compartido entre `fileMiddleware.js` y `services/file.js`. |
| Autenticación | `authenticateToken` antes de `multer` (ya presente en ambas rutas). |
| Autorización | `authorizePolicy(RESOURCE_UPLOAD)` (ya presente). Se agrega limpieza del temporal si rechaza. |
| Errores | `LIMIT_FILE_SIZE` → 413; no-PDF → 400/415; siempre borrando el temporal. |

## Restricciones
- No recibir el nombre de archivo del cliente ni usarlo para rutas.
- No escribir el archivo final antes de validar `%PDF`.
- Mantener el comportamiento RBAC existente (matriz de acceso).

## Fuera de alcance
- Tests automatizados (unitarios/integración): issue aparte.
- Reordenar `authorizePolicy` antes de `multer` (requiere parsear campos multipart por separado).
- Upgrade de `multer` (1.4.5-lts.1) por CVEs conocidos.
- Parseo/firma completa del PDF (más allá de `%PDF`).
- Cambios de frontend (el flujo multipart actual no controla el nombre).

# Requirements — Tests de uploads (AUD-11)

## Alcance
Automatizar con Jest + Supertest la verificación de la subida segura de archivos
endurecida en SEC-04 (`Docs/2026-09-24-sec-04-uploads-seguros/`). Se cubren, contra
los endpoints reales (`POST /api/file/upload` y `POST /api/file/upload/:id`), los
ocho casos indicados en la issue: PDF real, `.txt` renombrado, MIME falso, archivo
vacío, demasiado grande, usuario sin permiso, upload sin token y filename malicioso.

> Esta issue es el complemento de tests que SEC-04 dejó explícitamente fuera de alcance
> ("Tests automatizados: issue aparte"). No modifica código de producción.

## Contexto
Ver:
- `Docs/2026-09-24-sec-04-uploads-seguros/` (implementación y verificación manual de SEC-04).
- `Docs/2026-09-22-tests-adversariales-archivos/` (precedente de tests de archivos).
- `contexto.md` (Docker; tests con `docker compose exec -T backend npm test`).
- `Constitucion/techStack.md` (Jest 30 + Supertest, ESM; multer + fs-extra).

Piezas bajo prueba:
- `Backend/Middleware/fileMiddleware.js` — `isPdfMagicBytes`, `pdfHandler` (multer:
  `limits.fileSize`, `fileFilter` por extensión, nombre aleatorio), `handleUploadError`,
  `cleanupTempFileOnError`, `validatePdfContent`.
- `Backend/Middleware/errorHandler.js` — mapeo `LIMIT_FILE_SIZE` → `413`.
- `Backend/routes/fileRoutes.js` — orden de la cadena de middlewares en ambas rutas.
- `Backend/config/files.js` — `FILES_ROOT`, `MAX_PDF_SIZE_BYTES`, `PDF_MAGIC_BYTES`.

## Estado actual (implementado en SEC-04)
- Solo PDF: `fileFilter` rechaza extensiones distintas de `.pdf` (`415`); el `mimetype`
  declarado por el cliente no se usa como criterio.
- Magic bytes `%PDF-` verificados sobre el archivo ya escrito (`validatePdfContent` → `415`).
- Límite de 10 MB (`limits.fileSize`) → `LIMIT_FILE_SIZE` → `413`.
- Nombre interno `crypto.randomUUID() + ".pdf"`; nunca se usa `file.originalname`.
- Raíz canónica `path.resolve("archivos")` (`FILES_ROOT`).
- `authenticateToken` (sin token → `401`) y `authorizePolicy(RESOURCE_UPLOAD)`
  (mismatch de dependencia → `403`) sobre ambas rutas.
- Limpieza de temporales: `handleUploadError` (síncrona, p. ej. `413`) y
  `cleanupTempFileOnError` (asíncrona vía `res.on("close")` para 4xx).

## Decisión: middleware real vs. mock
El helper `Backend/tests/helpers/rbacMocks.js` mockea `fileMiddleware.js` (evita escribir
en disco), por lo que **no se reutiliza** aquí. Los tests de uploads deben ejercitar el
`fileMiddleware` real para probar multer, el límite, la escritura en disco y los magic
bytes; se mockea únicamente la capa de servicios (`db.js`, `file.js`, `normativa.js`,
`dependencia.js`) para no depender de MariaDB.

## Matriz de casos

| # | Caso (issue) | Entrada | Resultado esperado |
| --- | --- | --- | --- |
| 1 | PDF real | `.pdf` con contenido `%PDF-1.4 …` | `201` (`/upload`) y `200` (`/upload/:id`) |
| 2 | `.txt` renombrado | `nota.pdf` con contenido de texto | `415` |
| 3a | MIME falso (declara PDF) | contenido de texto, `contentType: application/pdf` | `415` |
| 3b | MIME falso (contenido PDF, mimetype texto) | `%PDF-…`, `contentType: text/plain` | aceptado (el mimetype se ignora) |
| 4 | Archivo vacío | `Buffer.alloc(0)` como `.pdf`; (extra) `/upload` sin campo `file` | `415`; `400` |
| 5 | Demasiado grande | buffer `> MAX_PDF_SIZE_BYTES` | `413`, sin residuo |
| 6 | Usuario sin permiso | token dependencia `3` vs `id_dependencia=999`; y `/upload/:id` con recurso de otra dependencia | `403`, sin residuo |
| 7 | Upload sin token | sin `Authorization` | `401` |
| 8 | Filename malicioso | `../../../evil.pdf` con contenido PDF válido; y nombre sin extensión `.pdf` | UUID aleatorio sin escape; `415` |

## Decisiones

| Aspecto | Decisión |
| --- | --- |
| Framework | Jest 30 + Supertest (ya en uso; `npm test` con `--runInBand`). |
| Nivel de prueba | Unit (`isPdfMagicBytes`) + integración (endpoints HTTP con middleware real). |
| Mocking | Solo servicios; `fileMiddleware` real. |
| Token de prueba | `generateAccessToken` (`utils/authToken.js`) con `dependenciaId` controlado. |
| Entorno de disco | Tests corren en Docker; los temporales se escriben en `FILES_ROOT` (`/app/archivos`). |
| Limpieza | Snapshot/diff de `archivos/` en `beforeEach`/`afterEach` para no dejar huérfanos. |
| Aserciones | Estado HTTP como contrato; para "sin residuo" se verifica con margen (limpieza asíncrona). |

## Restricciones
- Solo tests y documentación; **no** modificar código de producción.
- No depender de MariaDB ni de servicios externos.
- No dejar archivos residuales en `archivos/` tras la suite.

## Fuera de alcance
- Endurecimiento adicional de `fileMiddleware`/`resolveSafePath`.
- Upgrade de `multer` (1.4.5-lts.1) por CVEs conocidos.
- Parseo/firma completa del PDF (más allá de `%PDF-`).
- Tests E2E de navegador (frontend).

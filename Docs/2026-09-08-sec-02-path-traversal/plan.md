# Plan — Corrección de path traversal en descarga de archivos (SEC-02)

Serie numerada de grupos de tareas:

## Grupo 1 — Documentación
1. Crear la carpeta `Docs/2026-09-08-sec-02-path-traversal/` con `plan.md`, `requirements.md` y `validation.md`.

## Grupo 2 — Servicio de archivos (`Backend/services/file.js`)
2. Definir la raíz permitida canónica (`path.resolve("archivos")`) y un helper `resolveSafePath(root, relative)` que resuelva con `path.resolve` y valide que la ruta resultante queda dentro de la raíz.
3. Agregar resolución de archivo por `tipo + id` desde DB:
   - `normativa` → `normativa.archivo`, directorio raíz.
   - `consejo` → `sesiones.orden_url`, directorio `OrdenesDelDia`.
   - `acta` → `sesiones.acta_url`, directorio `Actas`.
4. Agregar `getFileAccessContextById(tipo, id)` para RBAC, reutilizando `getNormativaAccessContext` para normativa y consultando `sesiones` para consejo/acta.

## Grupo 3 — Ruta de descarga (`Backend/routes/fileRoutes.js`)
5. Cambiar `GET /file/download` para aceptar `tipo` + `id` (query) en lugar de `filename`.
6. Validar `tipo` contra whitelist (`normativa` | `consejo` | `acta`).
7. Obtener filename desde DB (query parametrizada), calcular ruta con `path.resolve` y validar contención.
8. Mantener `optionalAuthenticateToken` + `authorizePolicy(PUBLIC_PUBLISHED)` resolviendo contexto por `tipo + id`.
9. Eliminar la concatenación `path.join(candidate.dir, filename)` y el barrido de candidatos.

## Grupo 4 — Frontend
10. `AbrirPdf.jsx` y `PdfViewer.jsx`: enviar `tipo + id` en lugar de `filename`.
11. `documentView.jsx`: pasar `tipo=normativa` + `id` al visor/descarga.
12. `NormativasTable.jsx`: enviar `tipo=consejo`/`tipo=acta` + `id_sesion` en lugar de `orden_url`/`acta_url`.

## Grupo 5 — Documentación global
13. Actualizar `docs-access-matrix.md` con la nota del nuevo contrato de `/file/download`.

## Grupo 6 — Validación
14. Verificación manual con Docker (casos de escape, ruta absoluta, ID válido, 400/404/401/403). Sin tests automatizados (fuera de alcance).

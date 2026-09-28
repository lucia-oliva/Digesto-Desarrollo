# Requirements — Tests adversariales de archivos (SEC-02)

## Alcance

Verificar mediante tests que `GET /api/file/download` no permite acceder fuera de la carpeta permitida de archivos. Se cubren intentos normales, codificados y doblemente codificados.

## Contexto

Ver:
- `Docs/2026-09-08-sec-02-path-traversal/` (fix de path traversal).
- `contexto.md` (Docker; tests con `docker compose exec -T backend npm test`).
- `Constitucion/techStack.md` (Jest 30 + Supertest, ESM).

Piezas bajo prueba:
- `Backend/services/file.js` — `resolveSafePath` (contención canónica) y `getFileAccessContextById` / `getFileDownloadInfo` (resolución por `tipo + id`).
- `Backend/routes/fileRoutes.js` — `GET /api/file/download`.
- `Backend/tests/helpers/rbacMocks.js` — mock de `services/file.js`, desactualizado tras el fix.

## Estado actual

`resolveSafePath` rechaza rutas absolutas (Linux) y escapes con `../`. En Linux (Docker), `..\` y `C:\...` no escapan (`\` se trata como carácter literal) y quedan como nombres dentro de `archivos/`.

## Decisiones

| Aspecto | Decisión |
| --- | --- |
| Nivel de prueba | Unit (`resolveSafePath`) + integración (endpoint HTTP). |
| Casos | `../package.json`, `../../`, `..\`, `%2e%2e/`, `..%2F`, `%252e%252e%252f`, ruta absoluta Linux, ruta absoluta Windows, ID inexistente, `filename` manipulado, archivo válido. |
| Codificación | Los casos codificados/doblemente codificados se ejercitan en el endpoint (Express decodifica la URL una vez). |
| Mock de `file.js` | Se actualiza en `rbacMocks.js`; el test de integración de path traversal usa el servicio real con `db.js` mockeado. |
| Criterio | Ningún intento accede fuera de `archivos/`. |

## Recomendación (fuera de alcance)

Endurecer `resolveSafePath` para rechazar explícitamente barras invertidas (`\`) y rutas con letra de unidad (`C:\`, `C:/`), de modo que los casos Windows queden cubiertos por rechazo y no por comportamiento accidental de Linux.

## Restricciones

- Solo tests; no modificar código de producción.
- No modificar el endpoint ni `resolveSafePath` en esta issue.

## Fuera de alcance

- Endurecimiento de `resolveSafePath`.
- Cualquier otro hallazgo de la auditoría.

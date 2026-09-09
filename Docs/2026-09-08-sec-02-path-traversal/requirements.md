# Requirements — Corrección de path traversal en descarga de archivos (SEC-02)

## Alcance

Eliminar el path traversal en `GET /api/file/download`. El endpoint deja de recibir paths físicos y pasa a recibir un identificador interno; el backend resuelve el nombre de archivo desde la base de datos, calcula la ruta con `path.resolve` y la compara contra el directorio raíz permitido.

## Contexto

Ver:
- `contexto.md` (estructura, Docker, archivos en `archivos/`).
- `Constitucion/techStack.md` (Express ESM, multer, mysql2).
- `Docs/2026-08-25-security/docs-access-matrix.md` (matriz de acceso).

Componentes afectados:
- `Backend/routes/fileRoutes.js` — endpoint de descarga.
- `Backend/services/file.js` — resolución de archivo y contexto de acceso.
- `Digesto/src/components/Table/AbrirPdf.jsx`, `Digesto/src/components/ui/PdfViewer.jsx`, `Digesto/src/pages/documentView.jsx`, `Digesto/src/components/Table/NormativasTable.jsx` — consumidores de la descarga.

## Estado actual (hallazgo SEC-02)

`fileRoutes.js` concatena `filename` (no confiable) mediante `path.join`:

```js
const p = path.join(candidate.dir, filename);
await fs.access(p);
```

Un valor con `../` puede escapar de `archivos/`, `archivos/Actas/` o `archivos/OrdenesDelDia/` antes de `res.download`. El cliente controla qué ruta del filesystem se abre.

## Diseño correcto

```text
cliente envía tipo + id
  → backend valida tipo (whitelist)
  → backend consulta DB y obtiene archivo permitido
  → backend resuelve ruta (path.resolve)
  → backend compara con directorio raíz permitido
  → backend descarga o rechaza
```

## Decisiones

| Aspecto | Decisión |
| --- | --- |
| Contrato de entrada | `GET /api/file/download?tipo=<normativa\|consejo\|acta>&id=<ID>` |
| Fuente del filename | Exclusivamente DB: `normativa.archivo`, `sesiones.orden_url`, `sesiones.acta_url`. |
| Raíz permitida | `path.resolve("archivos")`. |
| Validación de ruta | `path.resolve` + verificación de que la ruta resultante está dentro de la raíz (prefijo canónico + separador). |
| Rutas absolutas | Rechazadas. |
| Valores del cliente | `tipo` (whitelist) e `id` (parámetro de query SQL parametrizada); nunca usados como segmento de ruta. |
| RBAC | `PUBLIC_PUBLISHED` (según matriz), resolviendo contexto por `tipo + id`. |

### Mapeo tipo → recurso → directorio

| `tipo` | Recurso / ID | Columna filename | Directorio |
| --- | --- | --- | --- |
| `normativa` | `normativa.id` | `archivo` | `archivos/` |
| `consejo` | `sesiones.id_sesion` | `orden_url` | `archivos/OrdenesDelDia/` |
| `acta` | `sesiones.id_sesion` | `acta_url` | `archivos/Actas/` |

## Restricciones

- No recibir paths físicos ni nombres de archivo del cliente.
- No usar directamente valores suministrados por el cliente como ruta.
- Mantener el comportamiento RBAC existente (matriz de acceso).
- Sin tests automatizados en esta issue (corresponde a otra issue).

## Fuera de alcance

- Tests automatizados (unitarios/integración) de la corrección.
- Otras medidas de seguridad de archivos/upload (validación por firma, límites de tamaño, limpieza de temporales).
- Cualquier otro hallazgo de la auditoría.

# Validation — Criterios de aceptación (SEC-02)

La feature se considera exitosa (y mergeable) cuando se cumplan todos los siguientes criterios:

1. `GET /api/file/download` ya no acepta `filename` ni ningún path físico del cliente.
2. El endpoint acepta `tipo` + `id`; `tipo` se valida contra la whitelist (`normativa` | `consejo` | `acta`).
3. El filename se obtiene desde DB (nunca del cliente): `normativa.archivo`, `sesiones.orden_url`, `sesiones.acta_url`.
4. La ruta se calcula con `path.resolve` y se compara contra `path.resolve("archivos")`.
5. Un `id` legítimo cuyo filename intente escapar (`../`, `../../...`) es rechazado.
6. Las rutas absolutas son rechazadas.
7. La descarga mantiene `PUBLIC_PUBLISHED` según la matriz (acceso anónimo solo a recurso publicado; consejo/acta exigen Consejo Superior; normativa privada exige dependencia).
8. `tipo` inválido → `400`; recurso o archivo inexistente → `404`; sin autorización → `401`/`403`.
9. Descarga correcta por ID para normativa, orden del día y acta.
10. El frontend envía `tipo + id` (no `filename`/`orden_url`/`acta_url`).
11. Documentación actualizada (`plan.md`, `requirements.md`, `validation.md` y nota en `docs-access-matrix.md`).

## Verificación

La verificación es manual (sin tests automatizados, fuera de alcance):

```text
GET /api/file/download?tipo=normativa&id=<id_valido>      → 200 (PDF)
GET /api/file/download?tipo=consejo&id=<id_sesion_valido> → 200 (PDF, con autorización Consejo Superior)
GET /api/file/download?tipo=acta&id=<id_sesion_valido>    → 200 (PDF, con autorización Consejo Superior)
GET /api/file/download?tipo=otro&id=1                     → 400 (tipo inválido)
GET /api/file/download?tipo=normativa&id=999999           → 404 (recurso inexistente)
GET /api/file/download?tipo=normativa&id=<id>             → 401/403 (sin autorización para recurso privado)
```

Los casos de escape y de ruta absoluta se verifican sobre el valor de `filename` almacenado en DB, que nunca proviene del cliente.

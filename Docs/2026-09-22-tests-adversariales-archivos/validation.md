# Validation — Criterios de aceptación (SEC-02)

La feature se considera exitosa (y mergeable) cuando se cumplan todos los criterios:

1. Existen tests que ejercitan todos los casos de traversal: `../package.json`, `../../`, `..\`, `%2e%2e/`, `..%2F`, `%252e%252e%252f`.
2. Se prueban ruta absoluta Linux y ruta absoluta Windows.
3. Se prueba ID inexistente (`404`), `filename` manipulado (`400`) y archivo válido (`200`).
4. Ningún intento resuelve una ruta fuera de la carpeta permitida (`archivos/`).
5. Los intentos codificados y doblemente codificados son rechazados en el endpoint.
6. `rbacMocks.js` queda actualizado y el conjunto de tests existente sigue en verde.

## Archivos de test

- `Backend/tests/unit/resolveSafePath.test.js`
- `Backend/tests/integration/fileDownload.pathTraversal.test.js`

## Verificación

```bash
docker compose exec -T backend npm test
```

Resultado:

```text
Test Suites: 11 passed, 11 total
Tests:       329 passed, 329 total
Snapshots:   0 total
```

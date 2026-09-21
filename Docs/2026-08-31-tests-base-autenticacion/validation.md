# Validación — Tests de autenticación y matriz RBAC

## Criterios de aceptación

- [x] Jest ejecuta el backend ESM en entorno Node.js.
- [x] Supertest está declarado como dependencia de desarrollo.
- [x] Las pruebas están separadas en `unit/` e `integration/`.
- [x] Los mocks y utilidades reutilizables están centralizados en `helpers/`.
- [x] Existen tokens de prueba para cada rol de la matriz.
- [x] Todos los endpoints con autenticación obligatoria se prueban sin token.
- [x] Los roles no autorizados se prueban con resultado 403.
- [x] Los roles autorizados se prueban con acceso permitido.
- [x] Se validan restricciones por dependencia y Consejo Superior.
- [x] Se validan recursos publicados y no publicados.
- [x] El inventario de rutas Express coincide con `ACCESS_MATRIX`.
- [x] Los nombres parametrizados identifican método, ruta, rol o condición.
- [x] La suite no requiere servidor ni base de datos externos.

## Cobertura implementada

| Nivel | Suites | Casos | Resultado |
| --- | ---: | ---: | --- |
| Unitario | 5 | 62 | Aprobado |
| Integración | 4 | 238 | Aprobado |
| Total | 9 | 300 | Aprobado |

La matriz contiene 62 endpoints. La automatización cubre los 44 endpoints con autenticación obligatoria frente a los tres roles y los endpoints cuyo acceso depende del estado de publicación del recurso.

## Comandos validados

Ejecutados desde `Backend/`:

```bash
npm run test:unit
npm run test:integration
npm test
```

Resultado final:

```text
Test Suites: 9 passed, 9 total
Tests:       300 passed, 300 total
Snapshots:   0 total
```

## Hallazgos detectados durante la validación

La matriz automatizada identificó diferencias entre las políticas declaradas y las aplicadas en rutas de emisores, relaciones y tags. Se incorporaron los controles RBAC correspondientes y se confirmó el resultado positivo de la suite completa.

## Pendientes posteriores

- Incorporar la ejecución automática en GitHub Actions.
- Implementar pruebas E2E con frontend, backend y base de datos de prueba.

# Requisitos — Tests de autenticación y matriz RBAC

## Identificación

- Issues: AUD-03 y AUD-05.
- Hallazgos asociados: SEC-01 y CQ-01.
- Componente: backend Node.js/Express.
- Herramientas: Jest y Supertest.

## Objetivo

Mantener una suite automatizada que verifique el contrato de autenticación y autorización del backend, incluida la correspondencia entre los endpoints registrados en Express y la matriz RBAC definida en `Backend/security/accessMatrix.js`.

## Contrato de autenticación y autorización

| Condición | Resultado esperado |
| --- | --- |
| Endpoint privado sin token | 401 |
| Token malformado, inválido o expirado | 401 |
| Token válido con rol insuficiente | 403 |
| Token válido con rol y alcance autorizados | Acceso permitido |
| Recurso no publicado sin token | 401 |
| Recurso no publicado de otra dependencia | 403 |
| Recurso publicado | Acceso público permitido |

La autorización se verifica para los roles:

- `SuperAdministrador`.
- `Supervisor`.
- `Administrador de Dependencia`.

También se verifican los alcances por dependencia, Consejo Superior, destino de uploads y estado de publicación del recurso.

## Organización

```text
Backend/tests/
├── unit/
├── integration/
├── helpers/
├── e2e/
└── setup-env.cjs
```

- `unit/`: contratos de tokens, middleware, políticas y definición de la matriz.
- `integration/`: solicitudes HTTP contra Express mediante Supertest.
- `helpers/`: tokens, solicitudes y mocks reutilizables; no contiene suites.
- `e2e/`: reservada para pruebas futuras con infraestructura completa.


## Matriz automatizada

`Backend/tests/integration/rbacMatrix.test.js` genera casos parametrizados a partir de `ACCESS_MATRIX` y separa las suites de:

1. cobertura de endpoints protegidos;
2. respuestas 401 sin autenticación;
3. respuestas 403 para roles rechazados;
4. acceso para roles permitidos;
5. restricciones por dependencia;
6. acceso condicionado por publicación.

Cada caso informa método, ruta, rol o condición y resultado esperado.

## Aislamiento

- Los tokens se generan con la implementación real del backend y secretos exclusivos de prueba.
- Las integraciones reemplazan servicios de persistencia y correo mediante mocks deterministas.
- La suite no requiere iniciar el servidor ni disponer de una base MariaDB.
- `NODE_ENV`, `ACCESS_SECRET` y `REFRESH_SECRET` se establecen en `Backend/tests/setup-env.cjs`.

## Ejecución

Desde `Backend/`:

```bash
npm ci
npm run test:unit
npm run test:integration
npm test
```

## Fuera de alcance

- Pruebas E2E con frontend, servidor y base de datos reales.
- Integración continua con GitHub Actions.
- Pruebas de carga, rendimiento y disponibilidad.

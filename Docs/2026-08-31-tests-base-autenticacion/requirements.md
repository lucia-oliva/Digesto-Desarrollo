# Requirements — Tests base de autenticación (Jest + Supertest)

## Alcance

Crear la base de tests de autenticación del backend, cubriendo los niveles **unit** e **integration**, y dejando codificado el contrato SEC-01 (401/403). Esta feature **no corrige** la implementación de autenticación; el fix queda en una issue posterior.

## Contexto

- Backend ESM (`"type": "module"`), Jest 30 ya configurado (`testMatch: tests/**/*.test.js`).
- Ya existen 3 tests de `accessMatrix` en `Backend/tests/security/` (AUD-02).
- `supertest` no estaba instalado; `node_modules/` local está vacío (dependencias se instalan con `npm install`).

## Hallazgos relevantes (SEC-01)

1. `Backend/Middleware/authMiddleware.js` define `authenticateToken`, pero **no se aplica en ninguna ruta** (búsqueda: solo 1 aparición, en el propio middleware).
2. El middleware responde:
   - Sin token → `401` (correcto).
   - Token inválido/expirado → `403` (SEC-01 exige `401`).

## Contrato a codificar en los tests (SEC-01)

| Caso | Status esperado |
| --- | --- |
| Sin `Authorization` | 401 |
| Token malformado | 401 |
| Token inválido | 401 |
| Token expirado | 401 |
| Token válido | no 401 |

Definiciones:

- **malformado**: header sin el esquema `Bearer <token>` o `Bearer` sin token.
- **inválido**: JWT firmado con otra clave o corrupto.
- **expirado**: JWT con `exp` en el pasado.

## Decisiones

- Framework: **Jest** (ya presente) + **Supertest** (nuevo).
- Entorno: `Backend/tests/setup-env.cjs` fija `NODE_ENV=test`, `ACCESS_SECRET` y `REFRESH_SECRET` de prueba; se registra en `jest.config.js` (`setupFiles`).
- Script: mantener `npm test` (Jest `--runInBand`).
- Rutas representativas: `GET /api/usuarios`, `POST /api/normativa/create`, `POST /api/auditoria/search`, `POST /api/file/upload`.
- Mocks: en la integración de rutas se mockean los servicios (`usuarios`, `normativa`, `auditoria`, `db`) para evitar dependencia de MariaDB y hacer deterministas los resultados.

## Restricciones

- No modificar la implementación de autenticación ni las rutas (el fix es otra issue).
- Mantener las convenciones ESM y de nombre de los tests existentes (`*.test.js`).

## Fuera de alcance

- Corregir `authMiddleware.js` (403→401) o cablearlo a las rutas.
- Nivel **E2E** (browser testing): no se implementa en AUD-03; ver definición abajo.

## E2E — definición (browser testing)

El nivel **E2E** de los tests de autenticación se define como **browser testing**: automatizar el navegador para probar el flujo completo desde el frontend.

- Herramienta sugerida: **Playwright** o **Cypress** (ninguno está en el repo todavía).
- Alcance típico: intento de **login** en la UI, navegación autenticada y acceso a pantallas protegidas (usuarios, normativas, auditoría, archivos).
- No es un "E2E de backend contra la BD real" (eso sería un test de integración con infraestructura real, no browser testing).

**Estado:** fuera del alcance de AUD-03 (que cubre unit + integration). Se implementará en una fase posterior, cuando se incorpore el framework de browser testing.

# Plan ejecutado — Tests de autenticación y matriz RBAC

Issues: AUD-03 y AUD-05

Hallazgos: SEC-01 y CQ-01

## 1. Configuración

- Configurar Jest para el backend ESM y el entorno Node.js.
- Registrar variables exclusivas de prueba mediante `setupFiles`.
- Incorporar Supertest como dependencia de desarrollo.
- Incorporar scripts separados para pruebas unitarias e integración.

## 2. Organización

- Clasificar las pruebas por nivel en `tests/unit/` y `tests/integration/`.
- Centralizar utilidades y mocks reutilizables en `tests/helpers/`.
- Eliminar las carpetas `tests/security/` y `tests/mock/`.
- Reservar `tests/e2e/` para la fase de pruebas de extremo a extremo.

## 3. Pruebas unitarias

- Validar generación y verificación de access tokens y refresh tokens.
- Validar autenticación obligatoria y opcional.
- Validar definición, integridad y utilidades de la matriz de acceso.
- Validar políticas RBAC, roles y alcances de autorización.

## 4. Pruebas de integración

- Validar el middleware de autenticación mediante solicitudes HTTP.
- Validar rutas privadas representativas ante tokens ausentes, malformados, inválidos, expirados y válidos.
- Comparar el inventario real de rutas Express con la matriz declarada.
- Ejecutar la combinación parametrizada endpoint/rol para todos los endpoints privados.
- Validar 401, 403, acceso permitido y restricciones por dependencia.
- Validar recursos de acceso condicionado según su estado de publicación.

## 5. Validación y cierre

- Ejecutar por separado las suites unitarias y de integración.
- Ejecutar la suite completa desde una instalación reproducible con `npm ci`.
- Corregir cualquier diferencia entre la matriz declarada y las políticas aplicadas en las rutas.
- Registrar resultados y alcance en `validation.md`.
- Actualizar la sección de tests del README general.

## Estado

Plan completado. La incorporación de CI y las pruebas E2E permanecen en issues posteriores.

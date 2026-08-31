# AUD-02 — Protección de API administrativa

## Alcance

Hallazgo: SEC-01  
Rama: security/sec-01-authenticated-routes

## Implementación

- Se centralizó la autenticación mediante `authenticateToken`.
- El access token se obtiene exclusivamente del encabezado `Authorization: Bearer`.
- `req.user` se normaliza con:
  - `sub`
  - `roles`
  - `dependenciaId`
- Las rutas clasificadas como `REQUIRED` en la matriz de acceso requieren autenticación.
- Las rutas `PUBLIC` y `PUBLIC_PUBLISHED` mantienen su acceso definido por la matriz.
- Los uploads protegidos ejecutan autenticación antes del procesamiento de archivos.

## Cobertura

- 44 endpoints `REQUIRED` protegidos.
- 13 endpoints `PUBLIC` sin autenticación obligatoria.
- 5 endpoints condicionales conservados según matriz.

## Cliente HTTP frontend

Las solicitudes HTTP de la aplicación fueron centralizadas en:

`Digesto/src/api/axiosPrivate.js`

Se eliminó del código de aplicación el uso paralelo de:

- `fetch`
- `axios-hooks`
- llamadas directas a `axios`
- instancias Axios adicionales

Login, refresh de sesión, logout y solicitudes de negocio utilizan la misma instancia `api`.

## Fuera de alcance

- autorización por rol;
- respuestas `403`;
- matriz RBAC automatizada;
- cambios en claims de roles;
- actor de auditoría derivado exclusivamente del JWT;
- tests de integración de autenticación correspondientes a AUD-03.
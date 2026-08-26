# Requirements — Contrato único de autenticación (JWT)

## Alcance

Definir y dejar escrito un **único contrato** para los claims de los JWT de acceso y refresco del backend, de modo que no convivan variantes (`rol`, `role`, `roles`, `userId`, `idUsuario`, `id_usuario`) representando lo mismo.

Esta feature es **solo de diseño/documentación**: no refactoriza todavía la implementación de autenticación.

## Contexto

Ver misión y stack en:
- `Constitucion/mision.md`
- `Constitucion/techStack.md`

> Nota: la solicitud mencionaba `specs/mission.md` y `specs/tech-stack.md`; en este repositorio esos documentos viven en `Constitucion/` (`mision.md` y `techStack.md`).

Componentes relevantes del flujo:
- `Backend/utils/authToken.js` — genera/verifica los tokens (`jsonwebtoken`).
- `Backend/routes/authRoute.js` — login, refresh-token y logout.
- `Backend/Middleware/authMiddleware.js` — valida el access token (`Authorization: Bearer`).
- `Digesto/src/context/authProvider.jsx` y `Digesto/src/api/axiosPrivate.js` — guardan el access token y lo envían como `Bearer`.
- BD (`db/bs_digesto.sql`): `usuario.id`, `usuario.id_dependencia`, `tipo_usuario.nombre`.

## Estado actual (hallazgo SEC-10)

`authToken.js` firma `{ sub, roles }`:
```js
jwt.sign({ sub: id, roles }, ACCESS_SECRET, { expiresIn: "15m" });
jwt.sign({ sub: id, roles }, REFRESH_SECRET, { expiresIn: "7d" });
```

`authRoute.js`:
- `/login` pasa `rol` (singular) → el util lo ignora y el token queda con `roles: []` (el rol **se pierde**).
- `/refresh-token` pasa `roles: [user.tipo_usuario]` → correcto.
- `/refresh-token` lee el id desde `payload.sub` → `sub` ya es el identificador de facto.

## Decisiones (contrato único)

| Aspecto | Decisión | Detalle |
| --- | --- | --- |
| Claim identificador | `sub` | string, `String(usuario.id)`. Representa al usuario autenticado. |
| Claim rol | `roles` | array de strings, `[tipo_usuario.nombre]`. Valores: `SuperAdministrador`, `Administrador de Dependencia`, `Supervisor`. |
| Claim dependencia | `dependenciaId` | solo en access token. `usuario.id_dependencia`; `0` se normaliza a `null`. |
| Duración access token | `15m` | coincide con la configuración actual. |
| Duración refresh token | `7d` | coincide con la configuración actual y con el `maxAge` de la cookie (`7 * 24 * 60 * 60 * 1000`). |
| Secretos | `ACCESS_SECRET` / `REFRESH_SECRET` | separados para access y refresh. |

### Payloads de ejemplo

**Access token (15m):**
```json
{
  "sub": "47",
  "roles": ["SuperAdministrador"],
  "dependenciaId": 20
}
```

**Refresh token (7d):**
```json
{
  "sub": "47"
}
```

`iat` / `exp` los agrega `jsonwebtoken` automáticamente.

### Regla de no coexistencia

Dentro del JWT solo se usan `sub` y `roles` (y `dependenciaId` en el access token). Quedan prohibidas, para representar lo mismo, las variantes: `rol`, `role`, `roles` con otro significado, `userId`, `idUsuario`, `id_usuario`.

### Dependencia: por qué no en el refresh token

`dependenciaId` (y `roles`) son datos de **autorización** y mutables. El refresh token vive 7 días y solo debe identificar al usuario (`sub`); en `/refresh-token` el backend ya vuelve a leer roles y dependencia desde la BD. Así se evita autorizar con datos desactualizados.

### Mapa de nombres fuera del JWT (documentado, no migrado en esta feature)

- Respuesta de login/refresh (`user`): `id`, `email`, `nombre`, `tipo_usuario`, `dependencia`, `dependenciaId`.
  - `user.id` ↔ `sub`; `user.tipo_usuario` ↔ `roles`.
- Identificador en requests de acciones: hoy conviven `x-user-id` (header), `body.userId` e `id_usuario` (auditoría). Se documentan como deuda a unificar en una feature posterior.

## Restricciones

- No modificar todavía la implementación (`authRoute.js`, `authToken.js`, etc.).
- Mantener los nombres de rol actuales (no migrar a códigos tipo `ADMIN` en esta fase).
- No introducir claims con datos personales (email, nombre) en el token.

## Fuera de alcance en esta fase

- Refactor/migración del código de autenticación.
- Unificación de `x-user-id` / `userId` / `id_usuario`.
- Renombrado de `tipo_usuario` en la respuesta y en el frontend.
- Rotación/revocación de refresh tokens (denylist, versión de token).

# Validation — Criterios de aceptación

La feature se considera exitosa (y mergeable) cuando se cumplan todos los siguientes criterios:

1. El contrato queda escrito y define **una única** forma para el identificador: `sub`.
2. El contrato define **una única** forma para el rol: `roles` (array de strings).
3. No se documenta coexistencia de `rol`, `role`, `roles`, `userId`, `idUsuario` o `id_usuario` para representar lo mismo dentro del JWT.
4. Quedan explícitas las duraciones: access token `15m` y refresh token `7d`, coherentes con la implementación actual y con el `maxAge` de la cookie.
5. Queda explícita la decisión de dependencia: `dependenciaId` solo en el access token; el refresh token solo lleva `sub`.
6. Queda registrado el hallazgo SEC-10 (`authRoute.js` pasa `rol`, `authToken.js` espera `roles`).
7. `Constitucion/roadmap.md` y `Constitucion/techStack.md` quedan actualizados.
8. No se modifica la implementación de autenticación (se documenta, no se refactoriza).

## Verificación realizada

- [x] Contrato documentado en `requirements.md` (claims, payloads, duraciones, secretos).
- [x] `plan.md`, `requirements.md` y `validation.md` creados en `Specs/2026-08-25-contrato-unico-autenticacion/`.
- [x] `Constitucion/roadmap.md` actualizado (Fase 2).
- [x] `Constitucion/techStack.md` actualizado (Autenticación / JWT).
- [x] `README.md` enlaza la nueva spec.

# Requirements — Dump sanitizado para entorno de prueba

## Alcance
Dump versionable que preserva estructura y filas del dump real, reemplazando los datos sensibles por datos ficticios. Excepción acordada: `visita_normativa` se reduce a ~5.000 filas.

## Contexto
- Base `bs_digesto` (MariaDB 11), 16 tablas. Dump real en `db/local/bs_digesto.sql` (no versionado).
- Inicialización automática: `docker-compose.yml` monta `./db` en `/docker-entrypoint-initdb.d`.
- Hash de contraseñas: bcrypt cost 10 (`Backend/utils/authPass.js`).

## Datos sensibles
| Tabla | Campos | Acción |
| --- | --- | --- |
| `usuario` | `nombre`, `email`, `telefono`, `clave` | Ficticios |
| `visita_normativa` | `ip`, `user_agent`, `referer` | Ficticios |
| `visita_usuario` | `ip`, `user_agent`, `referer` | Ficticios |
| `auditoria_usuario` | `ip`, `user_agent`, `referer` | Ficticios |
| Resto de tablas | Institucionales, paths, contenido, FKs | Se conservan |

## Decisiones
- `UPDATE` sobre el dump cargado y re-dump con `mysqldump`.
- Se conservan nombres institucionales, paths (`url`/`tipo`) y contenido de normativas.
- Dump sin comprimir (~4,9 MB), autocontenido.
- `db/local/` excluida de git.

## Datos ficticios
| Campo | Valor |
| --- | --- |
| `usuario.nombre` | `Usuario Prueba {id}` |
| `usuario.email` | `usuario{id}@example.com` |
| `usuario.telefono` | `0000000000` |
| `usuario.clave` | bcrypt de la contraseña del rol |
| `ip` | `0.0.0.0` |
| `user_agent` | `Mozilla/5.0 (Prueba)` |
| `referer` | `http://localhost` + path |

## Credenciales de prueba
| Rol | Usuario | Contraseña |
| --- | --- | --- |
| SuperAdministrador | `usuario47@example.com` | `DigestoSuper123!` |
| Administrador de Dependencia | `usuario48@example.com` | `DigestoAdmin123!` |
| Supervisor | `usuario51@example.com` | `DigestoSupervisor123!` |

## Fuera de alcance
- Reducir otras tablas o el contenido de normativas.
- Sanitizar nombres institucionales.

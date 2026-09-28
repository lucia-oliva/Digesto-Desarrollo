# Validation — Dump sanitizado para entorno de prueba

1. Dump sanitizado versionado en `db/bs_digesto.sql`.
2. Misma estructura: 16 tablas.
3. Filas conservadas, salvo `visita_normativa` reducida a 5.000 (acordado).
4. Sin datos sensibles: emails `@example.com`, `clave` bcrypt, IPs `0.0.0.0`, dominio real reemplazado en logs.
5. Carga desde entorno limpio verificada.
6. Credenciales documentadas y login verificado por los 3 roles.
7. `docker compose up`/`down` repetido sin afectar `mariadb_data`.
8. Dump real preservado en `db/local/` (excluido de git).

## Resultados
- Carga limpia: 16 tablas, `visita_normativa` = 5.000.
- Sanitización: 0 IPs sin sanear, 0 emails fuera de `@example.com`, 0 claves ≠ bcrypt.
- Login OK: SuperAdministrador, Administrador de Dependencia y Supervisor.
- `up`/`down` repetido OK; `mariadb_data` intacto (2.785.319 filas).

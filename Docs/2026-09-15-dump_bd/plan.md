# Plan — Dump sanitizado para entorno de prueba

Feature: `2026-09-15-dump_bd`

1. Crear `Docs/2026-09-15-dump_bd/` (`plan.md`, `requirements.md`, `validation.md`).
2. Crear `db/local/` para el dump real de cada desarrollador y ajustar `.gitignore`.
3. Mover el dump real `db/bs_digesto.sql` a `db/local/bs_digesto.sql`.
4. Cargar el dump real en un MariaDB aislado y censar tablas y campos sensibles.
5. Reducir `visita_normativa` a ~5.000 filas representativas.
6. Sanitizar `usuario`, `visita_normativa`, `visita_usuario` y `auditoria_usuario`.
7. Generar hashes bcrypt (cost 10) por rol y reemplazar `usuario.clave`.
8. Re-dump con `mysqldump` a `db/bs_digesto.sql`.
9. Verificar carga limpia en un stack aislado y login por rol.
10. Verificar `docker compose up`/`down` repetido sin afectar el volumen real.
11. Actualizar `README.md`, `contexto.md` y `Constitucion/roadmap.md`.

# Validation — Criterios de aceptación

La feature se considera exitosa cuando se cumplan todos los siguientes criterios:

1. `docker compose up` (o `docker compose up -d --build`) levanta los tres servicios **sin errores**.
2. `docker compose ps` muestra los servicios `mariadb` (contenedor `digesto-db`), `backend` y `frontend` en estado `running`, con `mariadb` en `healthy`.
3. El frontend responde en `http://localhost:5173` (HTTP 200).
4. El backend responde en `http://localhost:3000/health` con `{ ok: true, status: "up" }`.
5. MariaDB queda accesible para el backend (conexión interna vía `DB_HOST=mariadb`, que resuelve al servicio `mariadb` en la red de Docker) y, opcionalmente, desde el host por `localhost:3307` (si `MARIADB_PORT=3307`).
6. La base de datos `bs_digesto` se inicializa automáticamente con los scripts de `db/` (verificable con `SHOW TABLES` dentro del contenedor de BD).
7. El backend puede consultar normativas: `POST /api/normativa/search?page=1&limite=6` devuelve `ok:true` con resultados.
8. Los cambios de código se reflejan sin reconstruir contenedores:
   - Backend: al editar un archivo de `Backend/`, nodemon reinicia el proceso.
   - Frontend: al editar un archivo de `Digesto/src/`, Vite HMR actualiza el navegador.
9. El entorno no modifica el sistema host más allá de ejecutar Docker (sin instalaciones globales; la configuración queda versionada en `docker-compose.yml` + Dockerfiles + `.env.example`).
10. La documentación queda actualizada: `README.md`, `contexto.md`, `Constitucion/roadmap.md` (Fase 1 completada) y `Constitucion/techStack.md`.
11. Los archivos sensibles (`.env`), la documentación local (`/constitucion`, `contexto.md`) y el dump de BD (`db/*.sql`) quedan excluidos de git mediante `.gitignore`.

## Verificación realizada (OK)

```bash
docker compose up -d --build
docker compose ps
curl -s http://localhost:3000/health
# -> {"ok":true,"status":"up"}
curl -s -X POST "http://localhost:3000/api/normativa/search?page=1&limite=6" -H "Content-Type: application/json" -d "{}"
# -> {"ok":true, ..., "totalResults":3555}
docker compose exec mariadb mariadb -u digesto -pdigesto -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='bs_digesto';"
# -> 16
```

- Hot-reload backend: nodemon sobre bind mount de `./Backend`.
- Hot-reload frontend: Vite HMR con `--host`.
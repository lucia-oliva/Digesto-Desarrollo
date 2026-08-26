# Plan — Dockerización del entorno de desarrollo de Digesto

Serie numerada de tareas ejecutadas:

1. Crear carpeta de especificación `Specs/2026-08-19-dockerizacion-digesto/` con `plan.md`, `requirements.md` y `validation.md`.
2. Crear `docker-compose.yml` en la raíz con los servicios `mariadb`, `backend` y `frontend` y los volúmenes nombrados.
3. Crear `Backend/Dockerfile` (Node 20 Alpine, `npm install`, `CMD ["npm","run","dev"]`).
4. Crear `Backend/.dockerignore` (excluir `node_modules`, `.env`, `archivos/`, `.git`, logs, etc.).
5. Crear `Digesto/Dockerfile` (Node 20 Alpine, `npm install`, `CMD ["npm","run","dev","--","--host"]`).
6. Crear `Digesto/.dockerignore` (excluir `node_modules`, `dist`, `.env*`, `.git`, logs, etc.).
7. Crear `.env.example` en la raíz (credenciales de MariaDB y puertos) y crear `.env` local (gitignored).
8. Crear `Backend/.env.example` con las variables reales que lee el backend (`ACCESS_SECRET`, `REFRESH_SECRET`, etc.).
9. Crear `.gitignore` en la raíz (excluir `.env`, `/constitucion`, `contexto.md`, `Backend/archivos/`, `node_modules/`).
10. Actualizar `contexto.md` reflejando la configuración Docker y las variables de entorno.
11. Actualizar `Constitucion/roadmap.md` marcando la Fase 1 como completada.
12. Actualizar `Constitucion/techStack.md` con el stack (Node 20, MariaDB, Docker Compose).
13. Validar sintaxis con `docker compose config`.
14. Levantar el entorno con `docker compose up -d --build` y verificar contenedores, healthcheck, endpoints y base inicializada.
15. Corregir puerto en conflicto: publicar MariaDB en `MARIADB_PORT=3307` (3306 ocupado por instancia local).
16. Corregir resolución de BD: renombrar el servicio `db` → `mariadb` para que coincida con `DB_HOST=mariadb` y desaparezca el error `getaddrinfo ENOTFOUND mariadb`.
17. Verificar que `POST /api/normativa/search` devuelve normativas (`totalResults: 3555`).
18. Crear `README.md` con las instrucciones de replicación.
19. Excluir el dump de BD (`db/*.sql`) del control de versiones en `.gitignore`.
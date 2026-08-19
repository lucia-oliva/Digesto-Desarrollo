# Requirements — Dockerización del entorno de desarrollo de Digesto

## Alcance

Proveer un entorno reproducible para desarrollo/pruebas del sistema Digesto mediante Docker Compose, de modo que un desarrollador pueda ejecutar `docker compose up` y obtener frontend, backend y base de datos funcionando sin instalar nada más que Docker.

## Contexto

Proyecto monolito:
- `backend/`: API Node.js + Express (ESM).
- `digesto/`: Frontend React + Vite.
- `db/`: scripts SQL para inicializar MariaDB (`bs_digesto.sql`).
- `constitucion/` y `contexto.md`: documentación local (fuera de git).

Actualmente no existe configuración Docker.

## Decisiones técnicas

- **Orquestación:** `docker-compose.yml` en la raíz con tres servicios: `mariadb`, `backend` y `frontend`.
- **Base de datos:** imagen `mariadb:11`, con credenciales y nombre de base interpolados desde un `.env` raíz.
  - Persistencia de datos mediante un *named volume*.
  - Inicialización automática montando `./db` (solo lectura) en `/docker-entrypoint-initdb.d`.
- **Backend:** imagen base `node:20-alpine` con Dockerfile mínimo (instala dependencias una vez y corre `npm run dev` con nodemon para hot-reload).
  - Variables de entorno desde el `.env` raíz (vía `env_file` + montaje a `/app/.env` para el `--env-file=.env` de nodemon).
  - Volumen nombrado para `node_modules` (para no ocultarlo con el bind mount) y para `archivos/` (PDFs subidos).
- **Frontend:** imagen base `node:20-alpine` con Dockerfile mínimo que corre `npm run dev -- --host` para Vite HMR.
  - Volumen nombrado para `node_modules`.
- **Recarga automática:** backend con nodemon sobre bind mount; frontend con Vite HMR; se habilita `CHOKIDAR_USEPOLLING` como variable opcional para Windows/WSL.
- **Puertos (parametrizables):** MariaDB publicado en `3307` por defecto (para no chocar con un MySQL/MariaDB local), backend `3000`, frontend `5173`. Todos configurables desde el `.env` raíz.
- **Archivos subidos:** el backend persiste PDFs en `archivos/` (ruta relativa a `/app`); se mantiene persistencia con un named volume.
- **Sin cambios en la lógica de la aplicación.** La URL de la API en frontend (`API_BASE = "http://localhost:3000/api"`) sigue siendo válida porque el navegador alcanza el backend por el puerto publicado.

## Variables de entorno relevantes (backend)

Variables leídas por el código:
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` (`Backend/config.js`, `Backend/services/db.js`)
- `NODE_ENV`, `PORT`, `FRONT_ORIGINS` (`Backend/config/env.js`, `Backend/config/cors.js`)
- `ACCESS_SECRET`, `REFRESH_SECRET` (`Backend/utils/authToken.js`, `Backend/Middleware/authMiddleware.js`)
- `MAIL_USER`, `MAIL_PASS` (`Backend/utils/nodemailer.js`) — opcionales para arrancar.

> Nota: el `.env` actual declara `JWT_SECRET`, que no es usado por el código; se documenta el desajuste y se definen `ACCESS_SECRET`/`REFRESH_SECRET`.

## Restricciones

- No modificar el sistema host más allá de ejecutar Docker.
- Contenedores efímeros salvo volúmenes de datos (MariaDB y archivos subidos).
- Mantener simplicidad: usar Dockerfiles solo cuando aporten valor (fijar versión de Node e instalar dependencias una vez).

## Resultado de implementación

- Servicio de BD nombrado `mariadb` (coincide con `DB_HOST=mariadb`), con `container_name: digesto-db`.
- El alias DNS interno usa el nombre del servicio (`mariadb`), que es lo que resuelve el backend.
- MariaDB se publica en el host vía `MARIADB_PORT=3307` (el puerto 3306 estaba ocupado por una instancia local).
- El dump `db/*.sql` queda excluido del control de versiones (`.gitignore`).

## Fuera de alcance en esta fase

- Despliegue de producción (se mantiene `NODE_ENV=development`).
- Migración/empaquetado de los PDFs reales del sistema (el seed no los incluye).
- Parametrización de `API_BASE` vía `VITE_API_URL` (se deja como mejora futura).
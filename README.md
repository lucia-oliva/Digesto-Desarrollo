# Digesto

Sistema de gestión administrativa de documentos institucionales. Repositorio monolito con:

- `backend/`: API Node.js + Express (ESM).
- `digesto/`: Frontend React + Vite.
- `db/`: dump SQL para inicializar MariaDB.
- `docker-compose.yml`: orquestación del entorno de desarrollo.

## Requisitos

- Docker con Docker Compose (se probó con Docker Engine 27 y Compose v2).
- Tener el dump de base de datos en `db/bs_digesto.sql`. Este archivo **no se versiona** (está en `.gitignore`), por lo que debe colocarse manualmente antes de levantar el entorno. El directorio `db/` debe contener el archivo `bs_digesto.sql`.

## Puesta en marcha

1. (Opcional) Crear el archivo de variables de entorno a partir del ejemplo:

   ```bash
   cp .env.example .env
   ```

   Si no se crea, Compose usa valores por defecto.

2. Levantar los servicios:

   ```bash
   docker compose up -d --build
   ```

3. Verificar:

   ```bash
   docker compose ps      # mariadb en "healthy", backend y frontend en "Up"
   curl http://localhost:3000/health
   ```

## Accesos

| Servicio | URL | Notas |
| --- | --- | --- |
| Frontend | http://localhost:5173 | Vite HMR |
| Backend | http://localhost:3000 | `/health`, `/api/...` |
| MariaDB | `localhost:3307` | usuario `digesto` / `digesto`, base `bs_digesto` |

> El puerto 3306 del host suele estar ocupado por un MySQL/MariaDB local; por eso MariaDB se publica en `3307` por defecto (ver `MARIADB_PORT` en `.env`). El backend se conecta internamente mediante el alias `mariadb` en el puerto 3306 de la red de Docker.

## Variables de entorno

Todas las variables están documentadas en `.env.example` (raíz) y `Backend/.env.example`.

Principales:

- `DB_NAME`, `DB_USER`, `DB_PASS`: credenciales de la base de datos.
- `MARIADB_ROOT_PASSWORD`: contraseña de root de MariaDB.
- `MARIADB_PORT`, `BACKEND_PORT`, `FRONTEND_PORT`: puertos publicados en el host.
- `ACCESS_SECRET`, `REFRESH_SECRET`: secretos JWT (necesarios para autenticación).
- `FRONT_ORIGINS`: origen permitido por CORS (default `http://localhost:5173`).
- `CHOKIDAR_USEPOLLING`: `true` si en Docker Desktop/Windows no se reflejan los cambios del frontend.

## Modo desarrollo (recarga automática)

- **Backend**: el código de `Backend/` se monta en el contenedor y nodemon reinicia ante cambios.
- **Frontend**: el código de `Digesto/` se monta en el contenedor y Vite HMR actualiza el navegador.

No es necesario reconstruir los contenedores al editar código (solo al cambiar dependencias o Dockerfiles).

## Persistencia

- `mariadb_data`: datos de la base de datos.
- `backend_archivos`: PDFs subidos por la aplicación.

El resto de los contenedores es efímero.

## Detener el entorno

```bash
docker compose down
```

Para eliminar también los volúmenes de datos:

```bash
docker compose down -v
```

## Tests

El backend usa Jest + Supertest. Para ejecutar la suite:

```bash
cd Backend
npm install
npm test
```

Los tests de seguridad viven en `Backend/tests/security/`.

## Documentación de la feature

- Dockerización del entorno: `Specs/2026-08-19-dockerizacion-digesto/`.
- Contrato único de autenticación (JWT): `Specs/2026-08-25-contrato-unico-autenticacion/`.
- Tests base de autenticación (Jest + Supertest): `Docs/2026-08-31-tests-base-autenticacion/`.
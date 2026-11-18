# SEC-08 / SEC-12 — Configuración del formulario de contacto

## Alcance

Esta guía documenta únicamente la configuración incorporada para el formulario
de contacto: SMTP, destinatarios autorizados, Cloudflare Turnstile y rate
limiting.


## Archivos de configuración

Las plantillas que ya existían en el repositorio fueron actualizadas:

- `.env.example`: copiar a `.env` en la raíz cuando se usa Docker Compose.
- `Backend/.env.example`: copiar a `Backend/.env` cuando el backend se ejecuta
  directamente fuera de Docker.

Las plantillas están versionadas, no se cargan durante la ejecución y no deben
contener secretos reales. No se creó una plantilla adicional para el frontend:
en Docker, sus variables públicas provienen del `.env` de la raíz.

## Variables privadas del backend

Estas variables están incluidas tanto en `.env.example` como en
`Backend/.env.example`:

```env
# Cuenta SMTP institucional usada como remitente técnico.
MAIL_USER=
MAIL_PASS=

# Un único buzón institucional autorizado por dependencia.
CONTACT_RECIPIENT_APLICADAS=
CONTACT_RECIPIENT_EXACTAS=
CONTACT_RECIPIENT_SALUD=
CONTACT_RECIPIENT_SOCIALES=
CONTACT_RECIPIENT_HUMANAS=
CONTACT_RECIPIENT_CONSEJO_SUPERIOR=
CONTACT_RECIPIENT_CHEPES=
CONTACT_RECIPIENT_CATUNA=
CONTACT_RECIPIENT_AIMOGASTA=
CONTACT_RECIPIENT_CHAMICAL=
CONTACT_RECIPIENT_VILLA_UNION=

# Verificación privada de Cloudflare Turnstile.
TURNSTILE_SECRET_KEY=
TURNSTILE_EXPECTED_HOSTNAME=
TURNSTILE_TIMEOUT_MS=5000

# Rate limiting del endpoint público de contacto.
CONTACT_RATE_LIMIT_WINDOW_MS=900000
CONTACT_RATE_LIMIT_MAX=5
```

Reglas:

- `MAIL_USER` es el remitente técnico (`from`).
- El correo ingresado por el visitante se usa únicamente como `Reply-To`.
- Cada `CONTACT_RECIPIENT_*` admite una sola dirección, no una lista.
- Si una dependencia no tiene receptor válido, el backend responde `503`; no
  usa otro buzón como alternativa.
- `TURNSTILE_SECRET_KEY` es privada y nunca debe exponerse como variable
  `VITE_*`.
- En desarrollo, `TURNSTILE_EXPECTED_HOSTNAME` puede ser `localhost`; en
  producción debe coincidir con el hostname real.

## Variables públicas del frontend

La plantilla raíz `.env.example` incluye las variables públicas que Docker
Compose entrega a Vite:

```env
VITE_API_BASE_URL=http://localhost:3000/api
# Clave pública del widget de Cloudflare Turnstile.
VITE_TURNSTILE_SITE_KEY=
```

Las variables `VITE_*` pueden llegar al navegador. No colocar en ellas la secret
key, credenciales SMTP, secretos JWT ni destinatarios institucionales.

## Ejecución

Desarrollo local:

```bash
cd Backend
npm run dev
```

El backend carga `Backend/.env`. Para iniciar directamente el frontend sin crear
otro archivo `.env`, definir las variables públicas en la sesión de terminal.

PowerShell:

```powershell
cd Digesto
$env:VITE_API_BASE_URL="http://localhost:3000/api"
$env:VITE_TURNSTILE_SITE_KEY="completar-site-key-publica"
npm run dev
```

Bash:

```bash
cd Digesto
VITE_API_BASE_URL=http://localhost:3000/api \
VITE_TURNSTILE_SITE_KEY=completar-site-key-publica \
npm run dev
```

Docker Compose desde la raíz:

```bash
cp .env.example .env
docker compose up -d --build
```

Para ejecutar el backend directamente fuera de Docker:

```bash
cp Backend/.env.example Backend/.env
cd Backend
npm run dev
```

## Verificaciones realizadas

- Turnstile genera y valida el token.
- El envío SMTP real fue aprobado para Exactas y el correo llegó al buzón
  autorizado.
- `Reply-To` apunta al correo del visitante.
- La manipulación de campos SMTP y una dependencia inexistente son rechazadas.
- El rate limiting responde `429` al superar el máximo configurado.
- La suite backend quedó en 18/18 suites y 364/364 tests.
- ESLint y el build del frontend quedaron aprobados.

Las vulnerabilidades informadas por `npm audit` no se resuelven en esta tarea;
su revisión queda separada para evitar actualizaciones de dependencias no
relacionadas.

## Instrucción de continuidad para GPT

```text
Lee Docs/2026-11-17-sec-08-sec-12-contacto/README.md y revisa git status y git
diff completos. Conserva las plantillas históricas .env.example y
Backend/.env.example: ambas están versionadas y ya contienen las variables
nuevas del contacto. No crees Digesto/.env, Digesto/.env.local ni una plantilla
adicional del frontend. Backend/.env es un archivo real preexistente, ignorado
por Git, y debe conservar sus secretos; verifica solamente nombres de variables,
sin imprimir valores. Para Docker, las variables públicas y privadas provienen
del .env raíz creado localmente desde .env.example. Ejecuta tests backend,
ESLint y build frontend. No ejecutes npm audit, no actualices dependencias y no
hagas commit ni push sin autorización expresa.
```

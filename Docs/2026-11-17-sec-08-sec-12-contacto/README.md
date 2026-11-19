# SEC-08 / SEC-12 — Configuración del formulario de contacto

## Alcance

Esta guía documenta únicamente la configuración incorporada para el formulario
de contacto: SMTP, destinatarios autorizados, Cloudflare Turnstile y rate
limiting.

La solución implementada reemplaza el destinatario enviado por el navegador por un identificador de dependencia (dependenciaId). El backend determina el buzón autorizado mediante configuración privada.

También se incorporaron:

-Validación de los campos recibidos.
-Verificación de Cloudflare Turnstile en el backend.
-Limitación de solicitudes por dirección IP.
-Separación entre remitente institucional y dirección de respuesta del visitante.
-Pruebas automatizadas de seguridad.


## Archivos de configuración

Las plantillas que ya existían en el repositorio fueron actualizadas:

- `.env.example`: copiar a `.env` en la raíz cuando se usa Docker Compose.
- `Backend/.env.example`: copiar a `Backend/.env` cuando el backend se ejecuta
  directamente fuera de Docker.

## Variables privadas del backend

Estas variables están incluidas tanto en `.env.example` como en
`Backend/.env.example`:

```env
# Cuenta SMTP institucional usada como remitente técnico. Solo se admite GMAIL
MAIL_USER= [EMAIL]
MAIL_PASS= [PASS]

# Un único buzón institucional autorizado por dependencia.
CONTACT_RECIPIENT_APLICADAS=[EMAIL]
CONTACT_RECIPIENT_EXACTAS=[EMAIL]
CONTACT_RECIPIENT_SALUD=[EMAIL]
CONTACT_RECIPIENT_SOCIALES=[EMAIL]
CONTACT_RECIPIENT_HUMANAS=[EMAIL]
CONTACT_RECIPIENT_CONSEJO_SUPERIOR=[EMAIL]
CONTACT_RECIPIENT_CHEPES=[EMAIL]
CONTACT_RECIPIENT_CATUNA=[EMAIL]
CONTACT_RECIPIENT_AIMOGASTA=[EMAIL]
CONTACT_RECIPIENT_CHAMICAL=[EMAIL]
CONTACT_RECIPIENT_VILLA_UNION=[EMAIL]

# Verificación privada de Cloudflare Turnstile.
TURNSTILE_SECRET_KEY=[SECRET_KEY_CLOUDFLARE]
TURNSTILE_EXPECTED_HOSTNAME=[HOST_NAME]
TURNSTILE_TIMEOUT_MS=5000

# Rate limiting del endpoint público de contacto.
CONTACT_RATE_LIMIT_WINDOW_MS=900000
CONTACT_RATE_LIMIT_MAX=5
```

## Variables públicas del frontend

La plantilla raíz `.env.example` incluye las variables públicas que Docker
Compose entrega a Vite:

```env
VITE_API_BASE_URL=http://localhost:3000/api
# Clave pública del widget de Cloudflare Turnstile.
VITE_TURNSTILE_SITE_KEY=[SITE_KEY_CLOUDFLARE]
```

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
- El envío SMTP real fue aprobado y el correo llegó al buzón
  autorizado.
- `Reply-To` apunta al correo del visitante.
- La manipulación de campos SMTP y una dependencia inexistente son rechazadas.
- El rate limiting responde `429` al superar el máximo configurado.
- La suite backend quedó en 18/18 suites y 364/364 tests.
- ESLint y el build del frontend quedaron aprobados.


## Estado de dependencias

Durante el desarrollo de esta rama también se actualizaron dependencias del frontend y del backend.

En la última verificación local del backend:
- `npm audit --omit=dev`: 0 vulnerabilidades reportadas.
- `npm audit`: 18 alertas moderadas asociadas a dependencias de desarrollo de Jest.
- `npm test`: 18 suites y 364 pruebas aprobadas.

Las alertas moderadas de desarrollo permanecen documentadas como pendientes de revisión. No se utilizó `npm audit fix --force` para evitar cambios incompatibles.

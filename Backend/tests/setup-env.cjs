const path = require("path");

// Entorno determinista para los tests del backend.
process.env.NODE_ENV = "test";

process.env.ACCESS_SECRET = "test-access-secret";
process.env.REFRESH_SECRET = "test-refresh-secret";

// Los tests NUNCA deben utilizar Backend/archivos.
// Todos los archivos temporales se aíslan dentro del árbol de tests.
process.env.FILES_ROOT = path.resolve(
  __dirname,
  ".tmp",
  "archivos",
);

// Configuración aislada del formulario de contacto.
process.env.MAIL_USER = "digesto@example.test";
process.env.MAIL_PASS = "test-mail-password";
process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret";
process.env.CONTACT_RATE_LIMIT_WINDOW_MS = "60000";
process.env.CONTACT_RATE_LIMIT_MAX = "3";

const contactRecipients = [
  "APLICADAS",
  "EXACTAS",
  "SALUD",
  "SOCIALES",
  "HUMANAS",
  "CONSEJO_SUPERIOR",
  "CHEPES",
  "CATUNA",
  "AIMOGASTA",
  "CHAMICAL",
  "VILLA_UNION",
];

for (const dependency of contactRecipients) {
  process.env[`CONTACT_RECIPIENT_${dependency}`] =
    `${dependency.toLowerCase()}@example.test`;
}

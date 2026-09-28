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

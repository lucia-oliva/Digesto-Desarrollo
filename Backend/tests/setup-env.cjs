// Entorno determinista para los tests del backend.
// Jest ejecuta este archivo (setupFiles) antes de cargar los módulos de test,
// de modo que ACCESS_SECRET / REFRESH_SECRET estén disponibles cuando
// authToken.js y authMiddleware.js los leen en el momento del import.

process.env.NODE_ENV = "test";
process.env.ACCESS_SECRET = "test-access-secret";
process.env.REFRESH_SECRET = "test-refresh-secret";

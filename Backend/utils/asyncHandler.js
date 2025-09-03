// Middleware to handle async errors in Express routes
// se captura el error y se pasa al siguiente middleware de manejo de errores
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

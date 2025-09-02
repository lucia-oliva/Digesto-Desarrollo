import app from "./app.js";
import { ENV } from "./config/env.js";

app.listen(ENV.PORT, () => {
  console.log(
    `Servidor Funcionando en el puerto ${ENV.PORT} [${ENV.NODE_ENV}]`
  );
});

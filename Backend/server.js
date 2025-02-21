import express from "express";
import usuarios from "./routes/usuarioRoutes.js";

// crear el servidor
const app = express();

// middlewares
app.use(express.json());

// rutas de la api
app.use("/api/usuarios", usuarios);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// iniciar el servidor
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

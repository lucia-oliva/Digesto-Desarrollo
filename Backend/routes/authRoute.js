import express from "express";
import db from "../services/db.js";
import { verifyPassword } from "../utils/authPass.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/authToken.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  
  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const user = await db.query(
    "SELECT u.id, u.email, u.clave, u.nombre, tu.permiso, tu.nombre as Rol FROM usuario u JOIN tipo_usuario tu on tu.id = u.id WHERE email = ?"
    [email]
  );

  if (user== null || user.length === 0  ) {
    return res.status(401).json({ msg: "Email o contraseña Incorrectos" });
  }
  const { isMatch, newHash } = await verifyPassword(password, user[0].clave);
  if (!isMatch) {
    return res.status(401).json({ msg: "Email o contraseña Incorrectos" });
  }
  if (newHash) {
    await db.query("UPDATE usuario SET clave = ? WHERE id = ?", [
      newHash,
      user[0].id,
    ]);
  }

  const accessToken = generateAccessToken(user[0]);
  const refreshToken = generateRefreshToken(user[0]);

  /* TODO: Crear la columna refreshToken en la tabla usuario
  await db.query("UPDATE usuario SET refreshToken = ? WHERE id = ?", [
    refreshToken,
    user[0].id,
  ]);*/

  res
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
    .json({ accessToken });
});


router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ msg: "Token inválido" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload.user.id) {
      return res.status(403).json({ msg: "Token inválido" });
    }

    const [user] = await db.query(
      "SELECT id, email, nombre FROM usuario WHERE id = ?",
      [payload.user.id]
    );
    
    if (!user || user.length === 0) {
      return res.status(401).json({ msg: "Usuario no encontrado" });
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    /* TODO: Crear la columna refreshToken en la tabla usuario
    await db.query("UPDATE usuario SET refreshToken = ? WHERE id = ?", [
      newRefreshToken,
      user[0].id,
    ]);
    */

    res
      .cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true })
      .json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403);
  }
});

router.post("/logout", async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const {user}  = verifyRefreshToken(token);
      
      // Simulación del update, ya que la columna no existe
      console.log(`Simulando logout para usuario ID ${user}`);
      
      // TODO real:
      // await db.query("UPDATE usuario SET refreshToken = NULL WHERE id = ?", [id]);
      
    } catch (error) {
      console.error("Token inválido:", error);
      return res.status(403).json({ error: "Token inválido" });
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true, // solo en producción con HTTPS
    sameSite: "Strict"
  }).sendStatus(204);
});

export default router;

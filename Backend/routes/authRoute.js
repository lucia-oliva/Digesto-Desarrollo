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
    "SELECT id, email, clave, nombre FROM usuario WHERE email = ?",
    [email]
  );

  console.log(user);

  if (user.length === 0) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }
  const { isMatch, newHash } = await verifyPassword(password, user[0].clave);
  if (!isMatch) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
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
    return res.status(401);
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const [user] = await db.query(
      "SELECT id, email, nombre FROM usuario WHERE id = ?",
      [payload.id]
    );
    if (user.length === 0) {
      return res.status(403);
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
      const { id } = verifyRefreshToken(token);
      /* TODO: Crear la columna refreshToken en la tabla usuario
      await db.query("UPDATE usuario SET refreshToken = NULL WHERE id = ?", [id]);
      */
    } catch (error) {
      return res.status(403);
    }
  }
  res.clearCookie("refreshToken").sendStatus(204);
});

export default router;

import express from "express";
import db from "../services/db.js";
import { verifyPassword } from "../utils/authPass.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/authToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const isProd = process.env.NODE_ENV === "production";

const cookieOpts = {
  httpOnly: true,
  secure: isProd ? true : false, 
  sameSite: isProd ? "none" : "strict", 
  path: "/api/auth", 
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const rows = await db.queryOne(
      "SELECT usuario.id, usuario.email, usuario.nombre,usuario.estado, usuario.clave, tu.nombre AS tipo_usuario, de.nombre AS dependencia FROM usuario LEFT JOIN tipo_usuario tu ON tu.id = usuario.id_tipo_usuario LEFT JOIN dependencia de ON de.id = usuario.id_dependencia WHERE usuario.email = ?",
      [email]
    );

    if (rows == null || rows.length === 0) {
      return res.status(401).json({ msg: "Email o contraseña Incorrectos" });
    }

    const user = rows;

    console.log("user", user);

    const { isMatch, newHash } = await verifyPassword(password, user.clave);
    if (!isMatch) {
      return res.status(401).json({ msg: "Email o contraseña Incorrectos" });
    }

    if (newHash) {
      await db.execute("UPDATE usuario SET clave = ? WHERE id = ?", [
        newHash,
        user.id,
      ]);
    }

    if (user.estado != "activo") {
      return res.status(403).json({
        msg: "Usuario Inactivo contactese con la Secretaria Informatica",
      });
    }


    const userClaims = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      tipo_usuario: user.tipo_usuario,
      dependencia: user.dependencia,
    };

  
    const accessToken = generateAccessToken({
      id: user.id,
      rol: user.tipo_usuario,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      rol: user.tipo_usuario,
    });

    res
      .cookie("refreshToken", refreshToken, cookieOpts)
      .json({ accessToken, user: userClaims });
  })
);

router.post(
  "/refresh-token",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ msg: "No hay refresh token" });

    try {
      const payload = verifyRefreshToken(token);
      const userId = payload.sub;
      const user = await db.queryOne(
        "SELECT usuario.id, usuario.email, usuario.estado , usuario.nombre, tu.nombre AS tipo_usuario, de.nombre AS dependencia " +
          "FROM usuario " +
          "LEFT JOIN tipo_usuario tu ON tu.id = usuario.id_tipo_usuario " +
          "LEFT JOIN dependencia de ON de.id = usuario.id_dependencia " +
          "WHERE usuario.id = ?",
        [userId]
      );

      if (!user) {
        res.clearCookie("refreshToken", cookieOpts);
        return res.status(401).json({ msg: "Usuario no encontrado" });
      }

      if (user.estado !== "activo") {
        res.clearCookie("refreshToken", cookieOpts);
        return res.status(403).json({
          msg: "Usuario Inactivo contactese con la Secretaria Informatica",
        });
      }

      const userClaims = {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        tipo_usuario: user.tipo_usuario,
        dependencia: user.dependencia,
      };

      const newAccess = generateAccessToken({
        id: user.id,
        roles: [user.tipo_usuario],
      });
      const newRefresh = generateRefreshToken({
        id: user.id,
        roles: [user.tipo_usuario],
      });

      res
        .cookie("refreshToken", newRefresh, cookieOpts)
        .json({ accessToken: newAccess, user: userClaims });
    } catch (e) {
      res.clearCookie("refreshToken", cookieOpts);
      return res.status(401).json({ msg: "Refresh inválido o vencido" });
    }
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd ? true : false,
      sameSite: isProd ? "none" : "strict",
      path: "/api/auth",
      maxAge: 0, 
    });

    return res.status(200).json({ msg: "Sesión cerrada correctamente" });
  })
);

export default router;

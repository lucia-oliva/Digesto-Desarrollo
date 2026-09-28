import express from "express";
import db from "../services/db.js";
import { verifyPassword } from "../utils/authPass.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/authToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

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
      throw httpError(400, "Faltan datos obligatorios.");
    }

    const rows = await db.queryOne(
      "SELECT usuario.id, usuario.email, usuario.nombre,usuario.estado, usuario.clave, usuario.id_dependencia AS dependenciaId, tu.nombre AS tipo_usuario, de.nombre AS dependencia FROM usuario LEFT JOIN tipo_usuario tu ON tu.id = usuario.id_tipo_usuario LEFT JOIN dependencia de ON de.id = usuario.id_dependencia WHERE usuario.email = ?",
      [email]
    );

    if (rows == null || rows.length === 0) {
      throw httpError(401, "Email o contraseña incorrectos.");
    }

    const user = rows;


    const { isMatch, newHash } = await verifyPassword(password, user.clave);
    if (!isMatch) {
      throw httpError(401, "Email o contraseña incorrectos.");
    }

    if (newHash) {
      await db.execute("UPDATE usuario SET clave = ? WHERE id = ?", [
        newHash,
        user.id,
      ]);
    }

    if (user.estado != "activo") {
      throw httpError(403, "Usuario inactivo. Contacte con la Secretaría Informática.");
    }


    const userClaims = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      tipo_usuario: user.tipo_usuario,
      dependencia: user.dependencia,
      dependenciaId: user.dependenciaId ?? null,
    };

  
    const accessToken = generateAccessToken({
      id: user.id,
      roles: [user.tipo_usuario],
      dependenciaId: user.dependenciaId ?? null,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
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
    if (!token) throw httpError(401);

    try {
      const payload = verifyRefreshToken(token);
      const userId = payload.sub;
      const user = await db.queryOne(
        "SELECT usuario.id, usuario.email, usuario.estado , usuario.nombre,usuario.id_dependencia AS dependenciaId, tu.nombre AS tipo_usuario, de.nombre AS dependencia " +
          "FROM usuario " +
          "LEFT JOIN tipo_usuario tu ON tu.id = usuario.id_tipo_usuario " +
          "LEFT JOIN dependencia de ON de.id = usuario.id_dependencia " +
          "WHERE usuario.id = ?",
        [userId]
      );

      if (!user) {
        res.clearCookie("refreshToken", cookieOpts);
        throw httpError(401);
      }

      if (user.estado !== "activo") {
        res.clearCookie("refreshToken", cookieOpts);
        throw httpError(403, "Usuario inactivo. Contacte con la Secretaría Informática.");
      }

      const userClaims = {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        tipo_usuario: user.tipo_usuario,
        dependencia: user.dependencia,
        dependenciaId: user.dependenciaId ?? null,
      };

     const newAccess = generateAccessToken({
        id: user.id,
        roles: [user.tipo_usuario],
        dependenciaId: user.dependenciaId ?? null,
      });
      const newRefresh = generateRefreshToken({
        id: user.id,
      });

      res
        .cookie("refreshToken", newRefresh, cookieOpts)
        .json({ accessToken: newAccess, user: userClaims });
    } catch (error) {
      res.clearCookie("refreshToken", cookieOpts);

      if (error?.status) {
        throw error;
      }

      throw httpError(401);
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

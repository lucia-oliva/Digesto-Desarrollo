import { describe, expect, test } from "@jest/globals";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/authToken.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

describe("utils/authToken", () => {
  test("generateAccessToken firma sub y roles con ACCESS_SECRET", () => {
    const token = generateAccessToken({
      id: "47",
      roles: ["SuperAdministrador"],
    });

    const payload = jwt.verify(token, ACCESS_SECRET);

    expect(payload.sub).toBe("47");
    expect(payload.roles).toEqual(["SuperAdministrador"]);
  });

  test("generateRefreshToken firma sub con REFRESH_SECRET", () => {
    const token = generateRefreshToken({ id: "47", roles: [] });

    const payload = jwt.verify(token, REFRESH_SECRET);

    expect(payload.sub).toBe("47");
  });

  test("verifyAccessToken devuelve el payload de un token válido", () => {
    const token = generateAccessToken({
      id: "1",
      roles: ["Supervisor"],
    });

    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe("1");
    expect(payload.roles).toEqual(["Supervisor"]);
  });

  test("verifyAccessToken lanza con un token firmado con otra clave", () => {
    const token = jwt.sign(
      { sub: "1", roles: [] },
      "otra-clave",
      { expiresIn: "15m" },
    );

    expect(() => verifyAccessToken(token)).toThrow();
  });

  test("verifyAccessToken lanza con un token expirado", () => {
    const token = jwt.sign(
      { sub: "1", roles: [] },
      ACCESS_SECRET,
      { expiresIn: -10 },
    );

    expect(() => verifyAccessToken(token)).toThrow();
  });

  test("verifyRefreshToken lanza con un token firmado con ACCESS_SECRET", () => {
    const token = jwt.sign(
      { sub: "1", roles: [] },
      ACCESS_SECRET,
      { expiresIn: "7d" },
    );

    expect(() => verifyRefreshToken(token)).toThrow();
  });
});

import { describe, expect, jest, test } from "@jest/globals";
import jwt from "jsonwebtoken";

import { authenticateToken } from "../../Middleware/authMiddleware.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;

function createReq(authorization) {
  return { headers: { authorization } };
}

function createRes() {
  const res = {};
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn(() => res);
  return res;
}

describe("authenticateToken (unit)", () => {
  test("sin Authorization responde 401 y no llama next", () => {
    const req = createReq(undefined);
    const res = createRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("token malformado sin prefijo Bearer responde 401", () => {
    const req = createReq("un-token-sin-bearer");
    const res = createRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("header Bearer sin token responde 401", () => {
    const req = createReq("Bearer");
    const res = createRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("token inválido responde 401 (SEC-01)", () => {
    const token = jwt.sign(
      { sub: "1", roles: [] },
      "otra-clave",
      { expiresIn: "15m" },
    );
    const req = createReq(`Bearer ${token}`);
    const res = createRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("token expirado responde 401 (SEC-01)", () => {
    const token = jwt.sign(
      { sub: "1", roles: [] },
      ACCESS_SECRET,
      { expiresIn: -10 },
    );
    const req = createReq(`Bearer ${token}`);
    const res = createRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("token válido llama next y expone req.user", () => {
    const token = jwt.sign(
      { sub: "1", roles: ["SuperAdministrador"] },
      ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    const req = createReq(`Bearer ${token}`);
    const res = createRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.sub).toBe("1");
    expect(req.user.roles).toEqual(["SuperAdministrador"]);
  });
});

import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeAll, describe, expect, test } from "@jest/globals";

import { authenticateToken } from "../../Middleware/authMiddleware.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.get("/protegido", authenticateToken, (req, res) =>
    res.status(200).json({ ok: true, user: req.user }),
  );
});

describe("authenticateToken (integración HTTP)", () => {
  test("sin Authorization responde 401", async () => {
    const res = await request(app).get("/protegido");

    expect(res.status).toBe(401);
  });

  test("token malformado responde 401", async () => {
    const res = await request(app)
      .get("/protegido")
      .set("Authorization", "Bearer");

    expect(res.status).toBe(401);
  });

  test("token inválido responde 401 (SEC-01)", async () => {
    const token = jwt.sign({ sub: "1", roles: [] }, "otra-clave", {
      expiresIn: "15m",
    });
    const res = await request(app)
      .get("/protegido")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
  });

  test("token expirado responde 401 (SEC-01)", async () => {
    const token = jwt.sign({ sub: "1", roles: [] }, ACCESS_SECRET, {
      expiresIn: -10,
    });
    const res = await request(app)
      .get("/protegido")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
  });

  test("token válido no responde 401", async () => {
    const token = jwt.sign(
      { sub: "1", roles: ["SuperAdministrador"] },
      ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    const res = await request(app)
      .get("/protegido")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.user.sub).toBe("1");
  });
});

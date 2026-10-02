import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const dbMock = {
  query: jest.fn(),
  queryOne: jest.fn(),
  execute: jest.fn(),
};

const hashPasswordBcryptMock = jest.fn();

jest.unstable_mockModule("../../services/db.js", () => ({
  default: dbMock,
}));

jest.unstable_mockModule("../../utils/authPass.js", () => ({
  hashPasswordBcrypt: hashPasswordBcryptMock,
}));

const { default: UsuariosDB } = await import("../../services/usuarios.js");

describe("servicio de usuarios - gestión de contraseñas", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    hashPasswordBcryptMock.mockResolvedValue(
      "$2b$10$hash-de-prueba",
    );

    dbMock.execute.mockResolvedValue({
      affectedRows: 1,
    });
  });

  describe("cambiarContrasena", () => {
    test("genera hash y actualiza únicamente la contraseña", async () => {
      const result = await UsuariosDB.cambiarContrasena({
        id: 47,
        password: "NuevaClave123",
      });

      expect(hashPasswordBcryptMock).toHaveBeenCalledTimes(1);
      expect(hashPasswordBcryptMock).toHaveBeenCalledWith(
        "NuevaClave123",
      );

      expect(dbMock.execute).toHaveBeenCalledTimes(1);
      expect(dbMock.execute).toHaveBeenCalledWith(
        "UPDATE usuario SET clave = ? WHERE id = ?",
        ["$2b$10$hash-de-prueba", 47],
      );

      expect(result).toEqual({
        mensaje: "Contraseña actualizada correctamente",
      });
    });

    test("rechaza una contraseña vacía", async () => {
      await expect(
        UsuariosDB.cambiarContrasena({
          id: 47,
          password: "   ",
        }),
      ).rejects.toMatchObject({
        status: 400,
      });

      expect(hashPasswordBcryptMock).not.toHaveBeenCalled();
      expect(dbMock.execute).not.toHaveBeenCalled();
    });

    test("rechaza un id inexistente cuando no se actualiza ninguna fila", async () => {
      dbMock.execute.mockResolvedValueOnce({
        affectedRows: 0,
      });

      await expect(
        UsuariosDB.cambiarContrasena({
          id: 999,
          password: "NuevaClave123",
        }),
      ).rejects.toMatchObject({
        status: 404,
      });

      expect(hashPasswordBcryptMock).toHaveBeenCalledWith(
        "NuevaClave123",
      );
      expect(dbMock.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe("edit", () => {
    test("no modifica la contraseña aunque reciba password", async () => {
      await UsuariosDB.edit({
        id: 47,
        rol: 1,
        nombre: "Usuario de prueba",
        email: "usuario@example.com",
        telefono: "",
        estado: "activo",
        dependencia: 0,
        password: "IntentoDeCambio123",
      });

      expect(dbMock.execute).toHaveBeenCalledTimes(1);

      const [sql, params] = dbMock.execute.mock.calls[0];

      expect(sql).not.toMatch(/\bclave\b/i);
      expect(params).not.toContain("IntentoDeCambio123");
      expect(hashPasswordBcryptMock).not.toHaveBeenCalled();
    });
  });

  describe("salida de datos de usuario", () => {
    test("getUsuarioByIdDatos no selecciona ni devuelve credenciales", async () => {
      dbMock.queryOne.mockResolvedValue({
        id: 47,
        telefono: "3804000000",
        estado: "activo",
        email: "usuario@example.com",
        nombre: "Usuario de prueba",
        rol: 1,
        dependencia: 2,
      });

      const usuario = await UsuariosDB.getUsuarioByIdDatos(47);

      const [sql] = dbMock.queryOne.mock.calls[0];

      expect(sql).not.toMatch(/SELECT\s+\*/i);
      expect(sql).not.toMatch(/\bclave\b/i);
      expect(sql).not.toMatch(/\bpassword\b/i);
      expect(sql).not.toMatch(/\bhash\b/i);

      expect(usuario).not.toHaveProperty("clave");
      expect(usuario).not.toHaveProperty("password");
      expect(usuario).not.toHaveProperty("hash");
    });

    test("searchUsuariosByParameters no selecciona ni devuelve credenciales", async () => {
      dbMock.query.mockResolvedValue([
        {
          id: 47,
          nombre: "Usuario de prueba",
          telefono: "3804000000",
          email: "usuario@example.com",
          fecha_alta: "2026-01-01",
          ultima_visita: "2026-10-01",
          estado: "activo",
          rol: "Administrador",
          dependencia: "Rectorado",
          total: 1,
        },
      ]);

      const resultado = await UsuariosDB.searchUsuariosByParameters(
        null,
        null,
        null,
        null,
      );

      const [sql] = dbMock.query.mock.calls[0];

      expect(sql).not.toMatch(/SELECT\s+\*/i);
      expect(sql).not.toMatch(/\bclave\b/i);
      expect(sql).not.toMatch(/\bpassword\b/i);
      expect(sql).not.toMatch(/\bhash\b/i);

      expect(resultado.data[0]).not.toHaveProperty("clave");
      expect(resultado.data[0]).not.toHaveProperty("password");
      expect(resultado.data[0]).not.toHaveProperty("hash");
    });
  });
});
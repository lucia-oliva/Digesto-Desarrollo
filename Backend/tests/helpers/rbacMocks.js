import { jest } from "@jest/globals";

import {
  CONSEJO_DEPENDENCY_ID,
  DEFAULT_DEPENDENCY_ID,
} from "./authTokens.js";

let resourceState = "despublicado";
let resourceDependencyId = DEFAULT_DEPENDENCY_ID;

function resourceAccessContext() {
  return {
    estado: resourceState,
    dependenciaId: resourceDependencyId,
    resourceType: "normativa",
  };
}

export function resetRbacMockState() {
  resourceState = "despublicado";
  resourceDependencyId = DEFAULT_DEPENDENCY_ID;
}

export function setRbacResourceState(estado) {
  resourceState = estado;
}

const dbMock = {
  pool: {},
  query: jest.fn(async (sql) =>
    String(sql).trim().toUpperCase().startsWith("SELECT")
      ? []
      : { affectedRows: 1, insertId: 1 },
  ),
  queryOne: jest.fn(async () => null),
  execute: jest.fn(async () => ({ affectedRows: 1, insertId: 1 })),
  transaction: jest.fn(async (fn) =>
    fn(async () => ({ affectedRows: 1, insertId: 1 })),
  ),
  closePool: jest.fn(async () => {}),
};

const normativaMock = {
  getNormativaAccessContext: jest.fn(async () => resourceAccessContext()),
  getNormativaDependencyById: jest.fn(async () => resourceDependencyId),
  getNormativaCompletaById: jest.fn(async () => ({ id: 1 })),
  edit: jest.fn(async () => ({ message: "editada" })),
  create: jest.fn(async () => ({ insertId: 1 })),
  searchById: jest.fn(async () => ({ id: 1 })),
  eliminar: jest.fn(async () => ({ affectedRows: 1 })),
  searchNormativaByParameters: jest.fn(async () => ({
    data: [],
    totalResults: 0,
  })),
  searchNormativaEliminadaByParameters: jest.fn(async () => ({
    data: [],
    totalResults: 0,
  })),
  searchNormativaDespublicadasByParameters: jest.fn(async () => ({
    data: [],
    totalResults: 0,
  })),
  publicar: jest.fn(async () => ({ affectedRows: 1 })),
  getAllYears: jest.fn(async () => []),
  getEliminatedNormatives: jest.fn(async () => []),
  getMostPopularNormatives: jest.fn(async () => []),
  restaurar: jest.fn(async () => ({ affectedRows: 1 })),
};

const dependenciaMock = {
  getDepenendenciaById: jest.fn(async (id) => ({
    id: Number(id),
    nombre:
      Number(id) === CONSEJO_DEPENDENCY_ID
        ? "Consejo Superior"
        : "Dependencia de prueba",
  })),
  create: jest.fn(async () => ({ success: true, id: 1 })),
  edit: jest.fn(async () => ({ success: true })),
  getAllDependencias: jest.fn(async () => [{ id: 1 }]),
  getDependencias: jest.fn(async () => [{ id: 1 }]),
  getSesionesPaginado: jest.fn(async () => ({
    data: [],
    totalResults: 0,
  })),
  getAllNamesDependencias: jest.fn(async () => []),
  searchDependenciaByParameters: jest.fn(async () => ({
    data: [{ id: 1 }],
    totalResults: 1,
  })),
  eliminar: jest.fn(async () => ({ affectedRows: 1 })),
};

const emisoresMock = {
  getById: jest.fn(async () => ({ id: 1 })),
  getAllEmisoresName: jest.fn(async () => []),
  getEmisores: jest.fn(async () => []),
  edit: jest.fn(async () => ({ mensaje: "editado" })),
  create: jest.fn(async () => ({ affectedRows: 1, insertId: 1 })),
  searchEmisorByParameters: jest.fn(async () => ({
    data: [{ id: 1 }],
    totalResults: 1,
  })),
  eliminar: jest.fn(async () => ({ affectedRows: 1 })),
};

const tagsMock = {
  eliminar: jest.fn(async () => ({ affectedRows: 1 })),
  getById: jest.fn(async () => ({ id: 1 })),
  getAllTags: jest.fn(async () => []),
  edit: jest.fn(async () => ({ success: true })),
  create: jest.fn(async () => ({ success: true })),
  getTagsByNormativaId: jest.fn(async () => []),
  insertTagsForNormativa: jest.fn(async () => ({ affectedRows: 1 })),
  searchTagsByParameters: jest.fn(async () => ({
    data: [],
    totalResults: 0,
  })),
};

const usuariosMock = {
  cambiarEstado: jest.fn(async () => ({ mensaje: "actualizado" })),
  create: jest.fn(async () => ({ mensaje: "creado" })),
  edit: jest.fn(async () => ({ mensaje: "editado" })),
  getAllUsuarios: jest.fn(async () => [{ id: 1 }]),
  getUsuarioById: jest.fn(async () => ({ id: 1 })),
  getUsuarioByIdDatos: jest.fn(async () => ({ id: 1 })),
  eliminar: jest.fn(async () => ({ affectedRows: 1 })),
  updateUsuario: jest.fn(async () => true),
  filterUsuariosporDepartament: jest.fn(async () => [{ id: 1 }]),
  searchUsuariosByParameters: jest.fn(async () => ({
    data: [{ id: 1 }],
    totalResults: 1,
  })),
};

jest.unstable_mockModule("../../services/db.js", () => ({
  ...dbMock,
  default: dbMock,
}));
jest.unstable_mockModule("../../services/normativa.js", () => ({
  default: normativaMock,
}));
jest.unstable_mockModule("../../services/dependencia.js", () => ({
  default: dependenciaMock,
}));
jest.unstable_mockModule("../../services/emisores.js", () => ({
  default: emisoresMock,
}));
jest.unstable_mockModule("../../services/tag.js", () => ({
  default: tagsMock,
}));
jest.unstable_mockModule("../../services/usuarios.js", () => ({
  default: usuariosMock,
}));
jest.unstable_mockModule("../../services/sesiones.js", () => ({
  default: {
    eliminar: jest.fn(async () => ({ affectedRows: 1 })),
    create: jest.fn(async () => ({ id_sesion: 1 })),
    getSesionById: jest.fn(async () => ({ id_sesion: 1 })),
  },
}));
jest.unstable_mockModule("../../services/file.js", () => ({
  default: {
    getFileAccessContext: jest.fn(async () => resourceAccessContext()),
    procesarArchivoDeNormativa: jest.fn(async () => ({
      filename: "test.pdf",
    })),
  },
}));
jest.unstable_mockModule("../../services/auditoria.js", () => ({
  default: {
    searchAuditoriaByParameters: jest.fn(async () => ({
      data: [],
      totalResults: 0,
    })),
  },
}));
jest.unstable_mockModule("../../services/dashboard.js", () => ({
  default: {
    getDashboardCounts: jest.fn(async () => ({})),
  },
}));
jest.unstable_mockModule("../../services/relaciones.js", () => ({
  default: {
    getByNormativaOriginal: jest.fn(async () => []),
    getByNormativaComplementaria: jest.fn(async () => []),
  },
}));
jest.unstable_mockModule("../../services/tipo_normativa.js", () => ({
  default: {
    getAllTipoNormativa: jest.fn(async () => []),
  },
}));
jest.unstable_mockModule("../../utils/nodemailer.js", () => ({
  default: jest.fn(async () => ({ ok: true })),
}));
jest.unstable_mockModule("../../Middleware/fileMiddleware.js", () => ({
  pdfHandler: {
    single: () => (req, _res, next) => {
      req.file = {
        filename: "test.pdf",
        mimetype: "application/pdf",
      };
      next();
    },
  },
}));

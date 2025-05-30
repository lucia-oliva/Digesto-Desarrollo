import { normativaColumns, usuarioColumns, depenColumns } from "./dataTable";

export const adminConfig = {
  ListadoNormativa: {
    tipo: "normativa",
    columns: normativaColumns,
  },
  ListadoUsuarios: {
    tipo: "usuarios",
    columns: usuarioColumns,
  },
  ListadoDependencias: {
    tipo: "dependencias",
    columns: depenColumns,
  },
};

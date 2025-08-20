
import { normativaColumns, usuarioColumns, depenColumns, emisorColumns, tagsColumns, sesionesColumns, auditoriaColums } from "./dataTable";

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
    tipo: "dependencia",
    columns: depenColumns,
  },
  ListadoEmisores:{
    tipo: "emisores",
    columns: emisorColumns,
  },
  ListadoPalabrasClave:{
    tipo: "tag",
    columns: tagsColumns,
  },
  SesionesConsejo: {
    tipo: "sesiones", 
    columns: sesionesColumns,
  },
  ListadoAuditoria: {
    tipo: "auditoria",
    columns: auditoriaColums ,
  },
  ListadoNormativaEliminadas: {
    tipo: "normativasEliminadas",
    columns: normativaColumns,
  },
  ListadoNormativaDespublicadas: {
    tipo: "normativaDespublicadas",
    columns: normativaColumns,
  },
};

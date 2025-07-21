//Falta emisores y tags. 

import { normativaColumns, usuarioColumns, depenColumns, emisorColumns, tagsColumns, sesionesColumns } from "./dataTable";

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
    tipo: "sesiones", // este será el tipo que usarás en la tabla
    columns: sesionesColumns,
  },
  
};

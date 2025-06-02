//Falta emisores y tags. 

import { normativaColumns, usuarioColumns, depenColumns, emisorColumns, tagsColumns } from "./dataTable";

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
  
};

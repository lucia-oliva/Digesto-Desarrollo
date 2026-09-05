// configFilter.js


export const tipoNormativaOptions = [
  { label: "Resolución", value: 2 },
  { label: "Convenio", value: 3 },
  { label: "Otros", value: 7 },
  { label: "Ordenanza", value: 6 },
];

export const filterConfig = {
  ListadoNormativa: [
    {
      name: "numero",
      type: "text",
      label: "Número",
    },
    {
      name:"resumen",
      type:"text",
      label:"Palabras Clave"
    },
    {
      name: "dependencia",
      type: "select",
      label: "Dependencia",
      fromContext: "dependencias",
    },
    {
      name: "emisor",
      type: "select",
      label: "Emisor",
      fromContext: "emisores",
    },
    {
      name: "anio",
      type: "select",
      label: "Año",
      async: true,
      endpoint: "/normativa/yearNormativa",
      key: "anio",
    },
    {
      name: "documento",
      type: "select",
      label: "Tipo de Documento",
      options: [
        { label: "Todos", value: "" },
        { label: "Ordenanza", value: "1" },
        { label: "Resolución", value: "5" },
        { label: "Convenio", value: "3" },
        { label: "Otros", value: "7" },
      ],
    },
  ],

  ListadoNormativaPorAnio: [
    {
      name: "dependencia",
      type: "select",
      label: "Dependencia",
      fromContext: "dependencias",
    },
    {
      name: "anio",
      type: "select",
      label: "Año",
      async: true,
      endpoint: "/normativa/yearNormativa",
      key: "anio",
    },
  ],
  ListadoNormativaEliminadas: [
    {
      name: "numero",
      type: "text",
      label: "Número",
    },
     {
      name:"resumen",
      type:"text",
      label:"Palabras Clave"
    },
    {
      name: "dependencia",
      type: "select",
      label: "Dependencia",
      fromContext: "dependencias",
    },
    {
      name: "emisor",
      type: "select",
      label: "Emisor",
      fromContext: "emisores",
    },
    {
      name: "anio",
      type: "select",
      label: "Año",
      async: true,
      endpoint: "/normativa/yearNormativa",
      key: "anio",
    },
    {
      name: "documento",
      type: "select",
      label: "Tipo de Documento",
      options: [
        { label: "Todos", value: "" },
        { label: "Ordenanza", value: "1" },
        { label: "Otros", value: "7" },
        { label: "Convenio", value: "3" },
        { label: "Resolución", value: "5" },
      ],
    },
  ],

  ListadoNormativaDespublicadas: [
    {
      name: "numero",
      type: "text",
      label: "Número",
    },
     {
      name:"resumen",
      type:"text",
      label:"Palabras Clave"
    },
    {
      name: "dependencia",
      type: "select",
      label: "Dependencia",
      fromContext: "dependencias",
    },
    {
      name: "emisor",
      type: "select",
      label: "Emisor",
      fromContext: "emisores",
    },
    {
      name: "anio",
      type: "select",
      label: "Año",
      async: true,
      endpoint: "/normativa/yearNormativa",
      key: "anio",
    },
    {
      name: "documento",
      type: "select",
      label: "Tipo de Documento",
      options: [
        { label: "Todos", value: "" },
        { label: "Ordenanza", value: "1" },
        { label: "Convenio", value: "3" },
        { label: "Resolución", value: "5" },
        { label: "Otros", value: "7" },
      ],
    },
  ],

  ListadoAuditoria: [
    {
      name: "titulo",
      type: "text",
      label: "Titulo Normativa",
    },
    {
      name: "usuario",
      type: "text",
      label: "Nombre Usuario",
    },
    {
      name: "accion",
      type: "select",
      label: "Accion",
      options: [
        { label: "Alta", value: "alta" },
        { label: "Baja", value: "baja" },
        { label: "Edicion", value: "modificacion" },
        { label: "Republicacion", value: "re-publicacion" },
        { label: "Restauracion", value: "restauracion" },
      ],
    },
    {
      name: "dependencia",
      type: "select",
      label: "Dependencia",
      fromContext: "dependencias",
    },
  ],

  ListadoUsuarios: [
    {
      name: "nombre",
      type: "text",
      label: "Nombre",
    },
    {
      name: "rol",
      type: "select",
      label: "Rol",
      options: [
        { label: "Todos", value: "" },
        { label: "Administrador", value: 2 },
        { label: "SuperAdministrador", value: 1 },
        { label: "Supervisor", value: 4 },
      ],
    },
    {
      name: "estado",
      type: "select",
      label: "Estado",
      options: [
        { label: "Todos", value: "" },
        { label: "Activo", value: "activo" },
        { label: "Inactivo", value: "inactivo" },
      ],
    },
  ],

  ListadoDependencias: [
    {
      name: "nombre",
      type: "text",
      label: "Nombre",
    },
    {
      name: "estado",
      type: "select",
      label: "Estado",
      options: [
        { label: "Publicadas", value: "publicado" },
        { label: "Despublicadas", value: "despublicado" },
      ],
    },
  ],
  ListadoEmisores: [
    {
      name: "estado",
      type: "select",
      label: "Estado",
      options: [
        { label: "publicado", value: "publicado" },
        { label: "despublicado", value: "despublicado" },
      ],
    },
  ],
  ListadoPalabrasClave: [
    {
      name: "nombre",
      type: "text",
      label: "Nombre",
    },
    {
      name: "letra",
      type: "custom",
      label: "Empieza con",
    },
  ],
};

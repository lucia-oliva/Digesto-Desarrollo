export const camposPorEntidad = {
  normativa: [
    { name: "numero", label: "Número", type: "text", },
    { name: "anio", label: "Año", type: "text",  },
    { name: "titulo", label: "Título", type: "text",  },
    {name: "resumen", label: "Resumen", type: "text", },
    {name: "fecha", label: "Fecha de publicación", type: "date"},
    {name:"dependencia", label:"Dependencia", type:"select", options:[
      {label:"Aplicadas", value: 1},
      {label:"Exactas", value: 2},
      {label:"Salud", value: 3},
      {label:"Sociales", value: 4},
      {label:"Humanidades", value: 5}, 
      {label:"Consejo Superior", value: 20},
      {label:"Sede Chepes", value: 22},
      {label:"Sede Villa Unión", value: 26},
      {label:"Sede Chamical", value: 25},
      {label:"Sede Aimogasta", value: 24},
      {label:"Sede Catuna", value: 23},
      {label:"Secretaria de Relaciones Institucionales", value: 27},
    ]},
    {name:"emisor", label:"Emisor", type:"select", 
      options:[
        {label:"Decano", value: 1},
        {label:"Rector", value: 2},
        {label:"Consejo Superior", value: 4},
        {label:"Consejo Directivo", value: 3},
        {label:"Interdepartamental", value: 5},
        {label:"Relaciones Institucionales", value: 11},
      ],},
    {name:"estado", label:"Estado", type:"select", options:["publicado", "despublicado"],},
    {name:"archivo", label:"PDF", type:"file"},
    {name:"tags", label:"Tags", type:"text"},
    
    // etc...
  ],
  usuario: [
    { name: "rol", label: "Rol", type: "select", 
      options:[
        { label: "Administrador de Dependencia", value:2},
        { label: "Supervisor", value:4},
        { label: "SuperAdministrador", value:1},
      ]},
    {name: "dependencia", label: "Dependencia", type: "select", options: [
      {label:"Aplicadas", value: 1},
      {label:"Exactas", value: 2},
      {label:"Salud", value: 3},
      {label:"Sociales", value: 4},
      {label:"Humanidades", value: 5}, 
      {label:"Consejo Superior", value: 20},
      {label:"Sede Chepes", value: 22},
      {label:"Sede Villa Unión", value: 26},
      {label:"Sede Chamical", value: 25},
      {label:"Sede Aimogasta", value: 24},
      {label:"Sede Catuna", value: 23},
      {label:"Secretaria de Relaciones Institucionales", value: 27},
    ]},
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "email", label: "Correo", type: "email", required: true },
    {name: "telefono", label: "Teléfono", type: "number"},
    { name: "password", label: "Contraseña", type: "password", required: true },
  ],

  dependencia: [
    { name: "nombre", label: "Nombre de la dependencia", type: "text", required: true },
    { name: "nombre_completo", label: "Nombre Completo", type: "text" },
    {name: "estado", label: "Estado", type: "select", options: ["publicado", "despublicado"]},
    {name: "codificacion", label: "Codificacion", type: "text"}
  ],
  emisor: [
    { name: "nombre", label: "Nombre del emisor", type: "text", required: true },
    {name: "estado", label: "Estado", type: "text"}
  ],
  palabraclave: [
    { name: "Tag", label: "Nombre de la palabra clave", type: "text", required: true },
  ],
};

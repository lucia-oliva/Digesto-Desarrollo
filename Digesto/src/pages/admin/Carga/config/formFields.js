export const camposPorEntidad = {
  normativa: [
    { name: "numero", label: "Número", type: "text", },
    { name: "anio", label: "Año", type: "text",  },
    { name: "titulo", label: "Título", type: "text",  },
    {name: "resumen", label: "Resumen", type: "text", },
    {name: "fecha", label: "Fecha de publicación", type: "date"},
    {name:"dependencia", label:"Dependencia", type:"select", options:["1", "2"]},
    {name:"emisor", label:"Emisor", type:"select", options:["1", "2"],},
    {name:"estado", label:"Estado", type:"select", options:["publicado", "despublicado"],},
    {name:"archivo", label:"PDF", type:"file"},
    {name:"tags", label:"Tags", type:"text"},
    
    // etc...
  ],
  usuario: [
    { name: "rol", label: "Rol", type: "select", options: ["SuperAdministrador", "Administrador de Dependencia", "Supervisor"]},
    {name: "dependencia", label: "Dependencia", type: "select", options: ["Dependencia 1", "Dependencia 2"]},
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "email", label: "Correo", type: "email", required: true },
    {name: "telefono", label: "Teléfono", type: "number"},
    { name: "password", label: "Contraseña", type: "password", required: true },
  ],

  dependencia: [
    { name: "nombre", label: "Nombre de la dependencia", type: "text", required: true },
    { name: "nombre_completo", label: "Nombre Completo", type: "text" },
    {name: "Estado", label: "Estado", type: "select", options: ["Activo", "Inactivo"]},
    {name: "codificacion", label: "Codificacion", type: "text"}
  ],
  emisor: [
    { name: "nombre", label: "Nombre del emisor", type: "text", required: true },
  ],
  palabraclave: [
    { name: "Tag", label: "Nombre de la palabra clave", type: "text", required: true },
  ],
};

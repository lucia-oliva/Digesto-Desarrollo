export const camposPorEntidad = {
  normativa: [
    { name: "numero", label: "Número", type: "text", required: true },
    { name: "anio", label: "Año", type: "text", required: true },
    { name: "titulo", label: "Título", type: "text", required: true },
    {name: "resumen", label: "Resumen", type: "text", required: false},
    {name: "fecha", label: "Fecha de publicación", type: "date", required: true},
    {name:"dependencia", label:"Dependencia", type:"select", options:["Dependencia 1", "Dependencia 2"], required:true},
    {name:"emisor", label:"Emisor", type:"select", options:["Emisor 1", "Emisor 2"], required:true},
    {name:"estado", label:"Estado", type:"select", options:["Activo", "Inactivo"], required:true},
    {name:"tags", label:"Tags", type:"text", required:false, onkeydown: },
    {name:"archivo", label:"PDF", type:"file", required:true},
    
    // etc...
  ],
  usuario: [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "email", label: "Correo", type: "email", required: true },
    { name: "rol", label: "Rol", type: "select", options: ["admin", "editor"] },
  ],
  dependencia: [
    { name: "nombre", label: "Nombre de la dependencia", type: "text", required: true },
  ],
  emisor: [
    { name: "nombre", label: "Nombre del emisor", type: "text", required: true },
  ],
  palabraclave: [
    { name: "nombre", label: "Nombre del tag", type: "text", required: true },
  ],
};

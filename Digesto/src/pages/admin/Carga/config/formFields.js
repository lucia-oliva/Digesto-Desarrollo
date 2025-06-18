export const camposPorEntidad = {
  normativa: [
    { name: "numero", label: "Número", type: "text", required: true },
    { name: "anio", label: "Año", type: "text", required: true },
    { name: "titulo", label: "Título", type: "text", required: true },
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

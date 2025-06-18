export const formFieldsConfig = {
  normativas: [
    { name: "titulo", label: "Título", type: "text", required: true },
    { name: "numero", label: "Número", type: "number", required: true },
    { name: "anio", label: "Año", type: "number" },
    { name: "resumen", label: "Resumen", type: "textarea" },
    { name: "fecha", label: "Fecha", type: "date" },
    { name: "dependencia", label: "Dependencia", type: "select", options: ["Aplicadas", "Exactas", "Humanas"] },
    { name: "emisor", label: "Emisor", type: "select", options: ["Decano", "Consejo Superior"] },
    { name: "estado", label: "Estado", type: "select", options: ["publicado", "despublicado"] },
    { name: "archivo_pdf", label: "Archivo PDF", type: "file" },
    { name: "palabras_clave", label: "Palabras Clave", type: "tags" },
  ],
  usuarios: [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "rol", label: "Rol", type: "select", options: ["admin", "editor", "lector"], required: true },
  ],
  // más entidades...
};

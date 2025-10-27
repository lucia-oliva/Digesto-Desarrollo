export const camposPorEntidad = {
  normativa: [
    { name: "numero", label: "Número", type: "number", required: true },
    { name: "anio", label: "Año", type: "number", required: true },
    { name: "titulo", label: "Título", type: "text", required: true },
    { name: "resumen", label: "Resumen", type: "textarea", required: true },
    {
      name: "fecha",
      label: "Fecha de publicación",
      type: "date",
      required: true,
    },
    {
      name: "dependencia",
      label: "Dependencia",
      type: "select",
      required: true,
      fromContext: "dependencia", 
    },
    {
      name: "emisor",
      label: "Emisor",
      type: "select",
      required: true,
      fromContext: "emisor",
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: ["publicado", "despublicado"],
    },
    { name: "archivo", label: "PDF", type: "file" },
    { name: "tags", label: "Tags", type: "text" },

  ],
  usuario: [
    {
      name: "rol",
      label: "Rol",
      type: "select",
      required: true,
      options: [
        { label: "Administrador de Dependencia", value: 2 },
        { label: "Supervisor", value: 4 },
        { label: "SuperAdministrador", value: 1 },
      ],
    },
    {
      name: "dependencia",
      label: "Dependencia",
      type: "select",
      required: true,
      fromContext: "dependencia",
    },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    {
      name: "email",
      label: "Correo",
      type: "email",
      required: true,
      autoComplete: "email",
    },
    { name: "telefono", label: "Teléfono", type: "number" },
    { name: "password", label: "Contraseña", type: "password", required: true },
    {
      name: "confirmPassword",
      label: "Confirmar Contraseña",
      type: "password",
      required: true,
    },
  ],

  dependencia: [
    {
      name: "nombre",
      label: "Nombre de la dependencia",
      type: "text",
      required: true,
    },
    { name: "nombre_completo", label: "Nombre Completo", type: "text" },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: ["publicado", "despublicado"],
    },
    { name: "codificacion", label: "Codificacion", type: "text" },
  ],
  emisor: [
    {
      name: "nombre",
      label: "Nombre del emisor",
      type: "text",
      required: true,
    },
    { name: "estado", label: "Estado", type: "select", options: ["publicado", "despublicado"] },
  ],
  palabraclave: [
    {
      name: "Tag",
      label: "Nombre de la palabra clave",
      type: "text",
      required: true,
    },
  ],
};

export const menuItems = [
  {
    title: "Normativas",
    children: [
      { name: "Nueva Normativa", path: "./NuevaNormativa" },
      { name: "Listado", path: "./ListadoNormativa" },
      { name: "Normativas Eliminadas", path: "./ListadoNormativa?filter=deleted" },
      { name: "Normativas Despublicadas", path: "./ListadoNormativa?filter=unpublish" },
    ],
  },
  {
    title: "Usuarios",
    children: [
      { name: "Crear Usuario", path: "./NuevoUsuario" },
      { name: "Listado Usuarios", path: "./ListadoUsuarios" },
    ],
  },
  {
    title: "Dependencias",
    children: [
      { name: "Agregar Dependencia", path: "./NuevaDependencia" },
      { name: "Listado Dependencias", path: "./ListadoDependencias" },
    ],
  },
  {
    title: "Emisores",
    children: [
      { name: "Agregar Emisor", path: "./NuevoEmisor" },
      { name: "Listado Emisores", path: "./ListadoEmisores" },
    ],
  },
  {
    title: "Auditoria",
    children: [
      { name: "Usuarios: Ingresos/Egresos", path: "./AuditoriaUsuariosIngresosEgresos" },
      { name: "Usuarios:Visitas", path: "./AuditoriaUsuariosVisitas" },
      { name: "Normativas", path: "./AuditoriaNormativas" },
    ],
  },
  {
    title: "Palabras Clave",
    children: [
      { name: "Nueva Palabra", path: "./NuevaPalabraClave" },
      { name: "Listado Palabras", path: "./ListadoPalabrasClave" },
    ],
  },

  // Elementos especiales sin hijos
  { title: "Visitas", path: "./Visitas" },
  { title: "Consejo Superior", path: "./ConsejoSuperior" },
  { title: "Salir", path: "./logout" },
];

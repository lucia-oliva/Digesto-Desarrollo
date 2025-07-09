import { FaAdn, FaBuilding, FaBuildingColumns, FaFileLines, FaHammer, FaUser, FaUserGroup, FaUserMinus, FaUsersLine } from "react-icons/fa6";

export const menuItems = [
  {
    title: "Normativas",
    icon: <FaFileLines className="text-2xl" />,
    children: [
      { name: "Nueva Normativa", path: "./NuevaNormativa", },
      { name: "Listado", path: "./ListadoNormativa" },
      { name: "Normativas Eliminadas", path: "./ListadoNormativa?filter=deleted" },
      { name: "Normativas Despublicadas", path: "./ListadoNormativa?filter=unpublish" },
    ],
  },
  {
    title: "Usuarios",
    icon: <FaUserGroup className="text-2xl" />,
    children: [
      { name: "Crear Usuario", path: "./NuevoUsuario" },
      { name: "Listado Usuarios", path: "./ListadoUsuarios" },
    ],
  },
  {
    title: "Dependencias",
    icon : <FaBuilding className="text-2xl" />,
    children: [
      { name: "Agregar Dependencia", path: "./NuevaDependencia" },
      { name: "Listado Dependencias", path: "./ListadoDependencias" },
    ],
  },
  {
    title: "Emisores",
    icon: <FaUser className="text-2xl" />,
    children: [
      { name: "Agregar Emisor", path: "./NuevoEmisor" },
      { name: "Listado Emisores", path: "./ListadoEmisores" },
    ],
  },
  {
    title: "Auditoria",
    icon: <FaHammer className="text-2xl" />,
    children: [
      { name: "Usuarios: Ingresos/Egresos", path: "./AuditoriaUsuariosIngresosEgresos" },
      { name: "Usuarios:Visitas", path: "./AuditoriaUsuariosVisitas" },
      { name: "Normativas", path: "./AuditoriaNormativas" },
    ],
  },
  {
    title: "Palabras Clave",
    icon: <FaAdn className="text-2xl" />,
    children: [
      { name: "Nueva Palabra", path: "./NuevaPalabraClave" },
      { name: "Listado Palabras", path: "./ListadoPalabrasClave" },
    ],
  },

  // Elementos especiales sin hijos
  { title: "Consejo Superior", path: "./ConsejoSuperior", icon: <FaBuildingColumns className="text-2xl" /> },
  { title: "Salir", path: "./logout", icon: <FaUserMinus className="text-2xl" /> },
];

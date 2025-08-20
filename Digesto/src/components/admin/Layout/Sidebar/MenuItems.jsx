import {
  FaAdn,
  FaBuilding,
  FaBuildingColumns,
  FaFileLines,
  FaHammer,
  FaUser,
  FaUserGroup,
  FaUserMinus,
  FaUsersLine,
  FaTags
} from "react-icons/fa6";


export const menuItems = [
  {
    title: "Normativas",
    icon: <FaFileLines className="text-lg" />,
    children: [
      { name: "Nueva Normativa", path: "./NuevaNormativa" },
      { name: "Listado", path: "./ListadoNormativa" },
      {
        name: "Normativas Eliminadas",
        path: "./ListadoNormativaEliminadas",
      },
      {
        name: "Normativas Despublicadas",
        path: "./ListadoNormativaDespublicadas",
      },
    ],
    roles: ["SuperAdministrador", "Supervisor", "administradordependencia"],
  },
  {
    title: "Usuarios",
    icon: <FaUserGroup className="text-lg" />,
    children: [
      { name: "Crear Usuario", path: "./NuevoUsuario" },
      { name: "Listado Usuarios", path: "./ListadoUsuarios" },
    ],
    roles: ["SuperAdministrador"],
  },
  {
    title: "Dependencias",
    icon: <FaBuilding className="text-lg" />,
    children: [
      { name: "Agregar Dependencia", path: "./NuevaDependencia" },
      { name: "Listado Dependencias", path: "./ListadoDependencias" },
    ],
    roles: ["SuperAdministrador", "supervisor"],
  },
  {
    title: "Emisores",
    icon: <FaUser className="text-lg" />,
    children: [
      { name: "Agregar Emisor", path: "./NuevoEmisor" },
      { name: "Listado Emisores", path: "./ListadoEmisores" },
    ],
    roles: ["SuperAdministrador"],
  },
  {
    title: "Auditoria",
    icon: <FaHammer className="text-lg" />,
    children: [
    
      { name: "Normativas", path: "./ListadoAuditoria" },
    ],
    roles: ["SuperAdministrador"],
  },
  {
    title: "Palabras Clave",
    icon: <FaTags className="text-lg" />, 
    children: [
      { name: "Nueva Palabra", path: "./NuevaPalabraClave" },
      { name: "Listado Palabras", path: "./ListadoPalabrasClave" },
    ],
    roles: ["SuperAdministrador", "supervisor", "administradordependencia"],
  },

  // Elementos especiales sin hijos
  {
    title: "Consejo Superior",
    path: "../consejo-superior",
    icon: <FaBuildingColumns className="text-2lg" />,
    roles: ["SuperAdministrador", "Supervisor", "administradordependencia"],
  },
];

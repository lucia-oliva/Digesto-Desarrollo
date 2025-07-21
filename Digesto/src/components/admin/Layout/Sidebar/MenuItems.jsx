import { FaAdn, FaBuilding, FaBuildingColumns, FaFileLines, FaHammer, FaUser, FaUserGroup, FaUserMinus, FaUsersLine } from "react-icons/fa6";

export const menuItems = [
  {
    title: "Normativas",
    icon: <FaFileLines className="text-lg" />,
    children: [
      { name: "Nueva Normativa", path: "./NuevaNormativa", },
      { name: "Listado", path: "./ListadoNormativa" },
      { name: "Normativas Eliminadas", path: "./ListadoNormativa?filter=deleted" },
      { name: "Normativas Despublicadas", path: "./ListadoNormativa?filter=unpublish" },
    ],
  },
  {
    title: "Usuarios",
    icon: <FaUserGroup className="text-lg" />,
    children: [
      { name: "Crear Usuario", path: "./NuevoUsuario" },
      { name: "Listado Usuarios", path: "./ListadoUsuarios" },
    ],
  },
  {
    title: "Dependencias",
    icon : <FaBuilding className="text-lg" />,
    children: [
      { name: "Agregar Dependencia", path: "./NuevaDependencia" },
      { name: "Listado Dependencias", path: "./ListadoDependencias" },
    ],
  },
  {
    title: "Emisores",
    icon: <FaUser className="text-lg" />,
    children: [
      { name: "Agregar Emisor", path: "./NuevoEmisor" },
      { name: "Listado Emisores", path: "./ListadoEmisores" },
    ],
  },
  {
    title: "Auditoria",
    icon: <FaHammer className="text-lg" />,
    children: [
      { name: "Normativas", path: "./ListadoAuditoria" },
    ],
  },
  {
    title: "Palabras Clave",
    icon: <FaAdn className="text-lg" />,
    children: [
      { name: "Nueva Palabra", path: "./NuevaPalabraClave" },
      { name: "Listado Palabras", path: "./ListadoPalabrasClave" },
    ],
  },

  // Elementos especiales sin hijos
  { title: "Consejo Superior", path: "./ConsejoSuperior", icon: <FaBuildingColumns className="text-2lg" /> },
];

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const [activeItem, setActiveItem] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (title) => {
    setOpenMenu((prev) => (prev === title ? null : title));
    setActiveItem(title);
  };

  const handleSubItemClick = (subitem) => {
    setActiveItem(subitem);
    navigate(`/administracion?option=${subitem}`); // Usa la ruta correcta
  };

  const menuItems = [
    {
      title: "Normativas",
      children: ["Nueva Normativa", "Listado", "Normativas Eliminadas"],
    },
    {
      title: "Usuarios",
      children: ["Crear Usuario", "Listado Usuarios"],
    },
    {
      title: "Dependencias",
      children: ["Agregar Dependencia", "Listado Dependencias"],
    },
    {
      title: "Emisores",
      children: ["Agregar Emisor", "Listado Emisores"],
    },
    {
      title: "Auditoria",
      children: [
        "Usuarios: Ingresos/Egresos",
        "Usuarios:Visitas",
        "Normativas",
      ],
    },
    {
      title: "Palabras Clave",
      children: ["Nueva Palabra", "Listado Palabras"],
    },
    {
      title: "Visitas",
    },
    {
      title: "Consejo Superior",
    },
    {
      title: "Salir",
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar fijo */}
      <div className="fixed top-0 left-0 h-screen w-50 bg-primary text-white p-4 z-50 pt-20 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <button
                id="button-sidebar"
                onClick={() => handleToggle(item.title)}
                className={`w-full text-left font-sans px-3 py-2 rounded hover:bg-primary/70 transition ${
                  activeItem === item.title ? "bg-primary/60 font-semibold" : ""
                }`}
              >
                {item.title}
              </button>

              {/* Subitems: vertical desplegable */}
              {item.children && openMenu === item.title && (
                <ul className="ml-4 mt-1 space-y-1">
                  {item.children.map((subitem) => (
                    <li key={subitem}>
                      <button
                        id="button-sidebar-children"
                        onClick={() => handleSubItemClick(subitem)} // Pasa el subitem como argumento
                        className={`w-full font-sans text-left px-4 py-1 text-sm rounded transition
            ${
              activeItem === subitem
                ? "bg-base-100 text-primary font-semibold"
                : "hover:bg-base-100 hover:text-primary"
            }`}
                      >
                        {subitem}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido principal desplazado */}
      <div className="ml-60 flex-1 pt-6 px-6">
        <h1 className="text-2xl font-bold">Perfil Administrador</h1>
        <p className="text-primary">{activeItem || ""}</p>
      </div>
    </div>
  );
}

export default SideBar;

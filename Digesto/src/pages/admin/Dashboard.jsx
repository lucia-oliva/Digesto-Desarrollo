import { useAuth } from "../../context/useAuth";
import StatCard from "../../components/layout/StatCard"
import { FaAdn, FaBuilding,FaFileLines, FaUser, FaUserGroup } from "react-icons/fa6";;
import axios from "axios";
import { useEffect, useState } from "react";




function Dashboard() {

  const [totales, setTotales] = useState({
  normativas: 0,
  usuarios: 0,
  dependencias: 0,
  palabras_clave: 0,
  emisores: 0
});

 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/dashboard/resumen", {
        withCredentials: true,
      });
      console.log("Datos reales:", res.data);
      setTotales(res.data);
    } catch (err) {
      console.error("Error al obtener totales del dashboard", err);
    }
  };

  fetchData();
}, []);



  const { auth } = useAuth();
  const user = auth.user;

  if (auth.loading) {
    return <div className="text-gray-600 text-center p-8">Cargando...</div>;
  }

  const stats = [
    {
      title: "Normativas",
      description: "Gestioná, creá o editá las normativas vigentes.",
      value: totales.normativas,
      iconFront: <FaFileLines className="text-6xl" />,
      iconBg: <FaFileLines className="mb-3"/>,
      color: "bg-blue-600",
      toList: "/admin/ListadoNormativa",
      toCreate: "/admin/NuevaNormativa",
      textList: "Ver Normativas",
      textCreate: "Crear Normativa",
    },
    {
      title: "Usuarios",
      description: "Administrá cuentas, roles y permisos del sistema.",
      value: totales.usuarios,
      iconFront: <FaUserGroup className="text-6xl" />,
      iconBg: <FaUserGroup />,
      color: "bg-slate-600",
      toList: "/admin/ListadoUsuarios",
      toCreate: "/admin/NuevoUsuario",
      textList: "Ver Usuarios",
      textCreate: "Crear Usuario",
    },
    {
      title: "Dependencias",
      description: "Organizá las áreas y estructuras administrativas.",
      value: totales.dependencias,
      iconFront:<FaBuilding className="text-6xl" />,
      iconBg: <FaBuilding className="mb-2"/>,
      color: "bg-blue-900",
      toList: "/admin/ListadoDependencias",
      toCreate: "/admin/NuevaDependencia",
      textList: "Ver Dependencias",
      textCreate: "Crear Dependencia",
    },
    {
      title: "Palabras Clave",
      description: "Mantené actualizadas las etiquetas del sistema.",
      value: totales.palabras_clave,
      iconFront: <FaAdn className="text-6xl" />,
      iconBg: <FaAdn className="mb-2"/>,
      color: "bg-gray-700",
      toList: "/admin/ListadoPalabrasClave",
      toCreate: "/admin/NuevaPalabraClave",
      textList: "Ver Palabras",
      textCreate: "Crear Palabra",
    },
    {
      title: "Emisores",
      description: "Definí y controlá quién emite cada normativa.",
      value: totales.emisores,
      iconFront: <FaUser className="text-6xl" />,
      iconBg: <FaUser className="mb-2"/>,
      color: "bg-sky-700",
      toList: "/admin/ListadoEmisores",
      toCreate: "/admin/NuevoEmisor",
      textList: "Ver Emisores",
      textCreate: "Crear Emisor",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-gray-800 p-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between mb-10">
        <div className="mb-6 md:mb-0 md:mr-6 max-w-xl">
          <h1 className="text-2xl font-bold mb-2">Hola, {user.nombre} 👋</h1>
          <p className="text-gray-600 text-sm mb-2">
            Bienvenido al panel de administración del sistema Digesto. Desde aquí podés
            gestionar normativas, usuarios y otras entidades clave.
          </p>
          <p className="text-gray-500 text-sm">
            Utilizá los accesos directos a continuación para navegar por las secciones disponibles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            description={item.description}
            iconFront={item.iconFront}
            iconBg={item.iconBg}
            color={item.color}
            toList={item.toList}
            toCreate={item.toCreate}
            textList={item.textList}
            textCreate={item.textCreate}
          />
        ))}
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500 max-w-xl mx-auto">
        Sistema desarrollado para la Universidad Nacional de La Rioja. Para soporte técnico, comunicate con el área correspondiente.
        <div className="mt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Sistema Digesto UNLaR
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;

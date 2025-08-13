import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import useAxios from "axios-hooks";
import { useNavigate } from "react-router";

import Dependencias from "../components/Listas/Dependencias";
import GenericTable from "../components/Table/GenericTable";
import { adminConfig } from "../components/Table/configTable";
import { Alert, Loading } from "../components/ui/Ui";

function Home() {
  const navigate = useNavigate();
  const [normativas, setNormativas] = useState([]);

  // 🚀 Normativas más consultadas
  const [{ data, loading, error }] = useAxios({
    url: "http://localhost:3000/api/normativa/mas-buscadas",
    method: "GET",
  });

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setNormativas(data);
    }
  }, [data]);

  // 📋 Columnas base de normativas desde tu config
  const columnsBase = adminConfig["ListadoNormativa"]?.columns ?? [];

  // 🧱 Modo "inicio": ocultar número y emisor
  const hideKeys = ["resumen"];
  const columnsInicio = columnsBase.filter((c) => !hideKeys.includes(c.key));

  // 🔘 Acción "Ver PDF" con outline y hover azul
  const actions = [
    {
      label: "Ver PDF",
      type: "primary",
      className: "btn-outline btn-primary",
      onClick: (item) => navigate(`/document/${item.id}`),
    },
  ];

  return (
    <div>
      {/* Hero section */}
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://www.unlar.edu.ar/images/fotos-noticias/Enero2025/UNLaR.jpg)",
        }}
      >
        <div className="hero-overlay bg-gradient-to-b to-95% from-transparent to-[rgba(0,0,0,0.4s)] "></div>
        <div className="hero-content text-center flex items-start py-25">
          <div className="w-full lg:w-2/3 px-4">
            <h1 className="mb-4 text-5xl font-sans font-semibold text-base-100">
              Bienvenido a Digesto UNLaR
            </h1>
            <p className=" mb-4 text-xl font-sans font-light text-base-100">
              La plataforma que sirve como espacio digital para consultar las
              normativas y toda documentación emitida por todas las dependencias
              de la Universidad Nacional de La Rioja.
            </p>
            <a
              className="btn bg-primary border-slate-800 text-base-200 shadow-none hover:bg-primary hover:border-primary"
              href="/busqueda"
            >
              Búsqueda Avanzada <IoMdSearch size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-10 items-center mx-auto py-10 px-12 bg-base-100">
        {/* Dependencias */}
        <Dependencias dependencias={[]} />

        {/* Normativas más consultadas */}
        <div className="text-center border-b pb-4 mb-4 mt-10">
          <h2 className="text-xl font-bold">Normativas más consultadas</h2>
        </div>

        {/* 🔄 Tabla genérica sin paginación (no pasamos totalPages) */}
        <GenericTable
          data={normativas}
          columns={columnsInicio}
          actions={actions}
        />

        {loading && <Loading />}
        {error && (
          <Alert
            title="Error al obtener las normativas más consultadas"
            message={error?.message}
            error={!error}
          />
        )}
      </section>
    </div>
  );
}

export default Home;

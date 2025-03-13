import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import useAxios from "axios-hooks";
import Dependencias from "../components/Listas/Dependencias";
import Table from "../components/layout/Table";

function Home() {
  const [normativas, setNormativas] = useState([]);

  // Se obtienen las normativas mas buscadas*/
  const [{ data, error }] = useAxios(
    "http://localhost:3000/api/normativa/normativasMasBuscadas"
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setNormativas(data);
      console.log(data);
    }
    if (error) {
      console.error("Error al obtener las normativas mas buscadas", error);
    }
  }, [data, error]);

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
              normativas y toda documentacion emitada por todas las dependencias
              de la Universidad Nacional de La Rioja.
            </p>
            <button
              className="btn bg-blue-600
                border-slate-800 text-base-200 shadow-none 
                hover:bg-primary hover:border-primary"
            >
              Busqueda Avanzada <IoMdSearch size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      <section className="container mx-auto py-10 px-12 bg-base-100">
        {/* Section de Dependencias */}
        {/* TODO si trae las dependencias del back actualizar los parametros */}

        <Dependencias dependencias={[]} />

        {/* Section de Normativas mas buscadas */}
        <Table normativas={normativas}/>
      </section>
    </div>
  );
}

export default Home;

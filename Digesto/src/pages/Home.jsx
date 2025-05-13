import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import useAxios from "axios-hooks";
import Dependencias from "../components/Listas/Dependencias";
import Table from "../components/layout/Table";
import { Alert, Loading } from "../components/ui/Ui";

function Home() {
  const [normativas, setNormativas] = useState([]);

  // Se obtienen las normativas mas buscadas*/
  const [{ data, loading, error }] = useAxios(
    {
      url: "http://localhost:3000/api/normativa/mas-buscadas",
      method: "GET",
    }
  )

  useEffect(() => {
    if (data && data.length > 0) {
      setNormativas(data);
      console.log(data);
    }
    if (error) {
      console.error(
        "Error al obtener las normativas mas buscadas",
        error.message
      );
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
            <a
              className="btn bg-primary
                border-slate-800 text-base-200 shadow-none 
                hover:bg-primary hover:border-primary"
              href="/busqueda"
            >
              Busqueda Avanzada <IoMdSearch size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
      <section className="flex flex-col gap-10 items-center mx-auto py-10 px-12 bg-base-100">
        {/* Section de Dependencias */}

        <Dependencias dependencias={[]} />

        {/* Section de Normativas mas buscadas */}
        <div className=" text-center border-b pb-4 mb-4 mt-10">
        <h2 className="text-xl font-bold">Normativas mas consultadas</h2>
        </div>
        <Table normativas={normativas} />

        {loading && <Loading />}
        {error && (
          <Alert
            title="Error al obtener las dependencias"
            message={error?.message}
            error={!error}
          />
        )}
      </section>
    </div>
  );
}

export default Home;

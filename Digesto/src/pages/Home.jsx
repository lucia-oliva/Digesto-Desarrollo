import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import useAxios from "axios-hooks";

import NormativaTable from "../components/Table/NormativasTable";
import Dependencias from "../components/Listas/Dependencias";
import { Alert, Loading } from "../components/ui/Ui";

function Home() {
  const [normativas, setNormativas] = useState([]);

  const [{ data, loading, error }] = useAxios({
    url: "http://localhost:3000/api/normativa/mas-buscadas",
    method: "GET",
  });

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setNormativas(data);
    }
  }, [data]);


  return (
     <div className="overflow-x-hidden">
      {/* Hero section */}
      <div
   className="hero min-h-screen bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://www.unlar.edu.ar/images/fotos-noticias/Enero2025/UNLaR.jpg)",
        }}
      >
        <div className="hero-overlay bg-black/40"></div>
   <div className="hero-content text-center flex items-start py-24">

          <div className="w-full lg:w-2/3 px-2 sm:px-4 mx-auto">
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



       <div className="w-full overflow-x-auto">
        <div className="text-center border-b pb-4 mb-4 mt-10 w-full">
  <h2 className="text-xl font-bold">Normativas más consultadas</h2>
</div>
        <NormativaTable
          type="ListadoNormativa"
          modo="inicio"
          data={normativas} 
          hidePagination      
        />
      </div>

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

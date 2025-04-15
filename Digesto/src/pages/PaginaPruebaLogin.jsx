import SideBar from "../components/layout/SideBar";
import Table from "../components/layout/Table";
import { useEffect, useState } from "react";
import { Alert, Loading } from "../components/ui/Ui";
import useAxios from "axios-hooks";
import Pagination from "../components/layout/Pagination.jsx";
import { useLocation } from "react-router-dom";
import Carga from "../components/layout/Carga.jsx";

function PaginaPruebaLogin() {
  const [normativas, setNormativas] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // Decodifica el valor del parámetro 'option'
  const selectedOption = decodeURIComponent(params.get("option"));

  const [{ data, loading, error }] = useAxios({
    url: "http://localhost:3000/api/normativa/mas-buscadas",
    method: "GET",
  });

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

  const components = {
    "Nueva Normativa": <Carga/>,
    Listado: <Table />,
  };

  const ComponentToRender = components[selectedOption] || <Table />; // Muestra Table por defecto

  return (
    <>
      <SideBar />
      <div className=" ml-50 min-h-screen p-6">
        {ComponentToRender}
        {loading && <Loading />}
        {error && (
          <Alert
            title="Error al obtener las dependencias"
            message={error?.message}
            error={!error}
          />
        )}
      </div>
    </>
  );
}

export default PaginaPruebaLogin;

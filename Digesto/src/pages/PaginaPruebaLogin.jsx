import SideBar from "../components/layout/SideBar"; 
import Table from "../components/layout/Table";
import { useEffect, useState } from "react";
import { Alert, Loading } from "../components/ui/Ui";
import useAxios from "axios-hooks";
import Pagination from "../components/layout/Pagination.jsx";

function PaginaPruebaLogin() {
  const [normativas, setNormativas] = useState([]);

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
      console.error("Error al obtener las normativas mas buscadas", error.message);
    }
  }, [data, error]);

  return (
    <>
      <SideBar />
      <div className=" ml-50 min-h-screen p-6">
        <Table normativas={normativas} />
        {loading && <Loading />}
        {error && (
          <Alert
            title="Error al obtener las dependencias"
            message={error?.message}
            error={!error}
          />
        )}
        <Pagination />
      </div>
    </>
  );
}

export default PaginaPruebaLogin;

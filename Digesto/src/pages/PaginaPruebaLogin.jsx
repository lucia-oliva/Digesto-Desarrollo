import SideBar from "../components/layout/SideBar";
import Table from "../components/layout/Table";
import { useLocation } from "react-router-dom";
import Carga from "../components/layout/Carga.jsx";
import NormativasContainer from "../pages/Prueba.jsx";

function PaginaPruebaLogin() {
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedOption = params.get("option") || "";
  const enAdministracion = location.pathname === "/administracion";

  let ComponentToRender = <Table />;
  if (enAdministracion && selectedOption === "Nueva Normativa") {
    ComponentToRender = <Carga />;
  } else if (enAdministracion) {
    // Si estoy en administracion pero no es "Nueva Normativa", muestro siempre listado
    ComponentToRender = <NormativasContainer isAdmin={true} />;
  }
  
  return (
    <>
      <SideBar />
      <div className=" ml-50 min-h-screen p-6">
        {ComponentToRender}
      </div>
    </>
  );
}

export default PaginaPruebaLogin;

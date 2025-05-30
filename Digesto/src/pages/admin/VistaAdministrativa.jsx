import NormativaTable from "../../components/Table/NormativasTable";
import { useLocation } from "react-router";

function VistaAdministrativa() {
  const location = useLocation();
  const type = location.pathname.split("/")[2];

  return (
    <div className="container ">
      <NormativaTable type={type} />
    </div>
  );
}

export { VistaAdministrativa };

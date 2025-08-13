import NormativaTable from "../../components/Table/NormativasTable";
import { useLocation } from "react-router";
import GenericFilterSearch from  "../../components/SearchFilter/SearchFilter";
import { useState } from "react";

function VistaAdministrativa() {
  const location = useLocation();
  const type = location.pathname.split("/")[2];
  const [filters, setFilters] = useState({});

  const handleSearch = (formData) => {
    setFilters(formData); // esto se pasa como prop a NormativasTable
  };

  const modo = "admin";

  return (
    <div className="container ">
      <GenericFilterSearch type={type} onSearch={handleSearch} />
      <NormativaTable type={type} filtros={filters} modo={modo}/>
    </div>
  );
}

export { VistaAdministrativa };

import { useState } from "react";
import SearchBar from "../../components/layout/SearchBar";
import NormativaTable from "../../components/Table/NormativasTable";

function ConsejoNormativas() {

  const [tags, setTags] = useState("");  
  const filtros = { dependencia: "20", tags };

  return (
    <div className="m-5">
      <div className="flex flex-wrap justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-lg font-bold text-gray-700">
          Normativas del Consejo Superior
        </h2>
        <SearchBar onSearch={(selectedTags) => setTags(selectedTags || "")} />
      </div>

      <NormativaTable type="ListadoNormativa" filtros={filtros} modo="ver" />
    </div>
  );
}

export default ConsejoNormativas;

import { useState } from "react";
import SearchBar from "../../components/layout/SearchBar";
import NormativaTable from "../../components/Table/NormativasTable";

function ConsejoNormativas() {

  const [tags, setTags] = useState("");  
  const filtros = { dependencia: "20", tags };

 return (
    // IMPORTANTE: nada de overflow-x-hidden aca
    <div className="pt-20 overflow-x-visible">
      {/* Header */}
      <div className="px-4 md:px-6 xl:px-8">
        <div className="flex flex-wrap gap-3 justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-bold text-gray-700">
            Normativas del Consejo Superior
          </h2>
          <div className="w-full sm:w-auto">
            <SearchBar onSearch={(selectedTags) => setTags(selectedTags || "")} />
          </div>
        </div>
      </div>

      {/* Tabla: contenedor con gutter y scroll controlado */}
      <div className="px-2 md:px-4 xl:px-6">
        <div className="overflow-x-auto px-px"> 
          {/* px-px evita el “corte” visual de bordes en los extremos */}
          <NormativaTable type="ListadoNormativa" filtros={filtros} modo="consejo" />
        </div>
      </div>
    </div>
  );
}
export default ConsejoNormativas;

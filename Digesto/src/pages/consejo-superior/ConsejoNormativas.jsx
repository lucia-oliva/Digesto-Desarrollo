import { useState } from "react";
import NormativaTable from "../../components/Table/NormativasTable";

function ConsejoNormativas() {
  const [tags, setTags] = useState("");
  const filtros = { dependencia: "20", tags };

  return (
    <div className="pt-20 overflow-x-visible">
      <div className="px-4 md:px-6 xl:px-8">
        <div className="flex flex-col gap-4 justify-between items-start border-b pb-2 mb-2">
          
          <h2 className="text-lg font-bold text-gray-700">
            Normativas del Consejo Superior
          </h2>
        </div>
      </div>
      <div className="px-2 md:px-4 xl:px-6">
        <div className="overflow-x-auto px-px">
          <NormativaTable
            type="ListadoNormativa"
            filtros={filtros}
            modo="consejo"
          />
        </div>
      </div>
    </div>
  );
}
export default ConsejoNormativas;

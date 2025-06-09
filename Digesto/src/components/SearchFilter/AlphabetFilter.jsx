import React from "react";

const AbecedarioFiltro = ({ selectedLetter, onSelect }) => {
  const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="join flex flex-wrap gap-1">
    {/* Botón para "símbolos" u "otros caracteres" */}
      <button
        className={`join-item btn btn-xs ${
          selectedLetter === "#" ? "bg-primary text-white" : ""
        }`}
        onClick={() => onSelect("#")}
      >
        #
      </button>
      {abecedario.map((letra) => (
        <button
          key={letra}
          className={`join-item btn btn-xs ${
            selectedLetter === letra ? "bg-primary text-white" : ""
          }`}
          onClick={() => onSelect(letra)}
        >
          {letra}
        </button>
      ))}
    </div>
  );
};

export default AbecedarioFiltro;

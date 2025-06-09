import React from "react";

const AbecedarioFiltro = ({ selectedLetter, onSelect }) => {
  const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="join flex flex-wrap gap-1">
      {abecedario.map((letra) => (
        <button
          key={letra}
          className={`join-item btn btn-xs ${
            selectedLetter === letra ? "btn-active" : ""
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

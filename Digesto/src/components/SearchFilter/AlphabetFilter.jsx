import React from "react";

const AbecedarioFiltro = ({ value = "", onSelect }) => {
  const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const isActive = (ch) => value === ch;

  return (
    <div className="join flex flex-wrap gap-1">
      {/* Limpiar */}
      <button
        type="button"
        className={`join-item btn btn-xs ${value === "" ? "btn-primary" : "btn-outline"}`}
        onClick={() => onSelect("")}
        aria-pressed={value === ""}
      >
        Todos
      </button>

      {/* Símbolos / otros */}
      <button
        type="button"
        className={`join-item btn btn-xs ${isActive("#") ? "btn-primary" : "btn-outline"}`}
        onClick={() => onSelect(isActive("#") ? "" : "#")}
        aria-pressed={isActive("#")}
      >
        #
      </button>

      {abecedario.map((letra) => (
        <button
          type="button"
          key={letra}
          className={`join-item btn btn-xs ${isActive(letra) ? "btn-primary" : "btn-outline"}`}
          onClick={() => onSelect(isActive(letra) ? "" : letra)}
          aria-pressed={isActive(letra)}
        >
          {letra}
        </button>
      ))}
    </div>
  );
};

export default AbecedarioFiltro;

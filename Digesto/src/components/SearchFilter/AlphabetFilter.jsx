// src/components/SearchFilter/AlphabetFilter.jsx
import PropTypes from "prop-types";

export default function AlphabetFilter({ value = "", onChange = () => {} }) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <div className="flex flex-wrap gap-2">
      {letras.map((l) => (
        <button
          key={l}
          type="button"
          className={`btn btn-sm ${
            value === l ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => onChange(l === value ? "" : l)}
        >
          {l}
        </button>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        onClick={() => onChange("")}
        title="Limpiar letra"
      >
        Limpiar
      </button>
    </div>
  );
}

AlphabetFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

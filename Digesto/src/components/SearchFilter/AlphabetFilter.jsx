// src/components/SearchFilter/AlphabetFilter.jsx
export default function AlphabetFilter({ value = "", onChange = () => {} }) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <div className="flex flex-wrap gap-1">
      {letras.map((l) => (
        <button
          key={l}
          type="button"
          className={` join-item btn btn-xs ${
            value === l ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => onChange(l === value ? "" : l)}
        >
          {l}
        </button>
      ))}
      <button
        type="button"
        className="btn btn-xs btn-primary"
        onClick={() => onChange("")}
        title="Limpiar letra"
      >
        Limpiar
      </button>
    </div>
  );
}

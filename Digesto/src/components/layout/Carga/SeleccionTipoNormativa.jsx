
const tipos = [
  "Acta",
  "Resolución",
  "Convenio",
  "Nota",
  "Providencia",
  "Ordenanza",
];

function SeleccionTipoNormativa({ tipoActual, onSelect }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Seleccione el tipo de normativa a cargar:
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {tipos.map((tipo) => (
          <button
            key={tipo}
            onClick={() => onSelect(tipo)}
            className={`card p-4 border rounded-md text-center cursor-pointer hover:bg-primary hover:text-white transition ${
              tipoActual === tipo ? "bg-primary text-white" : "bg-base-200"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SeleccionTipoNormativa;
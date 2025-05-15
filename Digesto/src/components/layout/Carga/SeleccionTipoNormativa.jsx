import PropTypes from "prop-types";

const tipoNormativaMap = {
    "Acta": 2,"Resolucion": 5,"Convenio": 3,"Nota": 6,"Providencia": 4,"Ordenanza": 1,};

function SeleccionTipoNormativa({ tipoActual, onSelect }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Seleccione el tipo de normativa a cargar:
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Object.keys(tipoNormativaMap).map((tipo) => (
          <button
            key={tipo}
            onClick={() => onSelect(tipoNormativaMap[tipo])}
            className={`card p-4 border rounded-md text-center cursor-pointer hover:bg-primary hover:text-white transition ${
              tipoActual === tipoNormativaMap[tipo] ? "bg-primary text-white" : "bg-base-200"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>
    </div>
  );
}

SeleccionTipoNormativa.propTypes = {
  tipoActual: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SeleccionTipoNormativa;



import PropTypes from "prop-types";
import {tipoNormativaOptions} from "../config/mapeo"

function PasoSeleccionTipo({ entidad, formData, setFormData, onNext }) {

  const opciones = entidad === "normativa" ? tipoNormativaOptions : [];

  const handleSelect = (tipo_normativa) => {
    setFormData({ ...formData, tipo_normativa });
    onNext();
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Seleccione el tipo de {entidad} a cargar:
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {opciones.map(({label,value}) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={`card p-4 border rounded-md text-center cursor-pointer hover:bg-primary hover:text-white transition ${
              formData.tipo_normativa === value ? "bg-primary text-white" : "bg-base-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

PasoSeleccionTipo.propTypes = {
  entidad: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default PasoSeleccionTipo;

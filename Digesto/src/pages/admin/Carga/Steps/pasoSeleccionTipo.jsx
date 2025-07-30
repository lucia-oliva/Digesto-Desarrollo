import PropTypes from "prop-types";



function PasoSeleccionTipo({ entidad, formData, setFormData, onNext }) {

  const opcionesPorEntidad = {
    normativa: [
        { label: "Ordenanza", value: 1 },
        { label: "Acta", value: 2 },
        { label: "Convenio", value: 3 },
        { label: "Providencia", value: 4 },
        { label: "Resolucion", value: 5 },
        { label: "Nota", value: 6 }
    ]
  };

  const opciones = opcionesPorEntidad[entidad] || [];

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

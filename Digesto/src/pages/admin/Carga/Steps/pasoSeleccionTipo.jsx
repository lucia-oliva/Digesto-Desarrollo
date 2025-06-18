import PropTypes from "prop-types";

function PasoSeleccionTipo({ entidad, formData, setFormData, onNext }) {
  const opcionesPorEntidad = {
    normativa: [
      "Acta",
      "Resolución",
      "Convenio",
      "Nota",
      "Providencia",
      "Ordenanza",
    ],
    usuario: ["Administrador", "Editor", "Lector"],
  };

  const opciones = opcionesPorEntidad[entidad] || [];

  const handleSelect = (tipo) => {
    setFormData({ ...formData, tipo });
    onNext();
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Seleccione el tipo de {entidad} a cargar:
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {opciones.map((tipo) => (
          <button
            key={tipo}
            onClick={() => handleSelect(tipo)}
            className={`card p-4 border rounded-md text-center cursor-pointer hover:bg-primary hover:text-white transition ${
              formData.tipo === tipo ? "bg-primary text-white" : "bg-base-200"
            }`}
          >
            {tipo}
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

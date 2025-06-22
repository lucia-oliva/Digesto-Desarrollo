import PropTypes from "prop-types";
import { camposPorEntidad } from "../config/formFields";

function PasoForm({
  entidad,
  formData,
  setFormData,
  onNext,
  onBack,
  errores,
  setErrores,
}) {
  const campos = camposPorEntidad[entidad] || [];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const validar = () => {
    const nuevosErrores = {};
    campos.forEach(({ name, required }) => {
      if (required && !formData[name]) {
        nuevosErrores[name] = "Este campo es obligatorio.";
      }
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (validar()) onNext();
      }}
    >
      {campos.map(({ name, label, type, options }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1">{label}</label>
          {type === "select" ? (
            <select
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={type === "file" ? undefined : formData[name] || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          )}
          {errores?.[name] && (
            <p className="text-red-500 text-sm mt-1">{errores[name]}</p>
          )}
        </div>
      ))}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn btn-outline">
          Volver
        </button>
        <button type="submit" className="btn btn-primary">
          Siguiente
        </button>
      </div>
    </form>
  );
}

PasoForm.propTypes = {
  entidad: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  errores: PropTypes.object,
  setErrores: PropTypes.func,
};

export default PasoForm;

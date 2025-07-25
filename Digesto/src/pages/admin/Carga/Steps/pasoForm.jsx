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

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (value.includes(",") || e.key === "Enter") {
      
      const newTags = value
        .split(/[,|\n]/)
        .map((tag) => tag.trim())
        .filter(Boolean);
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), ...newTags],
      });
      e.target.value = "";
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(
        (_, index) => index !== indexToRemove
      ),
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
    onKeyDown={(e) => {
      if (
        e.key === "Enter" &&
        e.target.tagName === "INPUT" &&
        e.target.type !== "textarea" &&
        e.target.type !== "submit" &&
        e.target.type !== "button"
      ) {
        e.preventDefault();
      }
    }}
  >
    {campos.map(({ name, label, type, options, required }) => {
      // Ocultar dependencia si no corresponde (solo para usuario)
      const rolStr = String(formData.rol ?? "");

      if (
        entidad === "usuario" &&
        name === "dependencia" &&
        !["2","4"].includes(rolStr)
      ) {
        return null;
      }

      return (
        <div key={name}>
          <label className="block text-sm font-medium mb-1">
            {label}
            {required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          {entidad === "normativa" && name === "tags" ? (
            <>
              <input
                type="text"
                placeholder="Separar con coma o Enter"
                className="input input-bordered w-full"
                onKeyDown={handleTagChange}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.tags || []).map((tag, i) => (
                  <span key={i} className="badge badge-primary gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(i)}
                      className="ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </>
          ) : type === "select" ? (
            <select
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="" disabled>Seleccione</option>
              {options.map((opt) =>
                  typeof opt === "object" ? (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ) : (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )
                )}
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
      );
    })}
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

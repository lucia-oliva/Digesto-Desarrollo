import PropTypes from "prop-types";
import { useMemo } from "react";
import { camposPorEntidad } from "../config/formFields"; // ajusta la ruta real
import { usePasoForm, shouldShowField } from "./pasoFormLogic";
import { dependenciaOptions } from "../config/mapeo";

function PasoForm({
  entidad,
  formData,
  setFormData,
  onNext,
  onBack,
  errores = {},
  setErrores = () => {},
  omitPwdFields = false,
}) {
  const baseCampos = useMemo(() => camposPorEntidad[entidad] || [], [entidad]);

 const campos = useMemo(() => {
    if (entidad !== "normativa") return baseCampos;
    // agregamos el campo virtual al final (o donde prefieras)
    return [
      ...baseCampos,
      {
        name: "normativa_interdepartamental",
        label: "Resolucion Interdepartamental",
        type: "select",
        required: true,
        // Opciones: las mismas de dependencia
        options: dependenciaOptions || [],
        placeholder: "Seleccione la dependencia",
      },
    ];
  }, [entidad, baseCampos]);

  const {
    tagInput,
    setTagInput,
    handleChange,
    handleTagKeyDown,
    commitTags,
    handleRemoveTag,
    preventImplicitSubmit,
    onSubmit,
    errors,
  } = usePasoForm({ entidad, campos, formData, setFormData, onNext, setErrores, omitPwdFields });

  const mergedErrors = Object.keys(errores || {}).length ? errores : errors;

  return (
    <form className="space-y-4" onSubmit={onSubmit} onKeyDown={preventImplicitSubmit}>
      {campos.map(({ name, label, type, options, required, placeholder }) => {
        if (!shouldShowField({ entidad, formData, omitPwdFields }, name)) return null;
        const error = mergedErrors[name];

        const commonLabel = (
          <label htmlFor={name} className="block text-sm font-medium mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        );

        // Caso especial: normativa.tags
        if (entidad === "normativa" && name === "tags") {
          return (
            <div key={name}>
              {commonLabel}
              <input
                id={name}
                type="text"
                placeholder={placeholder || "Separar con coma o Enter"}
                className="input input-bordered w-full"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => commitTags(tagInput)}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.tags || []).map((tag, i) => (
                  <span key={`${tag}-${i}`} className="badge badge-primary gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(i)}
                      className="ml-1"
                      aria-label={`Quitar tag ${tag}`}
                      title="Quitar"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              {error && <p id={`${name}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          );
        }

        if (type === "select") {
          return (
            <div key={name}>
              {commonLabel}
              <select
                id={name}
                name={name}
                value={formData[name] ?? ""}
                onChange={handleChange}
                className="select select-bordered w-full"
                required={!!required}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
              >
                <option value="" disabled>Seleccione</option>
                {(options || []).map((opt) =>
                  typeof opt === "object" ? (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ) : (
                    <option key={opt} value={opt}>{opt}</option>
                  )
                )}
              </select>
              {error && <p id={`${name}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          );
        }

        if (type === "textarea") {
          return (
            <div key={name}>
              {commonLabel}
              <textarea
                id={name}
                name={name}
                className="textarea textarea-bordered w-full"
                placeholder={placeholder || ""}
                required={!!required}
                value={formData[name] ?? ""}
                onChange={handleChange}
                rows={4}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
              />
              {error && <p id={`${name}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          );
        }

        // default input (incluye file)
        return (
          <div key={name}>
            {commonLabel}
            <input
              id={name}
              type={type}
              name={name}
              placeholder={placeholder || ""}
              className="input input-bordered w-full"
              value={type === "file" ? undefined : formData[name] ?? ""}
              accept={type === "file" ? "application/pdf" : undefined}
              onChange={handleChange}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
            />
            {type === "file" && formData[name] && (
              <p className="text-xs text-gray-500 mt-1">
                Archivo seleccionado: {formData[name]?.name || String(formData[name])}
              </p>
            )}
            {error && <p id={`${name}-error`} className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      })}

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn btn-outline">Volver</button>
        <button type="submit" className="btn btn-primary">Siguiente</button>
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
  omitPwdFields: PropTypes.bool,
};

export default PasoForm;

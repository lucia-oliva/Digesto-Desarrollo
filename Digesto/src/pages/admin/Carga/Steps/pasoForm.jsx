import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { camposPorEntidad } from "../config/formFields";

function PasoForm({
  entidad,
  formData,
  setFormData,
  onNext,
  onBack,
  errores = {},
  setErrores = () => {},
}) {
  const campos = useMemo(() => camposPorEntidad[entidad] || [], [entidad]);
  const [tagInput, setTagInput] = useState("");

  const shouldShowField = useCallback(
    (fieldName) => {
      if (entidad === "usuario" && fieldName === "dependencia") {
        return ["2", "4"].includes(String(formData.rol ?? ""));
      }
      return true;
    },
    [entidad, formData.rol]
  );

  const updateField = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setFormData]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, files, checked } = e.target;

      const nextValue =
        type === "file"
          ? files?.[0] ?? null
          : type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value;

      updateField(name, nextValue);
    },
    [updateField]
  );

  const commitTags = useCallback(
    (raw) => {
      const tags = String(raw || "")
        .split(/[,|\n]/)
        .map((t) => t.trim())
        .filter(Boolean);

      if (tags.length === 0) return;

      updateField("tags", [...(formData.tags || []), ...tags]);
      setTagInput("");
    },
    [formData.tags, updateField]
  );

  const handleTagKeyDown = useCallback(
    (e) => {
      if (["Enter", ","].includes(e.key)) {
        e.preventDefault();
        commitTags(tagInput);
      }
    },
    [commitTags, tagInput]
  );

  const handleRemoveTag = useCallback(
    (indexToRemove) => {
      const nextTags = (formData.tags || []).filter(
        (_, i) => i !== indexToRemove
      );
      updateField("tags", nextTags);
    },
    [formData.tags, updateField]
  );

  const validar = useCallback(() => {
    const nuevosErrores = {};

    campos.forEach(({ name, required }) => {
      if (!shouldShowField(name)) return;

      const value = formData[name];
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      if (name === "archivo") {
        const archivo = Array.isArray(value) ? value[0] : value;

        // Si no hay nuevo archivo, pero ya hay uno cargado previamente, no marcar error
        const archivoActual = formData.archivo;
        console.log(!archivo && formData.archivo, archivo, archivoActual);

        if (!archivo && archivoActual) return;

        // Si no hay archivo nuevo ni previo, marcar como obligatorio
        if (!archivo) {
          nuevosErrores[name] = "Este campo es obligatorio.";
          return;
        }

        // Validar que el archivo sea un PDF
        const isPDF =
          archivo?.type === "application/pdf" ||
          archivo?.name?.toLowerCase().endsWith(".pdf");

        if (!isPDF) {
          nuevosErrores[name] = "El archivo debe ser un PDF.";
          return;
        }
      }

      if (name === "tags" && isEmpty) {
        nuevosErrores[name] = "Debe ingresar al menos un tag.";
        return;
      }

      if (required && isEmpty && name !== "archivo" && name !== "tags") {
        nuevosErrores[name] = "Este campo es obligatorio.";
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }, [campos, formData, setErrores, shouldShowField]);

  const preventImplicitSubmit = useCallback((e) => {
    if (
      e.key === "Enter" &&
      e.target.tagName === "INPUT" &&
      !["textarea", "submit", "button"].includes(e.target.type)
    ) {
      e.preventDefault();
    }
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (tagInput.trim()) commitTags(tagInput);
      if (validar()) onNext();
    },
    [commitTags, onNext, tagInput, validar]
  );

  return (
    <form
      className="space-y-4"
      onSubmit={onSubmit}
      onKeyDown={preventImplicitSubmit}
    >
      {campos.map(({ name, label, type, options, required, placeholder }) => {
        if (!shouldShowField(name)) return null;
        const error = errores[name];

        const commonLabel = (
          <label htmlFor={name} className="block text-sm font-medium mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        );

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
                  <span
                    key={`${tag}-${i}`}
                    className="badge badge-primary gap-1"
                  >
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
              {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                  {error}
                </p>
              )}
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
                <option value="" disabled>
                  Seleccione
                </option>
                {(options || []).map((opt) =>
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
              {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                  {error}
                </p>
              )}
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
              {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                  {error}
                </p>
              )}
            </div>
          );
        }

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
                Archivo seleccionado:{" "}
                {formData[name]?.name || String(formData[name])}
              </p>
            )}
            {error && (
              <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                {error}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex justify-between pt-2">
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

// GenericForm.jsx
import { useState } from "react";
import PropTypes from "prop-types";

function GenericForm({ entityName, fields, onSubmit, initialData = {} }) {
  const [formState, setFormState] = useState(initialData);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormState({
      ...formState,
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
      setFormState((prev) => ({
        ...prev,
        palabras_clave: [...(prev.palabras_clave || []), ...newTags],
      }));
      e.target.value = "";
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setFormState((prev) => ({
      ...prev,
      palabras_clave: prev.palabras_clave.filter((_, i) => i !== indexToRemove),
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={submit} className="space-y-4 mt-6">
      {fields.map(({ name, label, type, required, options }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1">{label}:</label>

          {type === "textarea" ? (
            <textarea
              name={name}
              value={formState[name] || ""}
              onChange={handleChange}
              required={required}
              className="textarea textarea-bordered w-full"
              rows={3}
            ></textarea>
          ) : type === "select" ? (
            <select
              name={name}
              value={formState[name] || ""}
              onChange={handleChange}
              required={required}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : type === "file" ? (
            <input
              type="file"
              name={name}
              onChange={handleChange}
              required={required}
              className="file-input file-input-bordered w-full"
            />
          ) : type === "tags" ? (
            <div>
              <input
                type="text"
                onKeyDown={handleTagChange}
                placeholder="Separar con coma o Enter"
                className="input input-bordered w-full"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {(formState.palabras_clave || []).map((tag, i) => (
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
            </div>
          ) : (
            <input
              type={type}
              name={name}
              value={formState[name] || ""}
              onChange={handleChange}
              required={required}
              className="input input-bordered w-full"
            />
          )}
        </div>
      ))}

      <div className="flex justify-between">
        <button type="submit" className="btn btn-primary mt-5">
          Siguiente
        </button>
      </div>
    </form>
  );
}

GenericForm.propTypes = {
  entityName: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default GenericForm;

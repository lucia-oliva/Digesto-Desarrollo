import PropTypes from "prop-types";

function FormularioDatos({
  formData,
  setFormData,
  errores,
  validarPaso2,
  onBack,
  onNext,
  dependenciaOptions,
  emisorOptions,
  estadoOptions,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      archivo_pdf: e.target.files[0],
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
        palabras_clave: [...formData.palabras_clave, ...newTags],
      });
      e.target.value = "";
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setFormData({
      ...formData,
      palabras_clave: formData.palabras_clave.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  return (
    <form className="space-y-4 mt-6" onSubmit={(e) => e.preventDefault()}>
      <div className="flex space-x-4">
        <div className="w-full">
          <label className="block text-sm font-medium">Número:</label>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            className={`input input-bordered w-full ${errores.numero ? "input-error" : ""}`}
          />
          {errores.numero && <p className="text-red-500 text-sm">{errores.numero}</p>}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium">Año:</label>
          <input
            type="text"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            className={`input input-bordered w-full ${errores.anio ? "input-error" : ""}`}
          />
          {errores.anio && <p className="text-red-500 text-sm">{errores.anio}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Título:</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={`input input-bordered w-full ${errores.titulo ? "input-error" : ""}`}
        />
        {errores.titulo && <p className="text-red-500 text-sm">{errores.titulo}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Resumen:</label>
        <textarea
          name="resumen"
          value={formData.resumen}
          onChange={handleChange}
          className={`textarea textarea-bordered w-full ${errores.resumen ? "textarea-error" : ""}`}
          rows={3}
        />
        {errores.resumen && <p className="text-red-500 text-sm">{errores.resumen}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Fecha:</label>
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          className={`input input-bordered w-full ${errores.fecha ? "input-error" : ""}`}
        />
        {errores.fecha && <p className="text-red-500 text-sm">{errores.fecha}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Dependencia:</label>
        <select
          name="dependencia"
          value={formData.dependencia}
          onChange={handleChange}
          className={`select select-bordered w-full ${errores.dependencia ? "select-error" : ""}`}
        >
          <option value="">Seleccione</option>
          {dependenciaOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errores.dependencia && <p className="text-red-500 text-sm">{errores.dependencia}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Emisor:</label>
        <select
          name="emisor"
          value={formData.emisor}
          onChange={handleChange}
          className={`select select-bordered w-full ${errores.emisor ? "select-error" : ""}`}
        >
          <option value="">Seleccione</option>
          {emisorOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errores.emisor && <p className="text-red-500 text-sm">{errores.emisor}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Archivo PDF:</label>
        <input
          type="file"
          onChange={handleFileChange}
          className={`file-input file-input-bordered w-full ${errores.archivo_pdf ? "file-input-error" : ""}`}
        />
        {errores.archivo_pdf && <p className="text-red-500 text-sm">{errores.archivo_pdf}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Estado:</label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className={`select select-bordered w-full ${errores.estado ? "select-error" : ""}`}
        >
          {estadoOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errores.estado && <p className="text-red-500 text-sm">{errores.estado}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Palabras clave:</label>
        <input
          type="text"
          onKeyDown={handleTagChange}
          placeholder="Separar con coma o Enter"
          className={`input input-bordered w-full ${errores.palabras_clave ? "input-error" : ""}`}
        />
        {errores.palabras_clave && <p className="text-red-500 text-sm">{errores.palabras_clave}</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.palabras_clave.map((tag, i) => (
            <span key={i} className="badge badge-primary gap-1">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(i)} className="ml-1">
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="btn btn-outline">
          Volver
        </button>
        <button
          type="button"
          onClick={() => {
            if (validarPaso2()) {
              onNext();
            }
          }}
          className="btn btn-primary"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}


FormularioDatos.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errores: PropTypes.object.isRequired,
  validarPaso2: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  handleTagChange: PropTypes.func.isRequired,
  handleRemoveTag: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  dependenciaOptions: PropTypes.array.isRequired,
  emisorOptions: PropTypes.array.isRequired,
  estadoOptions: PropTypes.array.isRequired,
};

export default FormularioDatos;

//Este componente hace el paso 2 de Carga. Cuando Rellenamos los datos de la nueva normativa.

import PropTypes from "prop-types";
import { useState } from "react";
//TODO: Las validaciones se pueden mejorar en un nuevo componente. (Visualmente, reactivos y por tipo)

function FormularioDatos({
  formData,
  setFormData,
  onBack,
  onNext,
  dependenciaOptions,
  emisorOptions,
  estadoOptions,
}) {
  const [errores, setErrores] = useState({});

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

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!formData.numero.trim()) nuevosErrores.numero = "Ingrese el número.";
    if (!formData.anio.trim()) nuevosErrores.anio = "Ingrese el año.";
    if (!formData.titulo.trim()) nuevosErrores.titulo = "Ingrese el título.";
    if (!formData.resumen.trim()) nuevosErrores.resumen = "Ingrese el resumen.";
    if (!formData.fecha) nuevosErrores.fecha = "Seleccione una fecha.";
    if (!formData.dependencia.trim()) nuevosErrores.dependencia = "Seleccione una dependencia.";
    if (!formData.emisor.trim()) nuevosErrores.emisor = "Seleccione un emisor.";
    if (!formData.estado.trim()) nuevosErrores.estado = "Seleccione un estado.";
    if (!formData.archivo_pdf) nuevosErrores.archivo_pdf = "Adjunte un archivo PDF.";
    if (!formData.palabras_clave || formData.palabras_clave.length === 0)
      nuevosErrores.palabras_clave = "Ingrese al menos una palabra clave.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
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
          {Object.entries(dependenciaOptions).map(([key,value]) => (
            <option key={key} value={value}>{key}</option>
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
          {Object.entries(emisorOptions).map(([key,value]) => (
            <option key={key} value={value}>{key}</option>
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
            if (validarCampos()) {
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

export default FormularioDatos;

FormularioDatos.propTypes = {
  formData: PropTypes.shape({
    tipo_normativa: PropTypes.string.isRequired,
    numero: PropTypes.string.isRequired,
    anio: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    resumen: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    archivo_pdf: PropTypes.object,
    dependencia: PropTypes.string.isRequired,
    emisor: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    palabras_clave: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  dependenciaOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  emisorOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  estadoOptions: PropTypes.arrayOf(PropTypes.string).isRequired
};
import React, { useState } from "react";

function Carga() {
  const [formData, setFormData] = useState({
    numero: "",
    anio: "",
    titulo: "",
    resumen: "",
    fecha: "",
    dependencia: "",
    emisor: "",
    tipo_normativa: "",
    archivo_pdf: null,
    estado: "Publicado",
    cambia_normativa: "NO",
    palabras_clave: [],
  });

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
        .filter(Boolean); // Elimina espacios en blanco y valores vacíos
      setFormData({
        ...formData,
        palabras_clave: [...formData.palabras_clave, ...newTags],
      });
      e.target.value = ""; // Limpia el input
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log(formData);
  };

  const dependenciaOptions = ["Aplicadas", "Exactas", "Humanas"];
  const emisorOptions = ["Decano", "Consejo Superior"];
  const tipoNormativaOptions = [
    "Acta",
    "Resolución",
    "Convenio",
    "Resolucion",
    "Nota",
    "Providencia",
    "Ordenanza",
  ];
  const estadoOptions = ["Publicado", "Despublicado"];
  const cambiaNormativaOptions = ["SI", "NO"];

  return (
    <div className="w-full p-6 rounded-lg shadow-lg bg-base-100 text-neutral">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Agregar Nueva Normativa
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Numero y Anio */}
        <div className="flex space-x-4">
          <div>
            <label
              htmlFor="numero"
              className="block text-sm font-medium text-gray-700"
            >
              Número:
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="anio"
              className="block text-sm font-medium text-gray-700"
            >
              Año de Normativa:
            </label>
            <input
              type="text"
              id="anio"
              name="anio"
              value={formData.anio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>

        {/* Título */}
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700"
          >
            Título:
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        {/* Resumen */}
        <div>
          <label
            htmlFor="resumen"
            className="block text-sm font-medium text-gray-700"
          >
            Resumen:
          </label>
          <textarea
            id="resumen"
            name="resumen"
            value={formData.resumen}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          ></textarea>
        </div>

        {/* Fecha */}
        <div>
          <label
            htmlFor="fecha"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha:
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        {/* Dependencia */}
        <div>
          <label
            htmlFor="dependencia"
            className="block text-sm font-medium text-gray-700"
          >
            Dependencia:
          </label>
          <select
            id="dependencia"
            name="dependencia"
            value={formData.dependencia}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">Seleccione una dependencia</option>
            {dependenciaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Emisor */}
        <div>
          <label
            htmlFor="emisor"
            className="block text-sm font-medium text-gray-700"
          >
            Emisor:
          </label>
          <select
            id="emisor"
            name="emisor"
            value={formData.emisor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">Seleccione un emisor</option>
            {emisorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Normativa */}
        <div>
          <label
            htmlFor="tipo_normativa"
            className="block text-sm font-medium text-gray-700"
          >
            Tipo de Normativa:
          </label>
          <select
            id="tipo_normativa"
            name="tipo_normativa"
            value={formData.tipo_normativa}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">Seleccione un tipo</option>
            {tipoNormativaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Archivo PDF */}
        <div>
          <label
            htmlFor="archivo_pdf"
            className="block text-sm font-medium text-gray-700"
          >
            Archivo PDF:
          </label>
          <input
            type="file"
            id="archivo_pdf"
            name="archivo_pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-md
      file:border-0
      file:text-sm
      file:font-semibold
      file:bg-primary file:text-white
      hover:file:bg-primary-focus
    "
          />
        </div>

        {/* Estado */}
        <div>
          <label
            htmlFor="estado"
            className="block text-sm font-medium text-gray-700"
          >
            Estado:
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {estadoOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Cambia Otra Normativa */}
        <div>
          <label
            htmlFor="cambia_normativa"
            className="block text-sm font-medium text-gray-700"
          >
            ¿Cambia otra normativa?:
          </label>
          <select
            id="cambia_normativa"
            name="cambia_normativa"
            value={formData.cambia_normativa}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {cambiaNormativaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Palabras Clave */}
        <div>
          <label
            htmlFor="palabras_clave"
            className="block text-sm font-medium text-gray-700"
          >
            Palabras Clave:
          </label>
          <input
            type="text"
            id="palabras_clave"
            name="palabras_clave"
            onKeyDown={handleTagChange}
            placeholder="Ingrese palabras clave separadas por coma o Enter"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          <div className="mt-2">
            {formData.palabras_clave.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-primary px-3 py-0.5 text-sm font-medium text-white mr-2 mt-2"
              >
                {tag}
                <button
                  type="button"
                  className="ml-2  text-xl text-base-100 hover:text-accent focus:outline-none"
                  onClick={() => handleRemoveTag(index)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Agregar Normativa
          </button>
        </div>
      </form>
    </div>
  );
}

export default Carga;
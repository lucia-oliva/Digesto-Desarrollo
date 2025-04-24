import React, { useState } from "react";
import Table from "./Table";
import Pagination from "./Pagination";
import useAxios from "axios-hooks";

function Carga() {
  const [pasoActual, setPasoActual] = useState(0);
  const [filteredNormativas, setFilteredNormativas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const [totalResults, setTotalResults] = useState(0);

  const [formData, setFormData] = useState({
    tipo_normativa: "",
    numero: "",
    anio: "",
    titulo: "",
    resumen: "",
    fecha: "",
    dependencia: "",
    emisor: "",
    archivo_pdf: null,
    estado: "Publicado",
    cambia_normativa: "NO",
    normativa_modificada: "",
    palabras_clave: [],
  });

  const [{ loading, error }, refetch] = useAxios(
    {
      url: `http://localhost:3000/api/normativa/search`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { manual: true }
  );

  const handleSearchNormativas = (numero, page = 1) => {
    if (numero) {
      refetch({
        params: { page, limit: resultsPerPage },
        data: { numero },
      })
        .then((response) => {
          setFilteredNormativas(response.data.normativas || []);
          setTotalResults(response.data.totalResults || 0);
        })
        .catch((err) => {
          console.error("Error al buscar normativas:", err.message);
          setFilteredNormativas([]);
          setTotalResults(0);
        });
    } else {
      setFilteredNormativas([]);
      setTotalResults(0);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleSearchNormativas(formData.normativa_modificada, page);
  };

  const dependenciaOptions = ["Aplicadas", "Exactas", "Humanas"];
  const emisorOptions = ["Decano", "Consejo Superior"];
  const tipoNormativaOptions = [
    "Acta",
    "Resolución",
    "Convenio",
    "Nota",
    "Providencia",
    "Ordenanza",
  ];
  const estadoOptions = ["Publicado", "Despublicado"];

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

  const handleTipoSelect = (tipo) => {
    setFormData({ ...formData, tipo_normativa: tipo });
    setPasoActual(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="w-full p-6 rounded-lg shadow-lg bg-base-100 text-neutral">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Agregar Nueva Normativa
      </h2>

      {/* STEPS VISUALES */}
      <div className="flex justify-center">
      <ul className="steps mb-6">
        <li className={`step ${pasoActual >= 0 ? "step-primary" : ""}`}>
          Seleccionar Normativa
        </li>
        <li className={`step ${pasoActual >= 1 ? "step-primary" : ""}`}>
          Cargar Datos
        </li>
        <li className={`step ${pasoActual >= 2 ? "step-primary" : ""}`}>
          Informacion Extra
        </li>
      </ul>
      </div>

      {/* PASO 1 - Selección de tipo */}
      {pasoActual === 0 && (
        <div className=" mb-6">
        <h3 className="text-lg font-semibold mb-4">
        Seleccione el tipo de normativa a cargar:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tipoNormativaOptions.map((tipo) => (
            <button
              key={tipo}
              onClick={() => handleTipoSelect(tipo)}
              className={`card p-4 border rounded-md text-center cursor-pointer hover:bg-primary hover:text-white transition ${
                formData.tipo_normativa === tipo
                  ? "bg-primary text-white"
                  : "bg-base-200"
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
        </div>
      )}

      {/* PASO 2 - Formulario */}
      {pasoActual === 1 && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium">Número:</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Año:</label>
              <input
                type="text"
                name="anio"
                value={formData.anio}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Título:</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Resumen:</label>
            <textarea
              name="resumen"
              value={formData.resumen}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={3}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Dependencia:</label>
            <select
              name="dependencia"
              value={formData.dependencia}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione</option>
              {dependenciaOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Emisor:</label>
            <select
              name="emisor"
              value={formData.emisor}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione</option>
              {emisorOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Archivo PDF:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Estado:</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              {estadoOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Palabras clave:</label>
            <input
              type="text"
              onKeyDown={handleTagChange}
              placeholder="Separar con coma o Enter"
              className="input input-bordered w-full"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.palabras_clave.map((tag, i) => (
                <span
                  key={i}
                  className="badge badge-primary gap-1"
                >
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

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setPasoActual(0)}
              className="btn btn-outline"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={() => setPasoActual(2)}
              className="btn btn-primary"
            >
              Siguiente
            </button>
          </div>
        </form>
      )}

      {/* PASO 3 - Pregunta condicional */}
      {pasoActual === 2 && (
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold">
              ¿Su normativa modifica, deroga o complementa a otra?
            </h3>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, cambia_normativa: "SI" })
                }
                className={`btn ${
                  formData.cambia_normativa === "SI"
                    ? "btn-primary"
                    : "btn-outline"
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    cambia_normativa: "NO",
                    normativa_modificada: "",
                  })
                }
                className={`btn ${
                  formData.cambia_normativa === "NO"
                    ? "btn-primary"
                    : "btn-outline"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {formData.cambia_normativa === "SI" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Ingrese el número de la normativa que es afectada:
              </label>
              <input
    
                type="text"
                name="normativa_modificada"
                value={formData.normativa_modificada}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    normativa_modificada: value,
                  }));
                  setCurrentPage(1); // Reset to first page on new search
                  handleSearchNormativas(value, 1);
                }}
                className="input input-bordered w-full mb-3"
              />

              {formData.normativa_modificada && (
                <>
                  {loading ? (
                    <p>Cargando resultados...</p>
                  ) : error ? (
                    <p className="text-red-500">Error al buscar normativas.</p>
                  ) : filteredNormativas.length > 0 ? (
                    <>
                      <Table normativas={filteredNormativas} />
                      <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        resultsPerPage={resultsPerPage}
                        onPageChange={handlePageChange}
                      />
                    </>
                  ) : (
                    <p className="text-gray-500">No se encontraron normativas.</p>
                  )}
                </>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setPasoActual(1)}
              className="btn btn-outline mt-5"
            >
              Volver
            </button>
            <button
              type="submit"
              className="btn btn-success mt-5"
            >
              Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carga;

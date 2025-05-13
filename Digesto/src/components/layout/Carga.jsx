import { useState } from "react";
import Table from "./Table";
import Pagination from "./Pagination";
import useAxios from "axios-hooks";
import SeleccionTipoNormativa from "./Carga/SeleccionTipoNormativa"; 

//TODO: implementar la funcionalidad para crear normativas... 
//TODO: Ver como integramos la funcionalidad de normativas_modificadas
//TODO: Las validaciones se pueden mejorar en un nuevo componente. (Visualmente, reactivos y por tipo)
function Carga() {
  const [pasoActual, setPasoActual] = useState(0);
  const [filteredNormativas, setFilteredNormativas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const [totalResults, setTotalResults] = useState(0);
  const [errores, setErrores] = useState({});


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
    normativa_modificada: [],
    palabras_clave: [],
  });

  const validarPaso2 = () => {
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

  const [{ loading: creating}, refetchCreate] = useAxios(
    {
      url: `http://localhost:3000/api/normativa/create`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { manual: true }
  );

  // Crear normativa
  const handleCreateNormativa = () => {
    const formDataToSend = {
      numero: formData.numero,
      anio: formData.anio,
      titulo: formData.titulo,
      resumen: formData.resumen,
      fecha: formData.fecha,
      dependencia: formData.dependencia,
      emisor: formData.emisor,
      tipo_normativa: formData.tipo_normativa,
      estado: formData.estado,
      tags: formData.palabras_clave,
      archivo: formData.archivo_pdf ? formData.archivo_pdf.name : null,
    };

    refetchCreate({ data: formDataToSend })
      .then((response) => {
        console.log("Normativa creada:", response.data);
        alert("Normativa creada correctamente");

        // Reiniciar el formulario
        setFormData({
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
          normativa_modificada: [],
          palabras_clave: [],
        });
        setPasoActual(0); // Volver al paso inicial
      })
      .catch((err) => {
        console.error("Error al crear la normativa:", err.message);
        alert("Error al crear la normativa");
      });
  };

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
  const estadoOptions = ["publicado", "despublicado"];

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
          <li className={`step ${pasoActual >= 3 ? "step-primary" : ""}`}>
            Verificación
          </li>
        </ul>
      </div>
      
      {/* PASO 1 - Selección de tipo de normativa */}
      {pasoActual === 0 && (
          <SeleccionTipoNormativa
            tipoActual={formData.tipo_normativa}
            onSelect={(tipo) => {
              setFormData({ ...formData, tipo_normativa: tipo });
              setPasoActual(1);
            }}
          />
      )}

      {/* PASO 2 - Formulario */}
      {pasoActual === 1 && (
        <form className="space-y-4 mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            setPasoActual(2);
          }
          }
        >
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium">Número:</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="input input-bordered w-full" required
              />
              {errores.numero && <p className="text-red-500 text-sm mt-1">{errores.numero}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Año:</label>
              <input
                type="text"
                name="anio"
                value={formData.anio}
                onChange={handleChange}
                className="input input-bordered w-full" required
              />
              {errores.anio && <p className="text-red-500 text-sm mt-1">{errores.anio}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Título:</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="input input-bordered w-full" required
            />
            {errores.titulo && <p className="text-red-500 text-sm mt-1">{errores.titulo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Resumen:</label>
            <textarea
              name="resumen"
              value={formData.resumen}
              onChange={handleChange}
              className="textarea textarea-bordered w-full" required
              rows={3}
            ></textarea>
            {errores.resumen && <p className="text-red-500 text-sm mt-1">{errores.resumen}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="input input-bordered w-full" required
            />
            {errores.fecha && <p className="text-red-500 text-sm mt-1">{errores.fecha}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Dependencia:</label>
            <select
              name="dependencia"
              value={formData.dependencia}
              onChange={handleChange}
              className="select select-bordered w-full" required
            >
              <option value="">Seleccione</option>
              {dependenciaOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            {errores.dependencia && <p className="text-red-500 text-sm mt-1">{errores.dependencia}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Emisor:</label>
            <select
              name="emisor"
              value={formData.emisor}
              onChange={handleChange}
              className="select select-bordered w-full" required
            >
              <option value="">Seleccione</option>
              {emisorOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            {errores.emisor && <p className="text-red-500 text-sm mt-1">{errores.emisor}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Archivo PDF:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full" required
            />
            {errores.archivo_pdf && <p className="text-red-500 text-sm mt-1">{errores.archivo_pdf}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Estado:</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="select select-bordered w-full" required
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
              className="input input-bordered w-full" required
            />
            {errores.palabras_clave && <p className="text-red-500 text-sm mt-1">{errores.palabras_clave}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.palabras_clave.map((tag, i) => (
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
                  onClick={() => {
                    if (validarPaso2()) {
                      setPasoActual(2);
                    }
                  }}
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
                      <Table
                        normativas={filteredNormativas}
                        normativasSeleccionadas={
                          formData.normativas_modificadas
                        }
                        onSeleccionarNormativas={(normativa) => {
                          setFormData((prev) => {
                            const yaExiste = prev.normativas_modificadas?.some(
                              (n) => n.id === normativa.id
                            );
                            if (yaExiste) {
                              // Si ya existe, actualizamos la acción y el comentario
                              return {
                                ...prev,
                                normativas_modificadas: prev.normativas_modificadas.map((n) =>
                                  n.id === normativa.id ? normativa : n
                                ),
                              };
                            }
                            // Si no existe, la agregamos
                            return {
                              ...prev,
                              normativas_modificadas: [
                                ...(prev.normativas_modificadas || []),
                                normativa,
                              ],
                            };
                          });
                        }}
                        onDeseleccionarNormativas={(id) => {
                          setFormData((prev) => ({
                            ...prev,
                            normativas_modificadas:
                              prev.normativas_modificadas.filter(
                                (n) => n.id !== id
                              ),
                          }));
                        }}
                      />
                      <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        resultsPerPage={resultsPerPage}
                        onPageChange={handlePageChange}
                      />
                    </>
                  ) : (
                    <p className="text-gray-500">
                      No se encontraron normativas.
                    </p>
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
              type="button"
              onClick={() => setPasoActual(3)}
              className="btn btn-primary mt-5"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {pasoActual === 3 && (
        <div className="space-y-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Verifique los datos ingresados:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-base-200 p-4 rounded-lg">
              <p>
                <strong>Tipo de Normativa:</strong> {formData.tipo_normativa}
              </p>
              <p>
                <strong>Número:</strong> {formData.numero}
              </p>
              <p>
                <strong>Año:</strong> {formData.anio}
              </p>
              <p>
                <strong>Título:</strong> {formData.titulo}
              </p>
              <p>
                <strong>Resumen:</strong> {formData.resumen}
              </p>
              <p>
                <strong>Fecha:</strong> {formData.fecha}
              </p>
              <p>
                <strong>Archivo PDF:</strong>{" "}
                {formData.archivo_pdf
                  ? formData.archivo_pdf.name
                  : "No se ha cargado ningún archivo"}
              </p>
            </div>

            <div className="bg-base-200 p-4 rounded-lg">
              <p>
                <strong>Dependencia:</strong> {formData.dependencia}
              </p>
              <p>
                <strong>Emisor:</strong> {formData.emisor}
              </p>
              <p>
                <strong>Estado:</strong> {formData.estado}
              </p>
              <p>
                <strong>Modifica otra normativa:</strong>{" "}
                {formData.cambia_normativa}
              </p>
              {formData.cambia_normativa === "SI" &&
                formData.normativas_modificadas?.length > 0 && (
                  <>
                    <p>
                      <strong>Normativas Afectadas:</strong>
                    </p>
                    <ul className="list-disc list-inside">
                      {formData.normativas_modificadas.map((n, i) => (
                        <li key={i}>
                          {n.numero} - {n.accion}{" "}
                          {n.comentario && `(${n.comentario})`}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

              <p>
                <strong>Palabras Clave:</strong>{" "}
                {formData.palabras_clave.join(", ")}
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setPasoActual(2)}
              className="btn btn-outline"
            >
              Volver
            </button>
            <button
              type="submit"
              onClick={handleCreateNormativa}
              className={`btn btn-success ${creating ? "loading" : ""}`}
            >
              Confirmar y Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carga;

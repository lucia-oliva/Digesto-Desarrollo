//Este componen maneja el modal para editar Normativas.
import PropTypes from "prop-types";
import Pagination from "../Pagination";

function EditNormativaModal({
  editModalData,
  setEditModalData,
  onClose,
  onSave,
  isLoading,
  dependenciaMap,
  emisorMap,
  tipoNormativaMap,
  estadoOptions,
  normativa_modificadas,
  setNormativaModificadas,
  filteredNormativas,
  handleSearchNormativas,
  currentPage,
  setCurrentPage,
  setModalData,
  setShowModal,
}) {
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditModalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditModalData((prev) => ({
        ...prev,
        archivo: file.name,
        archivo_pdf: file,
      }));
    }
  };

  if (!editModalData) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-40">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
      <div id="editNormativeModal" className="relative bg-white p-6 rounded-lg shadow-lg overflow-x-auto overflow-y-auto z-50">
        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-4">Editar Normativa</h2>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Número:</label>
              <input
                type="text"
                name="numero"
                value={editModalData.numero || ""}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Año:</label>
              <input
                type="text"
                name="anio"
                value={editModalData.anio || ""}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Título:</label>
            <input
              type="text"
              name="titulo"
              value={editModalData.titulo || ""}
              onChange={handleEditChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Resumen:</label>
            <textarea
              name="resumen"
              value={editModalData.resumen || ""}
              onChange={handleEditChange}
              className="textarea textarea-bordered w-full"
              rows={3}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={editModalData.fecha || ""}
              onChange={handleEditChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dependencia:</label>
            <select
              name="dependencia"
              value={editModalData.dependencia || ""}
              onChange={handleEditChange}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione</option>
              {Object.keys(dependenciaMap).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Emisor:</label>
            <select
              name="emisor"
              value={editModalData.emisor || ""}
              onChange={handleEditChange}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione</option>
              {Object.keys(emisorMap).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Normativa:</label>
            <select
              name="tipo_normativa"
              value={editModalData.tipo_normativa || ""}
              onChange={handleEditChange}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione</option>
              {Object.keys(tipoNormativaMap).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 mt-3">Estado:</label>
            <select
              name="estado"
              value={editModalData.estado || ""}
              onChange={handleEditChange}
              className="select select-bordered w-full"
            >
              {estadoOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 mt-3">Cargar otro archivo PDF:</label>
            <input
              type="file"
              name="archivo"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags:</label>
            <input
              type="text"
              placeholder="Agregar tags separados por coma o Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const newTag = e.target.value.trim();
                  if (newTag && !editModalData.tags.includes(newTag)) {
                    setEditModalData((prev) => ({
                      ...prev,
                      tags: [...prev.tags, newTag],
                    }));
                  }
                  e.target.value = "";
                }
              }}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {editModalData.tags.map((tag, index) => (
              <span key={index} className="badge badge-primary gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setEditModalData((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((_, i) => i !== index),
                    }))
                  }
                  className="ml-1"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2">¿Esta normativa modifica, deroga o complementa a otra?</h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  setEditModalData((prev) => ({ ...prev, cambia_normativa: "SI" }))
                }
                className={`btn ${editModalData.cambia_normativa === "SI" ? "btn-primary" : "btn-outline"}`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditModalData((prev) => ({
                    ...prev,
                    cambia_normativa: "NO",
                    normativa_modificada: [],
                  }))
                }
                className={`btn ${editModalData.cambia_normativa === "NO" ? "btn-primary" : "btn-outline"}`}
              >
                No
              </button>
            </div>
          </div>

          {editModalData.cambia_normativa === "SI" && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Ingrese el número de la normativa afectada:</label>
              <input
                type="text"
                name="normativa_modificada"
                value={editModalData.normativa_modificada || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditModalData((prev) => ({
                    ...prev,
                    normativa_modificada: value,
                  }));
                  setCurrentPage(1);
                  handleSearchNormativas(value, 1);
                }}
                className="input input-bordered w-full mb-3"
              />

              {editModalData.normativa_modificada && (
                <>
                  {filteredNormativas.length > 0 ? (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Resultados:</h4>
                      <ul className="list-none">
                        {filteredNormativas.map((normativa) => (
                          <li key={normativa.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                            <span>
                              <strong>{normativa.numero}</strong> - {normativa.titulo} - {normativa.dependencia}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setModalData(normativa);
                                setShowModal(true);
                              }}
                              className="btn btn-sm btn-primary"
                            >
                              Seleccionar
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500">No se encontraron normativas.</p>
                  )}
                </>
              )}

              {filteredNormativas.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalResults={filteredNormativas.length}
                  resultsPerPage={10}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    handleSearchNormativas(editModalData.normativa_modificada, page);
                  }}
                />
              )}
            </div>
          )}

          {normativa_modificadas.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Normativas seleccionadas:</h4>
              <ul className="list-none">
                {normativa_modificadas.map((normativa, index) => (
                  <li key={index} className="flex justify-between items-center p-2 border-b border-gray-200">
                    <div>
                      <p>
                        <strong>{normativa.numero}</strong> - {normativa.titulo}
                      </p>
                      <p className="text-sm text-gray-500">
                        Acción: {normativa.accion} | Comentario: {normativa.comentario}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNormativaModificadas((prev) =>
                          prev.filter((n) => n.id !== normativa.id)
                        )
                      }
                      className="btn btn-sm btn-error"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn btn-outline btn-md">
            Cancelar
          </button>
          <button
            onClick={onSave}
            className={`btn btn-primary btn-md ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditNormativaModal;

EditNormativaModal.propTypes = {
  editModalData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    numero: PropTypes.string,
    anio: PropTypes.string,
    titulo: PropTypes.string,
    resumen: PropTypes.string,
    fecha: PropTypes.string,
    dependencia: PropTypes.string,
    emisor: PropTypes.string,
    tipo_normativa: PropTypes.string,
    estado: PropTypes.string,
    archivo: PropTypes.string,
    archivo_pdf: PropTypes.any,
    tags: PropTypes.arrayOf(PropTypes.string),
    cambia_normativa: PropTypes.string,
    normativa_modificada: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }),
  setEditModalData: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  dependenciaMap: PropTypes.object.isRequired,
  emisorMap: PropTypes.object.isRequired,
  tipoNormativaMap: PropTypes.object.isRequired,
  estadoOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  normativa_modificadas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      numero: PropTypes.string,
      titulo: PropTypes.string,
      accion: PropTypes.string,
      comentario: PropTypes.string,
    })
  ).isRequired,
  setNormativaModificadas: PropTypes.func.isRequired,
  filteredNormativas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      numero: PropTypes.string,
      titulo: PropTypes.string,
      dependencia: PropTypes.string,
    })
  ).isRequired,
  handleSearchNormativas: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

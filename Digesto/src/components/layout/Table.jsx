import PropTypes from "prop-types";
import { useLocation } from "react-router";
import { useState} from "react";

// TODO: Hay que desactivar el scroll del fondo cuando los modales estan activos porque si no molestan...
//Hay que hacer la funcion en el back para modificacion.
// Hay que hacer la funcion en el back para eliminar la normativa.

function Table({
  normativas,
  onSeleccionarNormativas,
  normativasSeleccionadas = [],
  onDeseleccionarNormativas,
}) {
  const location = useLocation();
  const isNuevaNormativa =
    location.pathname === "/administracion" &&
    new URLSearchParams(location.search).get("option") === "Nueva Normativa";
  const isAdminList = location.pathname === "/administracion";

  console.log(normativas);

  const ocultarVisitas = location.pathname === "/busqueda" || isNuevaNormativa;

  const [modalData, setModalData] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedComment, setSelectedComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const emisorOptions = [
    "Decano", "Consejo Superior", 
    "Rector", "Concejo Directivo", 
    "Interdepartamental", 
    "Relaciones Institucionales" ];
  const dependenciaOptions = ["Aplicadas", "Exactas", "Humanidades", "Salud", "Sociales", "Sede Chepes", "Sede Chamical", "Sede Villa Unión", "Sede Catuna", "Sede Aimogasta", "Consejo Superior" ];
  const tipoNormativaOptions = [
    "Acta",
    "Resolucion",
    "Convenio",
    "Nota",
    "Providencia",
    "Ordenanza",
  ];
  const estadoOptions = ["Publicado", "Despublicado"];
  

  const openEditModal = (normativa) => {
    setEditModalData({
      numero: normativa.numero || "",
      anio: normativa.anio || "",
      titulo: normativa.titulo || "",
      resumen: normativa.resumen || "",
      fecha: normativa.fecha || "",
      dependencia: normativa.dependencia || "",
      emisor: normativa.emisor || "",
      tipo_normativa: normativa.tipo_normativa || "",
      estado: normativa.estado || "",
      archivo: normativa.archivo || null,

    });
    setShowEditModal(true);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditModalData((prev) => ({
      ...prev,
      archivo_pdf: file, // Guarda el archivo seleccionado
    }));
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditModalData(null);
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call or backend update
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Datos actualizados:", editModalData);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    } finally {
      setIsLoading(false);
      closeEditModal();
    }
  };
  
  const openModal = (normativa) => {
    setModalData(normativa);
    setSelectedAction("");
    setSelectedComment("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
    setSelectedAction("");
    setSelectedComment("");
  };

  const handleAccept = () => {
    if (!selectedAction) return;
    onSeleccionarNormativas({
      id: modalData.id,
      numero: modalData.numero,
      titulo: modalData.titulo,
      accion: selectedAction,
      comentario: selectedComment,
    });
    closeModal();
  };

  const handleDeselect = (id) => {
    onDeseleccionarNormativas(id);
  };

  const isSelected = (id) => normativasSeleccionadas.some((n) => n.id === id);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta normativa?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/normativa/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al eliminar la normativa:", errorData.error);
        alert("Error al eliminar la normativa: " + errorData.error);
        return;
      }

      alert("Normativa eliminada correctamente");
      // Actualiza la lista de normativas después de eliminar
      window.location.reload(); // O actualiza el estado local si estás manejando normativas en el estado
    } catch (error) {
      console.error("Error al eliminar la normativa:", error);
      alert("Error al eliminar la normativa");
    }
  };

  return (
    <div className="justify-center flex items-center">
      <div className="w-auto text-neutral text-center rounded-lg">
        <div className="grid grid-cols-1 md:hidden gap-4">
          {normativas?.map((normativa) => (
            <div
              key={normativa.id}
              className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {normativa.titulo}
              </h2>
              <div className="space-y-2 mt-2">
                <p className="text-sm text-gray-600">
                  <strong>Número:</strong> {normativa.numero}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Fecha:</strong> {normativa.fecha}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Dependencia:</strong> {normativa.dependencia}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Emisor:</strong> {normativa.emisor}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tipo:</strong> {normativa.tipo_normativa}
                </p>
                {!ocultarVisitas && (
                  <p className="text-sm text-gray-600">
                    <strong>Visitas:</strong> {normativa.visitas}
                  </p>
                )}
              </div>
              <div className="flex justify-center mt-4">
                {isNuevaNormativa ? (
                  isSelected(normativa.id) ? (
                    <button
                      onClick={() => handleDeselect(normativa.id)}
                      className="btn btn-secondary btn-md"
                    >
                      Deseleccionar
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        openModal({
                          id: normativa.id,
                          titulo: normativa.titulo,
                        })
                      }
                      className="btn btn-primary btn-md"
                    >
                      Seleccionar
                    </button>
                  )
                ) : isAdminList ? (
                  <>
                    <a
                      href={`document/${normativa.id}`}
                      className="btn btn-primary btn-md"
                    >
                      Ver Normativa
                    </a>
                    <button
                      onClick={() => openEditModal(normativa)} 
                      className="btn btn-secondary btn-md px-11 m-1"
                    >
                      Editar
                    </button>
                    
                    <button onClick={() => handleDelete(normativa.id)} className="btn btn-error btn-md px-11 m-1">Eliminar</button>
                  </>
                ) : (
                  <a
                    href={`document/${normativa.id}`}
                    className="btn btn-primary btn-md"
                  >
                    Ver Normativa
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto hidden md:block rounded-box border border-base-content/5 bg-base-100">
          <table className="table-md">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-4">Número</th>
                <th className="py-4">Título</th>
                <th className="py-4">Fecha</th>
                <th className="py-4">Dependencia</th>
                <th className="py-4">Emisor</th>
                <th className="py-4">Tipo</th>
                {!ocultarVisitas && <th className="py-4">Visitas</th>}
                <th className="py-4">
                  {isNuevaNormativa ? "Seleccionar" : "Archivo PDF"}
                </th>
              </tr>
            </thead>
            <tbody>
              {normativas?.map((normativa) => (
                <tr
                  className="hover:bg-primary-content odd:bg-[#F7F6FE]"
                  key={normativa.id}
                >
                  <td className="py-9">{normativa.numero}</td>
                  <td className="py-9">{normativa.titulo}</td>
                  <td className="py-9">{normativa.fecha}</td>
                  <td className="py-9">{normativa.dependencia}</td>
                  <td className="py-9">{normativa.emisor}</td>
                  <td className="py-9">{normativa.tipo_normativa}</td>
                  {!ocultarVisitas && (
                    <td className="py-9">{normativa.visitas}</td>
                  )}
                  <td>
                    {isNuevaNormativa ? (
                      isSelected(normativa.id) ? (
                        <button
                          onClick={() => handleDeselect(normativa.id)}
                          className="btn btn-primary btn-md hover:bg-primary hover:text-white py-6"
                        >
                          Deseleccionar
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            openModal({
                              id: normativa.id,
                              titulo: normativa.titulo,
                              numero: normativa.numero,
                            })
                          }
                          className="btn btn-outline btn-md  py-6 hover:bg-primary hover:text-white "
                        >
                          Seleccionar
                        </button>
                      )
                    ): isAdminList ? (
                      <>
                        <a
                        href={`document/${normativa.id}`}
                        className="btn btn-primary btn-md"
                      >
                        Ver Normativa
                      </a>
                      
                      <button 
                      onClick={() => openEditModal(normativa)} 
                      className="btn btn-secondary btn-md  px-11 m-1">
                      Editar</button>
    
                      <button onClick={() => handleDelete(normativa.id)} className="btn btn-error btn-md  px-9 "
                      >Eliminar</button>
    
                      </>
                    )  : (
                      <a
                        href={`/document/${normativa.id}`}
                        className="btn btn-outline btn-md hover:bg-primary hover:text-white py-6"
                      >
                        Ver Normativa
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-40">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-50">
            <h2 className="text-sm font-bold mb-4">Normativa afectada</h2>
            <p className="mb-4 text-sm">{modalData?.titulo}</p>
            <h2 className="text-sm font-bold mb-2">
              Indique el tipo de acción que se aplica sobre esta normativa
            </h2>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="select select-bordered w-full mb-4"
            >
              <option value="">Seleccione una acción</option>
              <option value="Deroga">Derogación</option>
              <option value="Modifica">Modificación</option>
              <option value="Complementa">Complementación</option>
            </select>
            <h2 className="text-sm font-bold mb-2">
              Detalle de la modificación
            </h2>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Escriba sus comentarios aquí..."
              value={selectedComment}
              onChange={(e) => setSelectedComment(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="btn btn-outline btn-md">
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                className="btn btn-primary btn-md"
                disabled={!selectedAction}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center z-40">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
          <div id="editNormativeModal" className="relative bg-white p-6 rounded-lg shadow-lg  overflow-x-auto overflow-y-auto z-50">
            <div className="space-y-4"> 
            <h2 className="text-lg font-bold mb-4">Editar Normativa</h2>
            <div className="flex space-x-4" >
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Número:</label>
              <input
                type="text"
                name="numero"
                value={editModalData?.numero || ""}   
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-1/2">  
              <label className="block text-sm font-medium mb-2">Año:</label>
              <input
                type="text"
                name="anio"
                value={editModalData?.anio || ""}
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
              value={editModalData?.titulo || ""}
              onChange={handleEditChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Resumen:</label>
            <textarea
              name="resumen"
              value={editModalData?.resumen || ""}
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
              value={editModalData?.fecha || ""}
              onChange={handleEditChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dependencia:</label>
            <select
              name="dependencia"
              value={editModalData?.dependencia || ""}
              onChange={handleEditChange}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione</option>
              {dependenciaOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Emisor:</label>
            <select
              name="emisor"
              value={editModalData?.emisor || ""}
              onChange={handleEditChange}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione</option>
              {emisorOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Normativa:</label>
            <select
              name="estado"
              value={editModalData?.tipo_normativa || ""} 
              onChange={handleEditChange}
              className="select select-bordered w-full"
            >
              {tipoNormativaOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 mt-3">Estado:</label>
            <select
              name="estado"
              value={editModalData?.estado || ""} 
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
            name="archivo_pdf"
            onChange={(e) => handleFileChange(e)}
            className="file-input file-input-bordered w-full"
          />
        </div>

          </div>
          </div>   
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeEditModal} className="btn btn-outline btn-md">
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className={`btn btn-primary btn-md ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          ¡Normativa actualizada con éxito!
        </div>
      )}
    </div>
  );
}

Table.propTypes = {
  normativas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      numero: PropTypes.string.isRequired,
      titulo: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      dependencia: PropTypes.string.isRequired,
      emisor: PropTypes.string.isRequired,
      tipo_normativa: PropTypes.string.isRequired,
      visitas: PropTypes.number.isRequired,
      onSeleccionarNormativas: PropTypes.func.isRequired,
    })
  ).isRequired,
  onSeleccionarNormativas: PropTypes.func.isRequired,
  onDeseleccionarNormativas: PropTypes.func.isRequired,
  normativasSeleccionadas: PropTypes.array,
};

export default Table;

import PropTypes from "prop-types";
import { useLocation } from "react-router";
import { useState } from "react";

function Table({ normativas, onSeleccionarNormativas,  normativasSeleccionadas = [], onDeseleccionarNormativas }) {
  const location = useLocation();
  const isNuevaNormativa =
    location.pathname === "/administracion" &&
    new URLSearchParams(location.search).get("option") === "Nueva Normativa";

  const ocultarVisitas =
    location.pathname === "/busqueda" || isNuevaNormativa;

  const [modalData, setModalData] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedComment, setSelectedComment] = useState("");
  const [showModal, setShowModal] = useState(false);

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


  return (
    <div className="justify-center flex items-center">
      <div className="w-auto text-neutral text-center rounded-lg">
        <div className="grid grid-cols-1 md:hidden gap-4">
          {normativas?.map((normativa) => (
            <div
              key={normativa.id}
              className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800">{normativa.titulo}</h2>
              <div className="space-y-2 mt-2">
                <p className="text-sm text-gray-600"><strong>Número:</strong> {normativa.numero}</p>
                <p className="text-sm text-gray-600"><strong>Fecha:</strong> {normativa.fecha}</p>
                <p className="text-sm text-gray-600"><strong>Dependencia:</strong> {normativa.dependencia}</p>
                <p className="text-sm text-gray-600"><strong>Emisor:</strong> {normativa.emisor}</p>
                <p className="text-sm text-gray-600"><strong>Tipo:</strong> {normativa.tipo_normativa}</p>
                {!ocultarVisitas && <p className="text-sm text-gray-600"><strong>Visitas:</strong> {normativa.visitas}</p>}
              </div>
              <div className="flex justify-center mt-4">
                {isNuevaNormativa ? (
                  isSelected(normativa.id) ? (
                    <button
                      onClick={() => handleDeselect(normativa.id)}
                      className="btn btn-secondary btn-md "
                    >
                      Deseleccionar
                    </button>
                  ) : (
                    <button
                      onClick={() => openModal({ id: normativa.id, titulo: normativa.titulo })}
                      className="btn btn-primary btn-md"
                    >
                      Seleccionar
                    </button>
                  )
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
                <th className="py-4">{isNuevaNormativa ? "Seleccionar" : "Archivo PDF"}</th>
              </tr>
            </thead>
            <tbody>
              {normativas?.map((normativa) => (
                <tr className="hover:bg-primary-content odd:bg-[#F7F6FE]" key={normativa.id}>
                  <td className="py-9">{normativa.numero}</td>
                  <td className="py-9">{normativa.titulo}</td>
                  <td className="py-9">{normativa.fecha}</td>
                  <td className="py-9">{normativa.dependencia}</td>
                  <td className="py-9">{normativa.emisor}</td>
                  <td className="py-9">{normativa.tipo_normativa}</td>
                  {!ocultarVisitas && <td className="py-9">{normativa.visitas}</td>}
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
                          onClick={() => openModal({ id: normativa.id, titulo: normativa.titulo, numero: normativa.numero })}
                          className="btn btn-outline btn-md  py-6 hover:bg-primary hover:text-white "
                        >
                          Seleccionar
                        </button>
                      )
                    ) : (
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
            <h2 className="text-sm font-bold mb-2">Indique el tipo de acción que se aplica sobre esta normativa</h2>
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
            <h2 className="text-sm font-bold mb-2">Detalle de la modificación</h2>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Escriba sus comentarios aquí..."
              value={selectedComment}
              onChange={(e) => setSelectedComment(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="btn btn-outline btn-md">Cancelar</button>
              <button onClick={handleAccept} className="btn btn-primary btn-md" disabled={!selectedAction}>
                Aceptar
              </button>
            </div>
          </div>
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
//Este componente es un modal que permite la visualizacion y seleccion de normativas_modificadas.
import PropTypes from "prop-types";

function SelectNormativaModal({
  modalData,
  selectedAction,
  selectedComment,
  onChangeAction,
  onChangeComment,
  onCancel,
  onSave,
}) {
  if (!modalData) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-60">
        <h2 className="text-lg font-bold mb-4">Agregar Acción y Comentario</h2>
        <p className="mb-4 text-sm">
          <strong>Normativa:</strong> {modalData?.numero} - {modalData?.titulo}
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Acción:</label>
          <select
            value={selectedAction}
            onChange={(e) => onChangeAction(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Seleccione una acción</option>
            <option value="Deroga">Derogación</option>
            <option value="Modifica">Modificación</option>
            <option value="Complementa">Complementación</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Comentario:</label>
          <textarea
            value={selectedComment}
            onChange={(e) => onChangeComment(e.target.value)}
            className="textarea textarea-bordered w-full"
            placeholder="Escriba un comentario opcional..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="btn btn-outline btn-md">
            Cancelar
          </button>
          <button onClick={onSave} className="btn btn-primary btn-md">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectNormativaModal;

SelectNormativaModal.propTypes = {
  modalData: PropTypes.shape({
    id: PropTypes.number,
    numero: PropTypes.string,
    titulo: PropTypes.string,
  }),
  selectedAction: PropTypes.string.isRequired,
  selectedComment: PropTypes.string.isRequired,
  onChangeAction: PropTypes.func.isRequired,
  onChangeComment: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

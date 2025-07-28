import { useState } from "react";
import NormativaTable from "../../../../components/Table/NormativasTable";
import GenericFilterSearch from "../../../../components/SearchFilter/SearchFilter";
import PropTypes from "prop-types";

function PasoNormativasModificadas({ formData, setFormData, onNext, onBack }) {
  const type = "ListadoNormativa"; // 👈 Este es el tipo que usa NormativaTable para normativas
  const [setFilters] = useState({});

  const handleSearch = (formValues) => {
    setFilters(formValues);
  };

  const ModalSeleccionarNormativa = formData.modalSeleccionarNormativa && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h3 className="font-bold text-lg mb-4">
        Seleccionar normativa:{" "}
        <span className="font-normal">{formData.modalSeleccionarNormativa.titulo}</span>
      </h3>

      <label className="label">Tipo de acción</label>
      <select
        className="select select-bordered w-full"
        value={formData.accionSeleccionada || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, accionSeleccionada: e.target.value }))
        }
      >
        <option value="">Seleccionar</option>
        <option value="1">Modifica</option>
        <option value="2">Deroga</option>
        <option value="3">Complementa</option>
      </select>

      <label className="label mt-4">Comentario</label>
      <textarea
        className="textarea textarea-bordered w-full"
        rows={3}
        placeholder="Escriba un comentario sobre esta acción..."
        value={formData.comentarioSeleccionado || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, comentarioSeleccionado: e.target.value }))
        }
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          className="btn btn-outline"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              modalSeleccionarNormativa: null,
              accionSeleccionada: "",
              comentarioSeleccionado: "",
            }))
          }
        >
          Cancelar
        </button>

        <button
          className="btn btn-primary"
          disabled={!formData.accionSeleccionada}
         onClick={() => {
  const nueva = {
    id: formData.modalSeleccionarNormativa.id,
    titulo: formData.modalSeleccionarNormativa.titulo,
    accion: formData.accionSeleccionada,
    comentario: formData.comentarioSeleccionado || "",
  };

  setFormData((prev) => {
    const nuevasNormativas = [...(prev.normativas_modificadas || []), nueva];
    const { modalSeleccionarNormativa, accionSeleccionada, comentarioSeleccionado, ...rest } = prev;
    return {
      ...rest,
      normativas_modificadas: nuevasNormativas,
    };
  });
}}

        >
          Confirmar selección
        </button>

      </div>
    </div>
  </div>
);


console.log("Datoooos",formData);
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        ¿Su normativa modifica, deroga o complementa a otra?
      </h3>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, cambia_normativa: "SI" })}
          className={`btn ${formData.cambia_normativa === "SI" ? "btn-primary" : "btn-outline"}`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              cambia_normativa: "NO",
              normativas_modificadas: []
            })
          }
          className={`btn ${formData.cambia_normativa === "NO" ? "btn-primary" : "btn-outline"}`}
        >
          No
        </button>
      </div>

      {formData.cambia_normativa === "SI" && (
        
        <>
          <h3 className="text-lg font-semibold">
          Busque y Seleccione la Normativa Modificada
          </h3>
          <GenericFilterSearch type={type} onSearch={handleSearch} />
          <NormativaTable
  type="ListadoNormativa"
  filtros={{ numero: formData.normativa_modificada }}
  onSeleccionar={(item) => {
    const yaSeleccionada = (formData.normativas_modificadas || []).some((n) => n.id === item.id);
    if (yaSeleccionada) {
      // Deseleccionar
      setFormData((prev) => ({
        ...prev,
        normativas_modificadas: prev.normativas_modificadas.filter((n) => n.id !== item.id)
      }));
    } else {
      // Abrir modal
      setFormData((prev) => ({
        ...prev,
        modalSeleccionarNormativa: item,
        accionSeleccionada: "",
        comentarioSeleccionado: "",
      }));
    }
  }}
  formData={formData} // 👈 PASAR formData como prop extra
/>


          
        </>
      )}

      <div className="flex justify-between mt-4">
        <button type="button" onClick={onBack} className="btn btn-outline">
          Volver
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary">
          Siguiente
        </button>
      </div>
      {ModalSeleccionarNormativa}
    </div>
  );
}

PasoNormativasModificadas.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default PasoNormativasModificadas;

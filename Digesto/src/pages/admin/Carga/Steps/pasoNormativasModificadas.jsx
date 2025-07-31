import { useState } from "react";
import NormativaTable from "../../../../components/Table/NormativasTable";
import GenericFilterSearch from "../../../../components/SearchFilter/SearchFilter";
import PropTypes from "prop-types";
import { toAccionText, isChanged, toAccionId } from "../config/mapeo";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";




function ResumenSeleccionadas({ items = [], onEdit, onRemove }) {
  if (!items.length) return null;

  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold mb-3">Normativas seleccionadas</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((n) => (
          <div
            key={n.id}
            className="card bg-base-100 border border-base-content/20 shadow-sm hover:shadow-md transition-all"
          >
            <div className="card-body p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate" title={n.titulo}>
                    {n.titulo}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="badge badge-primary">
                      {toAccionText(n.accion) || "Sin acción"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center shrink-0">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    title="Editar"
                    onClick={() => onEdit(n)}
                  >
                   <PiPencilSimpleLineFill className="text-2xl mb-3 text-grey" />

                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    title="Eliminar"
                    onClick={() => onRemove(n)}
                  >
                     <FaTrash className="text-lg mb-3 text-error"  />
                  </button>
                </div>
              </div>

              {n.comentario ? (
                <p className="text-sm text-base-content/70 mt-2 line-clamp-3">
                  {n.comentario}
                </p>
              ) : (
                <p className="text-sm text-base-content/50 mt-2 italic">
                  Sin comentario
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ResumenSeleccionadas.propTypes = {
  items: PropTypes.array,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

function PasoNormativasModificadas({ formData, setFormData, onNext, onBack }) {
  const type = "ListadoNormativa";
  const [filters,setFilters] = useState({});


const originalesMap = new Map(
   (formData._originalesNormativas || []).map(n => [
     n.id, 
     {
       id_relacion: n.id_relacion,         
       accion: toAccionId(n.accion),
       comentario: n.comentario || "",
     },
   ])
 );


  const handleSearch = (formValues) => {
    setFilters(formValues);
  };

  const abrirModalNueva = (item) => {
    setFormData((prev) => ({
      ...prev,
      modalSeleccionarNormativa: item,
      accionSeleccionada: "",
      comentarioSeleccionado: "",
      editingSelectedId: null, 
    }));
  };

  
  const abrirModalEditar = (seleccionada) => {
  setFormData((prev) => ({
    ...prev,
    modalSeleccionarNormativa: { id: seleccionada.id, titulo: seleccionada.titulo },
    accionSeleccionada: String(toAccionId(seleccionada.accion) || ""),
    comentarioSeleccionado: seleccionada.comentario || "",
    editingSelectedId: seleccionada.id,
  }));
};


 const eliminarSeleccionada = (seleccionada) => {
  const original = originalesMap.get(seleccionada.id);
  const eraOriginal = !!original;
 setFormData((prev) => ({
    ...prev,
    normativas_modificadas: (prev.normativas_modificadas || []).filter(
      (n) => n.id !== seleccionada.id
    ),
normativas_bajas: eraOriginal
     ? [
         ...(prev.normativas_bajas || []),
         original?.id_relacion
           ? { id_relacion: original.id_relacion, estado: "eliminar" } 
           : null,
       ].filter(Boolean)
: (prev.normativas_bajas || []),
  }));
};


const confirmarSeleccion = () => {
  const nueva = {
    id: formData.modalSeleccionarNormativa.id,
    titulo: formData.modalSeleccionarNormativa.titulo,
    accion: toAccionId(formData.accionSeleccionada),
    comentario: formData.comentarioSeleccionado || "",
  };

  setFormData((prev) => {
    const lista = prev.normativas_modificadas || [];
    const esEdicion = !!prev.editingSelectedId;
   const original = originalesMap.get(nueva.id) || null;
   const yaEraOriginal = !!original;

    let estado; 
  if (!yaEraOriginal) estado = "nueva";    
    else if (original && isChanged(original, nueva)) estado = "modificar";
   if (esEdicion) {
     
     const conEstado =
       estado === "modificar" && original?.id_relacion
         ? { ...nueva, estado, id_relacion: original.id_relacion }
         : estado
         ? { ...nueva, estado }
         : { ...nueva };

      const actualizada = lista.map((n) =>
        n.id === prev.editingSelectedId
         ? { ...n, ...conEstado }
          : n
      );
      const {
        modalSeleccionarNormativa,
        accionSeleccionada,
        comentarioSeleccionado,
        editingSelectedId,
        ...rest
      } = prev;
      return { ...rest, normativas_modificadas: actualizada };
    }

    const yaExiste = lista.some((n) => n.id === nueva.id);
 const conEstado =
     estado === "modificar" && original?.id_relacion
       ? { ...nueva, estado, id_relacion: original.id_relacion }
       : estado
       ? { ...nueva, estado }
       : nueva;

    const nuevasNormativas = yaExiste
      ? lista.map((n) => (n.id === nueva.id ? { ...n, ...conEstado } : n))
      : [...lista, conEstado];

    const {
      modalSeleccionarNormativa,
      accionSeleccionada,
      comentarioSeleccionado,
      editingSelectedId,
      ...rest
    } = prev;
    return { ...rest, normativas_modificadas: nuevasNormativas };
  });
};



 const cerrarModal = () =>
  setFormData((prev) => ({
    ...prev,
    modalSeleccionarNormativa: null,
    accionSeleccionada: "",
    comentarioSeleccionado: "",
    editingSelectedId: null,
  }));

  
  const ModalSeleccionarNormativa =
    formData.modalSeleccionarNormativa && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
        <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h3 className="font-bold text-lg mb-4">
            {formData.editingSelectedId ? "Editar normativa" : "Seleccionar normativa"}
            {": "}
            <span className="font-normal">
              {formData.modalSeleccionarNormativa.titulo}
            </span>
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
  <option value="Modifica">Modifica</option>
  <option value="Deroga">Deroga</option>
  <option value="Complementa">Complementa</option>
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
            <button className="btn btn-outline" onClick={cerrarModal}>
              Cancelar
            </button>

            <button
              className="btn btn-primary"
              disabled={!formData.accionSeleccionada}
              onClick={() => {
                confirmarSeleccion();
                cerrarModal();
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );

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
              normativas_modificadas: [],
              normativas_bajas: [],
            })
          }
          className={`btn ${formData.cambia_normativa === "NO" ? "btn-primary" : "btn-outline"}`}
        >
          No
        </button>
      </div>

      {formData.cambia_normativa === "SI" && (
        <>
          <h3 className="text-lg font-semibold">Busque y Seleccione la Normativa Modificada</h3>

          <GenericFilterSearch type={type} onSearch={handleSearch} />

          <NormativaTable
            type="ListadoNormativa"
            filtros={filters}             
            onSeleccionar={(item) => {
              const yaSeleccionada = (formData.normativas_modificadas || []).some(
                (n) => n.id === item.id
              );
              if (yaSeleccionada) {
                eliminarSeleccionada(item);   
              } else {
                abrirModalNueva(item);
              }
            }}
            formData={formData}
          />

          <ResumenSeleccionadas
            items={formData.normativas_modificadas || []}
            onEdit={abrirModalEditar}
            onRemove={eliminarSeleccionada}
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

import { useState, useEffect } from "react";
import NormativaTable from "../../../../components/Table/NormativasTable";
import GenericFilterSearch from "../../../../components/SearchFilter/SearchFilter";
import PropTypes from "prop-types";
import { toAccionText, isChanged, toAccionId } from "../config/mapeo";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";
import { Alert } from "../../../../components/ui/Ui";

function ResumenSeleccionadas({ items = [], onEdit, onRemove }) {
  if (!items.length) return null;

  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold mb-3">Normativas seleccionadas</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((n) => (
          <div
            key={n.id}
            className="card bg-base-100 border border-base-300/70 shadow-sm hover:shadow-md hover:border-primary/40 transition-all rounded-xl"
          >
            <div className="card-body p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate" title={n.titulo}>
                    {n.titulo}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="badge badge-primary badge-outline">
                      {toAccionText(n.accion) || "Sin acción"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center shrink-0 gap-1.5">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs md:btn-sm"
                    title="Editar"
                    onClick={() => onEdit(n)}
                  >
                    <PiPencilSimpleLineFill className="text-base sm:text-lg md:text-xl" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs md:btn-sm text-error"
                    title="Eliminar"
                    onClick={() => onRemove(n)}
                  >
                    <FaTrash className="text-sm sm:text-base md:text-lg" />
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
  const [filters, setFilters] = useState({});
  const [uiError, setUiError] = useState(null);
  const [showErrors, setShowErrors] = useState(false);

  const originalesMap = new Map(
    (formData._originalesNormativas || []).map((n) => [
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
      modalSeleccionarNormativa: {
        id: seleccionada.id,
        titulo: seleccionada.titulo,
      },
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
        : prev.normativas_bajas || [],
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
          n.id === prev.editingSelectedId ? { ...n, ...conEstado } : n
        );
        const {
          // eslint-disable-next-line no-unused-vars     
          modalSeleccionarNormativa,
          // eslint-disable-next-line no-unused-vars     
          accionSeleccionada,
          // eslint-disable-next-line no-unused-vars     
          comentarioSeleccionado,
          // eslint-disable-next-line no-unused-vars     
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
        // eslint-disable-next-line no-unused-vars        
        modalSeleccionarNormativa,
        // eslint-disable-next-line no-unused-vars     
        accionSeleccionada,
        // eslint-disable-next-line no-unused-vars     
        comentarioSeleccionado,
        // eslint-disable-next-line no-unused-vars     
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

  const handleNext = () => {
    setShowErrors(true);

    const decision = formData.cambia_normativa;
    const cantSel = (formData.normativas_modificadas || []).length;

    if (!decision) {
      setUiError({
        type: "decision",
        text: "Seleccioná una opción (Sí o No) para continuar.",
        id: Date.now(), 
      });
      return;
    }
    if (decision === "SI" && cantSel === 0) {
      setUiError({
        type: "seleccion",
        text: "Debés seleccionar al menos una normativa para continuar.",
        id: Date.now(), 
      });
      return;
    }

    setUiError(null);
    setShowErrors(false);
    onNext();
  };

  useEffect(() => {
    const cant = (formData.normativas_modificadas || []).length;
    if (cant > 0 && uiError?.type === "seleccion") {
      setUiError(null);
    }
  }, [formData.normativas_modificadas, uiError?.type]);

  useEffect(() => {
    if (
      uiError?.type === "seleccion" &&
      (formData.normativas_modificadas || []).length > 0
    ) {
      setUiError(null);
    }
  }, [formData.normativas_modificadas, uiError]);

  const ModalSeleccionarNormativa = formData.modalSeleccionarNormativa && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="font-bold text-lg mb-4">
          {formData.editingSelectedId
            ? "Editar normativa"
            : "Seleccionar normativa"}
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
            setFormData((prev) => ({
              ...prev,
              accionSeleccionada: e.target.value,
            }))
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
            setFormData((prev) => ({
              ...prev,
              comentarioSeleccionado: e.target.value,
            }))
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
    <div className="space-y-6 max-w-screen-xl mx-auto min-w-0">
      <div className="rounded-2xl border border-base-300/70 bg-gradient-to-br from-base-200/60 to-base-100 p-4 md:p-7 shadow-sm">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="hidden sm:flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content shadow">
            3
          </div>
          <div className="w-full">
            <h3 className="text-base max-[475px]:text-[15px] md:text-xl font-semibold">
              ¿Su normativa{" "}
              <span className="underline decoration-primary/60">modifica</span>,{" "}
              <span className="underline decoration-primary/60">deroga</span> o{" "}
              <span className="underline decoration-primary/60">
                complementa
              </span>{" "}
              a otra?
            </h3>

            <p className="mt-1.5 text-xs max-[475px]:text-[12px] sm:text-sm text-base-content/70">
              Elegí una opción para continuar. Podés cambiarla más adelante
              antes de verificar.
            </p>

            <div className="mt-3">
              <div className="join join-horizontal w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, cambia_normativa: "SI" });
                    setUiError(null);
                    setShowErrors(false);
                  }}
                  className={`btn join-item max-[475px]:btn-sm w-1/2 sm:w-auto ${
                    formData.cambia_normativa === "SI"
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  Sí
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      cambia_normativa: "NO",
                      normativas_modificadas: [],
                      normativas_bajas: [],
                    });
                    setUiError(null);
                    setShowErrors(false);
                  }}
                  className={`btn join-item max-[475px]:btn-sm w-1/2 sm:w-auto ${
                    formData.cambia_normativa === "NO"
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  No
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="text-xs sm:text-[13px] px-3 py-2 rounded-lg bg-base-200/70 border border-base-300/60">
                  <span className="badge badge-primary mr-2">Modifica</span>
                  Actualiza total o parcialmente otra normativa.
                </div>
                <div className="text-xs sm:text-[13px] px-3 py-2 rounded-lg bg-base-200/70 border border-base-300/60">
                  <span className="badge badge-error mr-2">Deroga</span>
                  Deja sin efecto la normativa anterior.
                </div>
                <div className="text-xs sm:text-[13px] px-3 py-2 rounded-lg bg-base-200/70 border border-base-300/60">
                  <span className="badge badge-info mr-2">Complementa</span>
                  Agrega o precisa contenido sin reemplazarla.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {showErrors && uiError?.type === "decision" && (
  <div className="flex justify-center mt-3 mb-2">
    <Alert key={`decision-${uiError?.id ?? 0}`}  title="Falta elegir una opción" message={uiError.text} error />
  </div>
)}



      {formData.cambia_normativa === "NO" && (
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 md:p-6 text-sm text-base-content/70">
          No se seleccionarán normativas para modificar. Podés continuar con{" "}
          <span className="font-medium text-base-content">Siguiente</span> o
          cambiar tu elección cuando quieras.
        </div>
      )}

      {formData.cambia_normativa === "SI" && (
        <>
          <h3 className="text-base md:text-lg font-semibold">
            Busque y Seleccione la Normativa Modificada
          </h3>

          <div className="rounded-xl border border-base-300/70 bg-base-100 p-3 sm:p-4 md:p-5">
            <GenericFilterSearch
              type={type}
              scope="public"
              onSearch={handleSearch}
            />
          </div>

          <NormativaTable
            type="ListadoNormativa"
            filtros={filters}
            onSeleccionar={(item) => {
              const yaSeleccionada = (
                formData.normativas_modificadas || []
              ).some((n) => n.id === item.id);
              if (yaSeleccionada) {
                eliminarSeleccionada(item);
              } else {
                abrirModalNueva(item);
              }
            }}
            formData={formData}
          />

          
    {showErrors && uiError?.type === "seleccion" && (
      <div className="flex justify-center mt-3 mb-2">
        <Alert key={`decision-${uiError?.id ?? 0}`}  title="Sin normativa seleccionada" message={uiError.text} error />
      </div>
    )}

          <ResumenSeleccionadas
            items={formData.normativas_modificadas || []}
            onEdit={abrirModalEditar}
            onRemove={eliminarSeleccionada}
          />
        </>
      )}

 


      <div className="flex max-[475px]:flex-col max-[475px]:gap-2 justify-between mt-6 pt-4 border-t border-base-300">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-outline max-[475px]:btn-sm"
        >
          Volver
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
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

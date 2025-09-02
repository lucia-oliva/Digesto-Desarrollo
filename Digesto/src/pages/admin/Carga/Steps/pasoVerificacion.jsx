import PropTypes from "prop-types";
import { getLabel, toAccionText as _toAccionText } from "../config/mapeo.js";
import { camposOcultosVerificacion } from "../../Edit/VerificacionIgnoreFields.js";
import { useLocation } from "react-router";

const toAccionTextFallback = (v) => {
  if (v == null) return "—";
  const raw = String(v).trim();
  if (/^\d+$/.test(raw)) {
    const mapa = { 1: "Modifica", 2: "Deroga", 3: "Restablece" };
    return mapa[Number(raw)] ?? raw;
  }
  const s = raw.toLowerCase();
  if (s.includes("derog")) return "Deroga";
  if (s.includes("modif")) return "Modifica";
  if (s.includes("resta")) return "Restablece";
  return raw;
};
const toAccionText = (v) => (_toAccionText ? _toAccionText(v) : toAccionTextFallback(v));

function PasoVerificacion({ formData, onBack, onSubmit }) {
  const location = useLocation();
  const pathSegment = location.pathname
    .split("/")
    .find((s) => s.startsWith("Editar") || s.startsWith("Nuevo"));

  const entidad = pathSegment
    ? pathSegment.replace("Editar", "").replace("Nuevo", "").toLowerCase()
    : null;

  const camposIgnorados = entidad ? (camposOcultosVerificacion[entidad] || []) : [];

  const etiquetas = {
    tipo_normativa: "Tipo de Normativa",
    numero: "Número",
    anio: "Año",
    titulo: "Título",
    cambia_normativa: "¿Esta normativa modifica a otra?",
    email: "Correo",
    password: "Contraseña",
    rol: "Rol de Usuario",
    dependencia: "Dependencia",
    nombre: "Nombre",
    telefono: "Telefono",
    estado: "Estado",
    nombre_completo: "Nombre Completo",
    codificacion: "Codificacion",
    resumen: "Resumen",
    archivo: "Archivo",
    fecha: "Fecha",
    emisor: "Emisor",
    tags: "Palabras Clave",
  };

  const visibles = Object.entries(formData).filter(([key]) => {
    const metas = [
      "modalSeleccionarNormativa",
      "accionSeleccionada",
      "comentarioSeleccionado",
      "normativas_modificadas",
      "editingSelectedId",
      "normativas_bajas",
      "confirmPassword",
    ];
    return !metas.includes(key) && !camposIgnorados.includes(key);
  });

  const normMods = Array.isArray(formData?.normativas_modificadas) ? formData.normativas_modificadas : [];
  const tieneNormMods = normMods.length > 0;

  const renderValor = (key, value) => {
    if (typeof value === "object" && value?.name) return value.name;
    if (Array.isArray(value)) return value.join(", ");
    return getLabel(key, value);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Verifique los datos ingresados:</h3>

      <div className="max-w-6xl mx-auto space-y-6">
     
        <div className="rounded-xl bg-base-100 border border-base-300/70 p-5 sm:p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {visibles.map(([key, value]) => (
              <div key={key} className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide opacity-70">{etiquetas[key] || key}</dt>
                <dd className="mt-1 text-sm break-words whitespace-pre-wrap">
                  {renderValor(key, value) ?? "—"}
                </dd>
              </div>
            ))}

            {formData?.resumen && (
              <div className="sm:col-span-2">
                <dt className="text-[11px] uppercase tracking-wide opacity-70">{etiquetas.resumen}</dt>
                <dd className="mt-1 text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {String(formData.resumen)}
                </dd>
              </div>
            )}
          </dl>
        </div>


        {tieneNormMods && (
          <div className="rounded-xl bg-base-100 border border-base-300/70 p-5 sm:p-6">
            <h4 className="text-base font-semibold mb-3">Normativas modificadas</h4>

          
            <div className="md:hidden space-y-3">
              {normMods.map((n, i) => (
                <div key={i} className="rounded-lg border border-base-300/70 p-3">
                  <div className="text-[11px] uppercase tracking-wide opacity-70">Normativa</div>
                  <div className="text-sm mb-2 break-words">{n?.titulo ?? "—"}</div>

                  <div className="text-[11px] uppercase tracking-wide opacity-70">Acción</div>
                  <div className="mt-1">
                    <span
                      className={`badge ${
                        toAccionText(n?.accion) === "Deroga" ? "badge-error" : "badge-primary"
                      }`}
                    >
                      {toAccionText(n?.accion)}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] uppercase tracking-wide opacity-70">Comentario</div>
                  <div className="text-sm break-words">{n?.comentario ?? "—"}</div>
                </div>
              ))}
            </div>

            {/* Desktop/Tablet: tabla clásica */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-base-300/70">
              <table className="table w-full">
                <thead>
                  <tr className="text-xs">
                    <th className="font-medium">Normativa</th>
                    <th className="font-medium">Acción</th>
                    <th className="font-medium">Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {normMods.map((n, i) => (
                    <tr key={i} className="text-sm align-top">
                      <td className="min-w-56 break-words">{n?.titulo ?? "—"}</td>
                      <td className="min-w-32">
                        <span
                          className={`badge ${
                            toAccionText(n?.accion) === "Deroga" ? "badge-error" : "badge-primary"
                          }`}
                        >
                          {toAccionText(n?.accion)}
                        </span>
                      </td>
                      <td className="min-w-64 break-words">{n?.comentario ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs opacity-70 mt-3">Revisá títulos, acción aplicada y comentarios antes de confirmar.</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          <button type="button" onClick={onBack} className="btn btn-outline">Volver</button>
          <button type="button" onClick={onSubmit} className="btn btn-success">Confirmar y Finalizar</button>
        </div>
      </div>
    </div>
  );
}

PasoVerificacion.propTypes = {
  formData: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PasoVerificacion;

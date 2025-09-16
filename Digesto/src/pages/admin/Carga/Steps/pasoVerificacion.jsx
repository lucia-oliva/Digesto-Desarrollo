import PropTypes from "prop-types";
import { getLabel, toAccionText as _toAccionText } from "../config/mapeo.js";
import { camposOcultosVerificacion } from "../../Edit/VerificacionIgnoreFields.js";
import { useLocation } from "react-router";
import { tipoNormativaOptions, dependenciaOptions, RolOptions, emisorOptions } from "../config/mapeo.js";


const normalize = (s) =>
  String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const toLabel = (options = [], value) => {
  const str = String(value ?? "").trim();
  if (!str) return "—";
  const found = options.find(
    (opt) => String(opt.value) === str || normalize(opt.label) === normalize(str)
  );
  return found?.label ?? str;
};

const OPTIONS_BY_KEY = {
  tipo_normativa: tipoNormativaOptions,
  dependencia: dependenciaOptions,                    
  normativa_interdepartamental: dependenciaOptions, 
  rol: RolOptions,
  emisor: emisorOptions
};

const getBadgeClass = (accion) => {
  const t = toAccionText(accion);
  if (t === "Deroga") return "badge badge-md badge-error";
  if (t === "Complementa") return "badge badge-md badge-info";
  // default
  return "badge badge-md badge-primary";
};

const toAccionTextFallback = (v) => {
  if (v == null) return "—";
  const raw = String(v).trim();
  if (/^\d+$/.test(raw)) {
    const mapa = { 1: "Modifica", 2: "Deroga", 3: "Complementa" };
    return mapa[Number(raw)] ?? raw;
  }
  const s = raw.toLowerCase();
  if (s.includes("derog")) return "Deroga";
  if (s.includes("modif")) return "Modifica";
  if (s.includes("compl")) return "Complementa";
  return raw;
};
const toAccionText = (v) =>
  _toAccionText ? _toAccionText(v) : toAccionTextFallback(v);

function PasoVerificacion({ formData, onBack, onSubmit }) {

  console.log(formData);
  const location = useLocation();
  const pathSegment = location.pathname
    .split("/")
    .find((s) => s.startsWith("Editar") || s.startsWith("Nuevo"));

  const entidad = pathSegment
    ? pathSegment.replace("Editar", "").replace("Nuevo", "").toLowerCase()
    : null;

  const camposIgnorados = entidad
    ? camposOcultosVerificacion[entidad] || []
    : [];

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
    codificacion: "Codificación",
    resumen: "Resumen",
    archivo: "Archivo",
    fecha: "Fecha",
    emisor: "Emisor",
    tags: "Palabras Clave",
    normativa_interdepartamental: "Resolucion Interdepartamental"
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

  const normMods = Array.isArray(formData?.normativas_modificadas)
    ? formData.normativas_modificadas
    : [];
  const tieneNormMods = normMods.length > 0;

const renderValor = (key, value) => {
  if (typeof value === "object" && value?.name) return value.name;
  if (Array.isArray(value)) return value.join(", ");
  const opts = OPTIONS_BY_KEY[key];
  if (opts) return toLabel(opts, value);
  return getLabel(key, value);
};


  return (
    <div className="mt-6">
      <div className="rounded-2xl bg-base-200/40 p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold mb-5 text-center text-base-content">
          Verificá los datos ingresados
        </h3>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="rounded-2xl bg-base-100 border border-base-300 shadow-sm p-5 sm:p-7">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {visibles.map(([key, value]) => (
                <div key={key} className="min-w-0">
                  <dt className="text-[12px] sm:text-xs uppercase tracking-wide text-base-content/50 font-bold">
                    {etiquetas[key] || key}
                  </dt>
                  <dd className="mt-1 text-[15px] sm:text-base leading-6 text-base-content break-words whitespace-pre-wrap">
                    {renderValor(key, value) ?? "—"}
                  </dd>
                </div>
              ))}

              {formData?.resumen && (
                <div className="sm:col-span-2">
                  <dt className="text-[12px] sm:text-xs uppercase tracking-wide text-base-content/50 font-bold">
                    {etiquetas.resumen}
                  </dt>
                  <dd className="mt-1 text-[15px] sm:text-base leading-7 text-base-content whitespace-pre-wrap break-words">
                    {String(formData.resumen)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {tieneNormMods && (
            <div className="rounded-2xl bg-base-100 border border-base-300 shadow-sm p-5 sm:p-7">
              <h4 className="text-lg sm:text-xl font-semibold mb-4 text-base-content">
                Normativas modificadas
              </h4>

              <div className="md:hidden space-y-4">
                {normMods.map((n, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-base-300 p-4 bg-base-200/30"
                  >
                    <div className="text-[12px] font-bold uppercase tracking-wide text-base-content/50">
                      Normativa
                    </div>
                    <div className="text-[15px] leading-6 text-base-content mb-3 break-words">
                      {n?.titulo ?? "—"}
                    </div>

                    <div className="text-[12px] font-bold  uppercase tracking-wide text-base-content/50">
                      Acción
                    </div>
                    <div className="mt-1">
                     
                        <span className={getBadgeClass(n?.accion)}>
  {toAccionText(n?.accion)}
</span>
                    </div>

                    <div className="mt-3 text-[12px] font-bold  uppercase tracking-wide text-base-content/50">
                      Comentario
                    </div>
                    <div className="text-[15px] leading-6 text-base-content break-words">
                      {n?.comentario ?? "—"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto rounded-xl border border-base-300">
                <table className="table w-full">
                  <thead className="bg-base-200/60">
                    <tr className="text-xs text-base-content/80">
                      <th className="font-semibold bg-primary text-white">
                        Normativa
                      </th>
                      <th className="font-semibold bg-primary text-white">
                        Acción
                      </th>
                      <th className="font-semibold bg-primary text-white">
                        Comentario
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {normMods.map((n, i) => (
                      <tr
                        key={i}
                        className="text-[15px] leading-6 align-top text-base-content"
                      >
                        <td className="min-w-56 break-words">
                          {n?.titulo ?? "—"}
                        </td>
                        <td className="min-w-32">
                          <span className={getBadgeClass(n?.accion)}>
  {toAccionText(n?.accion)}
</span>
                        </td>
                        <td className="min-w-64 break-words">
                          {n?.comentario ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
            <button type="button" onClick={onBack} className="btn btn-outline">
              Volver
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="btn btn-success"
            >
              Confirmar y Finalizar
            </button>
          </div>
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

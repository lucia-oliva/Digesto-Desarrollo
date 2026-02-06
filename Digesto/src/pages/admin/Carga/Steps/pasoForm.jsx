import PropTypes from "prop-types";
import { useMemo, useEffect } from "react";
import { camposPorEntidad } from "../config/formFields";
import { CiCircleQuestion } from "react-icons/ci";
import { usePasoForm, shouldShowField } from "./pasoFormLogic";
import { useReferencias } from "../../../../context/referenciasContext";
import { useAuth } from "../../../../context/useAuth";

function PasoForm({
  entidad,
  formData,
  setFormData,
  onNext,
  onBack,
  errores = {},
  setErrores = () => {},
  omitPwdFields = false,
}) {
  const { dependencias, emisores } = useReferencias();
  const { auth } = useAuth();
  const user = auth?.user;
  const isSuperAdmin = user?.tipo_usuario === "SuperAdministrador";
  const esAdminDep = user?.tipo_usuario === "Administrador de Dependencia";
  console.log(user?.tipo_usuario);

  const shouldLockEstado = esAdminDep;
  const userDepNombre = String(user?.dependencia ?? "").trim();

  // opciones base desde contexto
  const depOptions = useMemo(
    () =>
      (dependencias ?? []).map((d) => ({
        label: String(d.nombre ?? d.label ?? "").trim(),
        value: String(d.id ?? d.value ?? "").trim(),
      })),
    [dependencias],
  );

  const emiOptions = useMemo(
    () =>
      (emisores ?? []).map((e) => ({
        label: String(e.nombre ?? e.label ?? "").trim(),
        value: String(e.id ?? e.value ?? "").trim(),
      })),
    [emisores],
  );

  // map nombre -> id para bloquear por nombre
  const DEP_BY_NAME = useMemo(
    () => new Map(depOptions.map((d) => [d.label, d.value])),
    [depOptions],
  );

  const lockedDepValue = !isSuperAdmin
    ? (DEP_BY_NAME.get(userDepNombre) ?? "")
    : "";
  const shouldLockDep = !!lockedDepValue && !isSuperAdmin;

  // campos base por entidad
  const baseCampos = useMemo(() => camposPorEntidad[entidad] || [], [entidad]);

  // si es normativa, agregamos el select extra
  const campos = useMemo(() => {
    if (entidad !== "normativa") return baseCampos;
    return [
      ...baseCampos,
      {
        name: "normativa_interdepartamental",
        label: "Resolución Interdepartamental",
        type: "select",
        fromContext: "dependencia", // <- para unificar con el resto
        required: true,
        placeholder: "Seleccione la dependencia",
      },
    ];
  }, [entidad, baseCampos, depOptions]);

  // forzar la dependencia bloqueada al formData
  useEffect(() => {
    if (shouldLockEstado) {
      setFormData((prev) => {
        const prevVal = String(prev?.estado ?? "");
        if (prevVal === "Despublicada") return prev;
        return { ...prev, estado: "Despublicada" };
      });
    }
    if (shouldLockDep) {
      setFormData((prev) => {
        const prevVal = String(prev?.dependencia ?? "");
        if (prevVal === String(lockedDepValue)) return prev;
        return { ...prev, dependencia: String(lockedDepValue) };
      });
    }
  }, [shouldLockDep, lockedDepValue, setFormData]);

  const {
    tagInput,
    setTagInput,
    handleChange,
    handleTagKeyDown,
    commitTags,
    handleRemoveTag,
    preventImplicitSubmit,
    onSubmit,
    errors,
  } = usePasoForm({
    entidad,
    campos,
    formData,
    setFormData,
    onNext,
    setErrores,
    omitPwdFields,
  });

  // prioridad a errores externos
  const mergedErrors = Object.keys(errores || {}).length ? errores : errors;

  return (
    <form
      className="space-y-4"
      onSubmit={onSubmit}
      onKeyDown={preventImplicitSubmit}
    >
      {campos.map(
        ({
          name,
          label,
          type,
          options,
          required,
          placeholder,
          fromContext,
        }) => {
          if (!shouldShowField({ entidad, formData, omitPwdFields }, name))
            return null;
          const error = mergedErrors[name];

          const commonLabel = (
            <label htmlFor={name} className="block text-sm font-medium mb-1">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          );

          // caso especial tags
          if (entidad === "normativa" && name === "tags") {
            return (
              <div key={name}>
                {commonLabel}
                <input
                  id={name}
                  type="text"
                  placeholder={placeholder || "Separar con coma o Enter"}
                  className="input input-bordered w-full"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => tagInput && commitTags(tagInput)}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${name}-error` : undefined}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {(formData.tags || []).map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      className="badge badge-primary gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(i)}
                        className="ml-1"
                        aria-label={`Quitar tag ${tag}`}
                        title="Quitar"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                {error && (
                  <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                    {error}
                  </p>
                )}
              </div>
            );
          }

          //date- tooltip
          if (type === "date") {
            return (
              <div key={name} className="relative group">
                <div className="flex ">
                  {commonLabel}{" "}
                  <div
                    className="tooltip md:tooltip-right"
                    data-tip="Fecha en la que la normativa se publica oficialmente en el digesto."
                  >
                    <CiCircleQuestion className="ml-1 size-5 cursor-pointer" />
                  </div>{" "}
                </div>
                <input
                  id={name}
                  type="date"
                  name={name}
                  className="input input-bordered w-full"
                  value={formData[name] ?? ""}
                  onChange={handleChange}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${name}-error` : undefined}
                  required={!!required}
                />
                {error && (
                  <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                    {error}
                  </p>
                )}
                <div className="absolute top-0 right-0 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-700 text-white text-xs rounded py-1 px-2">
                    Formato: DD/MM/AAAA
                  </div>
                </div>
              </div>
            );
          }

          // selects
          if (type === "select") {
            let resolvedOptions = [];
            if (fromContext === "dependencia") resolvedOptions = depOptions;
            else if (fromContext === "emisor") resolvedOptions = emiOptions;
            else resolvedOptions = options || [];

            const isDependenciaField = name === "dependencia";
            const isEstadoField = name === "estado";

            const disabled =
              (isDependenciaField && shouldLockDep) ||
              (isEstadoField && shouldLockEstado);

            const value =
              isEstadoField && shouldLockEstado
                ? "despublicado"
                : (formData[name] ?? "");

            return (
              <div key={name}>
                {commonLabel}
                <select
                  id={name}
                  name={name}
                  value={value}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required={disabled ? false : !!required}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${name}-error` : undefined}
                  disabled={disabled}
                >
                  <option value="" disabled>
                    Seleccione
                  </option>
                  {(resolvedOptions || []).map((opt) =>
                    typeof opt === "object" ? (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ) : (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ),
                  )}
                </select>
                {error && (
                  <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                    {error}
                  </p>
                )}
              </div>
            );
          }

          // textarea
          if (type === "textarea") {
            return (
              <div key={name}>
                {commonLabel}
                <textarea
                  id={name}
                  name={name}
                  className="textarea textarea-bordered w-full"
                  placeholder={placeholder || ""}
                  required={!!required}
                  value={formData[name] ?? ""}
                  onChange={handleChange}
                  rows={4}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${name}-error` : undefined}
                />
                {error && (
                  <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                    {error}
                  </p>
                )}
              </div>
            );
          }

          // input normal
          return (
            <div key={name}>
              {commonLabel}
              <input
                id={name}
                type={type}
                name={name}
                placeholder={placeholder || ""}
                className="input input-bordered w-full"
                value={type === "file" ? undefined : (formData[name] ?? "")}
                accept={type === "file" ? "application/pdf" : undefined}
                onChange={handleChange}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                required={!!required}
              />
              {type === "file" && formData[name] && (
                <p className="text-xs text-gray-500 mt-1">
                  Archivo seleccionado:{" "}
                  {formData[name]?.name || String(formData[name])}
                </p>
              )}
              {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                  {error}
                </p>
              )}
            </div>
          );
        },
      )}

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn btn-outline">
          Volver
        </button>
        <button type="submit" className="btn btn-primary">
          Siguiente
        </button>
      </div>
    </form>
  );
}

PasoForm.propTypes = {
  entidad: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  errores: PropTypes.object,
  setErrores: PropTypes.func,
  omitPwdFields: PropTypes.bool,
};

export default PasoForm;

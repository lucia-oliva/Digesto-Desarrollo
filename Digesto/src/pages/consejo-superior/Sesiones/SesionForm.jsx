/* eslint-disable react/prop-types */
// src/components/sesiones/SesionForm.jsx
import { useMemo, useState, useCallback } from "react";

export default function SesionForm({
  title = "",
  subtitle = "",
  initialValues = {},
  fields = [],
  sidebar = [],
  submitLabel = "Guardar",
  onSubmit = async () => {},
  onCancel = () => {},
  loading = false,
  globalError = "",
}) {
  const [values, setValues] = useState(() => ({ ...(initialValues || {}) }));
  const [errs, setErrs] = useState({});

  const setValue = useCallback((key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
    setErrs((e) => ({ ...e, [key]: "" }));
  }, []);

  const fileInfo = useMemo(() => {
    const info = {};
    fields
      .filter((f) => f.type === "fileDrop")
      .forEach((f) => {
        const file = values[f.key];
        if (file) {
          const mb = (file.size / (1024 * 1024)).toFixed(2);
          info[f.key] = `${file.name} • ${mb} MB`;
        } else {
          info[f.key] = "";
        }
      });
    return info;
  }, [fields, values]);

  const validateAll = useCallback(() => {
    const next = {};
    fields.forEach((f) => {
      if (typeof f.validate === "function") {
        const msg = f.validate(values[f.key], values) || "";
        if (msg) next[f.key] = msg;
      }
    });
    setErrs(next);
    return Object.keys(next).length === 0;
  }, [fields, values]);

  const handleDrop = (key, e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (!f) return;
    const cfg = fields.find((x) => x.key === key);
    if (cfg?.accept && !f.type?.includes(cfg.accept.split("/")[1])) {
      setErrs((er) => ({ ...er, [key]: "Tipo de archivo no permitido." }));
      return;
    }
    setValue(key, f);
  };

  const handlePick = (key, e) => {
    const f = e.target.files?.[0] ?? null;
    const cfg = fields.find((x) => x.key === key);
    if (!f) {
      setValue(key, null);
      return;
    }
    if (cfg?.accept && !f.type?.includes(cfg.accept.split("/")[1])) {
      setErrs((er) => ({ ...er, [key]: "Tipo de archivo no permitido." }));
      return;
    }
    setValue(key, f);
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!validateAll()) return;
    await onSubmit(values);
  };

  return (
    <main className="mt-11 min-h-[70vh] bg-base-100 py-10 px-4 sm:px-6 lg:px-8">
      <div
        className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200"
        style={{
          boxShadow:
            "4px 4px 19px 5px rgba(0,0,0,0.06), 0px 10px 15px -3px rgba(0,0,0,0.08)",
        }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500" />

        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          {!!title && (
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
              {title}
            </h1>
          )}
          {!!subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {globalError && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
            {globalError}
          </div>
        )}

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <form onSubmit={submit} className="md:col-span-2 space-y-5">
            {fields.map((f) => {
              if (f.type === "static") {
                return (
                  <div key={f.key} className="text-sm text-gray-800">
                    {typeof f.renderStatic === "function"
                      ? f.renderStatic(values)
                      : null}
                  </div>
                );
              }

              return (
                <div key={f.key}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {f.label}
                  </label>

                
                  {f.type === "text" && (
                    <input
                      type="text"
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValue(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      disabled={f.disabled}
                      className={[
                        "w-full rounded-lg border px-4 py-2 text-black focus:outline-none focus:ring-2",
                        errs[f.key]
                          ? "border-red-300 focus:ring-red-400"
                          : "border-gray-300 focus:ring-primary",
                        f.disabled ? "bg-gray-100 cursor-not-allowed" : "",
                      ].join(" ")}
                    />
                  )}

                  {f.type === "date" && (
                    <input
                      type="date"
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValue(f.key, e.target.value)}
                      disabled={f.disabled}
                      className={[
                        "w-full rounded-lg border px-4 py-2 text-black focus:outline-none focus:ring-2",
                        errs[f.key]
                          ? "border-red-300 focus:ring-red-400"
                          : "border-gray-300 focus:ring-primary",
                        f.disabled ? "bg-gray-100 cursor-not-allowed" : "",
                      ].join(" ")}
                    />
                  )}

                  {f.type === "fileDrop" && (
                    <>
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(f.key, e)}
                        className={[
                          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
                          errs[f.key]
                            ? "border-red-300 bg-red-50/40"
                            : "border-blue-200 bg-blue-50/40 hover:bg-blue-50",
                        ].join(" ")}
                      >
                        <p className="text-sm text-gray-600">
                          Arrastrá tu archivo o{" "}
                          <label className="link text-blue-700 cursor-pointer">
                            buscá un archivo
                            <input
                              type="file"
                              accept={f.accept}
                              onChange={(e) => handlePick(f.key, e)}
                              className="hidden"
                            />
                          </label>
                        </p>
                        {!!f.help && (
                          <p className="text-xs text-gray-500">{f.help}</p>
                        )}
                      </div>

                      {values[f.key] && (
                        <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                          <span className="truncate text-gray-800">{fileInfo[f.key]}</span>
                          <button
                            type="button"
                            className="btn btn-xs"
                            onClick={() => setValue(f.key, null)}
                            disabled={loading}
                          >
                            Quitar
                          </button>
                        </div>
                      )}
                    </>
                  )}

               
                  {errs[f.key] && (
                    <p className="mt-1 text-xs text-red-600">{errs[f.key]}</p>
                  )}
                </div>
              );
            })}

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                className="btn"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${loading ? "loading" : ""}`}
              >
                {loading ? "Enviando…" : submitLabel}
              </button>
            </div>
          </form>

    
          <aside className="space-y-4">
            {sidebar.map((box, i) => (
              <div key={i} className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <h3 className="text-sm font-semibold text-sky-700">
                  {box.title}
                </h3>
                {!!box.items?.length && (
                  <ul className="mt-2 list-disc pl-5 text-xs text-gray-600 space-y-1">
                    {box.items.map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
}

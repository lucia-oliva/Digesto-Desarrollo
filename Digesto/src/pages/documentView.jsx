/* eslint-disable react/prop-types */
import useAxios from "axios-hooks";
import { LuArrowRightToLine } from "react-icons/lu";
import { useMemo, useState } from "react";
import { useLocation, useParams, useNavigate} from "react-router";
import { PdfViewer } from "../components/ui/PdfViewer";
import { Loading } from "../components/ui/Ui";
import { tipoNormativaOptions } from "../pages/admin/Carga/config/mapeo";
import { API_BASE } from "../api/axiosPrivate";

const ACCION_BADGE = {
  1: { label_entrada: "Modificada por", label_salida: "Modifica", className: "badge-warning" },
  2: { label_entrada: "Derogada por",  label_salida: "Deroga",   className: "badge-error" },
  3: { label_entrada: "Complementada por", label_salida: "Complementa", className: "badge-info" },
};

const tipoNormativaLabel = (valor) => {
  if (valor == null || valor === "") return "—";
  const str = String(valor).trim();

  if (/^\d+$/.test(str)) {
    const found = tipoNormativaOptions.find((opt) => String(opt.value) === str);
    return found?.label ?? str;
  }

  const normalize = (s) =>
    String(s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const txt = normalize(str);
  const exact = tipoNormativaOptions.find((opt) => normalize(opt.label) === txt);
  if (exact) return exact.label;

  const starts = tipoNormativaOptions.filter((opt) =>
    normalize(opt.label).startsWith(txt)
  );
  if (starts.length === 1) return starts[0].label;

  return str;
};
function MetaGrid({ normativa }) {
  return (
    <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div className="rounded-lg p-3 sm:p-4 border border-base-200">
        <div className="text-[10px] sm:text-xs uppercase text-gray-500">
          Tipo y número
        </div>
        <div className="text-sm sm:text-base font-medium font-[Montserrat] text-black">
          {tipoNormativaLabel(
            normativa?.tipo_normativa ?? normativa?.id_tipo_normativa
          )}{" "}
          {normativa?.numero ? `N° ${normativa.numero}` : ""}
        </div>
      </div>

      <div className="rounded-lg p-3 sm:p-4 border border-base-200">
        <div className="text-[10px] sm:text-xs uppercase  text-black">
          Emisor
        </div>
        <div className="text-sm sm:text-base font-medium text-black">
          {normativa?.emisor || "—"}
        </div>
      </div>

      <div className="rounded-lg p-3 sm:p-4 border border-base-200">
        <div className="text-[10px] sm:text-xs uppercase text-gray-500">
          Dependencia
        </div>
        <div className="text-sm sm:text-base font-medium text-black">
          {normativa?.dependencia || "—"}
        </div>
      </div>
    </div>
  );
}

function ResumenBlock({ texto, open, onToggle }) {
  return (
    <div className="mt-4 sm:mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base sm:text-lg font-medium text-gray-700">Resumen</h2>
        <button type="button" className="text-xs sm:text-sm link text-black" onClick={onToggle}>
          {open ? "Ver menos" : "Ver más"}
        </button>
      </div>
      <div
        className={` text-black transition-all duration-200 rounded-lg bg-base-100 border border-gray-300 p-3 text-[14px] sm:text-[15px] leading-relaxed ${
          open
            ? "max-h-[50vh] sm:max-h-[60vh] overflow-auto"
            : "max-h-24 sm:max-h-32 overflow-hidden"
        }`}
      >
        {texto || "No se provisto un resumen para esta normativa."}
      </div>
    </div>
  );
}

function AccionesPDF({ pdfUrl, filename }) {
  if (!pdfUrl) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 mt-2 lg:mt-0 w-full lg:w-auto">
      <a
        href={pdfUrl}
        className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
        download={filename || "documento.pdf"}
      >
        Descargar PDF
      </a>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noreferrer"
        className="btn btn-sm sm:btn-md w-full sm:w-auto"
      >
        Abrir en pestaña
      </a>
    </div>
  );
}
function useVariant(forcedVariant) {
  const location = useLocation();
  return useMemo(() => {
    if (forcedVariant && ["admin", "consejo", "public"].includes(forcedVariant)) {
      return forcedVariant;
    }
    if (location.pathname.includes("/admin")) return "admin";
    if (location.pathname.includes("/consejo-superior")) return "consejo";
    return "public";
  }, [forcedVariant, location.pathname]);
}


function DocumentView({ variant = "auto" }) {

  const resolvedVariant = useVariant(variant === "auto" ? undefined : variant);
  const { id } = useParams();
  const navigate = useNavigate();

  const [pdfUrl, setPdfUrl] = useState("");
  const [resumenOpen, setResumenOpen] = useState(false);

  const [{ data: normativa, loading }] = useAxios({
    url: `${API_BASE}/normativa/datos/${id}`,
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const [{ data: vinculosData }] = useAxios({
    url: `${API_BASE}/relaciones/${id}`,
    method: "GET",
  });
  const [{ data: vinculosInvData }] = useAxios({
    url: `${API_BASE}/relaciones/complementaria/${id}`,
    method: "GET",
  });
  
   const vinculosEntrada = vinculosData?.data || [];
  const vinculosSalida  = vinculosInvData?.data || [];

  const isAdmin = resolvedVariant ==="admin";
  const vinculosEntradaVisibles = isAdmin
  ? vinculosEntrada
  : vinculosEntrada.filter((v) => v.comp_estado === "publicado");
  const vinculosSalidaVisibles = isAdmin
  ? vinculosSalida
  : vinculosSalida.filter((v) => v.orig_estado === "publicado");

   const basePath =
    resolvedVariant === "admin"
      ? "/admin/document/"
      : resolvedVariant === "consejo"
      ? "/consejo-superior/document/"
      : "/document/";
      
      const renderCompTexto = (v) => {
    // para los que "modifican a esta": usan comp_*
    const tipo = v.comp_tipo || "Normativa";
    const num =
      v.comp_numero != null
        ? `N° ${v.comp_numero}`
        : `ID ${v.normativa_complementaria}`;
    const anio = v.comp_anio ? `/${v.comp_anio}` : "";
    return `${tipo} ${num}${anio}`;
  };

  const renderOrigTexto = (v) => {
    // para los que "esta modifica": usan orig_*
    const tipo = v.orig_tipo || "Normativa";
    const num =
      v.orig_numero != null ? `N° ${v.orig_numero}` : `ID ${v.normativa_original}`;
    const anio = v.orig_anio ? `/${v.orig_anio}` : "";
    return `${tipo} ${num}${anio}`;
  };


  if (resolvedVariant === "admin") {
    return (
      <div className="min-h-screen flex flex-col gap-3 sm:gap-4 p-2 sm:p-4">
        <aside className="w-full bg-base-100 rounded-xl border border-base-300 p-4 sm:p-6">
          {loading && <Loading />}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1 sm:space-y-2">
  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-500 leading-tight">
    {normativa?.titulo || "—"}
  </h1>
  <p className="text-xs sm:text-sm text-gray-500">{normativa?.fecha || "—"}</p>
  {vinculosEntradaVisibles.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2 ">
      {vinculosEntradaVisibles.map((v) => {
        const meta =
          ACCION_BADGE[v.id_acciones] || {
            label_entrada: "Vinculada por",
            className: "badge-outline",
          };
        return (
          <button
            key={`in-${v.id}`}
            type="button"
            className={`badge ${meta.className} cursor-pointer py-5`}
            onClick={() => navigate(basePath + v.normativa_complementaria)}
            title={v.comp_titulo || undefined}
          >
            {meta.label_entrada} {renderCompTexto(v)}
          </button>
        );
      })}
    </div>
  )}
  {vinculosSalidaVisibles.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {vinculosSalidaVisibles.map((v) => {
        const meta =
          ACCION_BADGE[v.id_acciones] || {
            label_salida: "Modifica a",
            className: "badge-outline",
          };
        return (
          <button
            key={`out-${v.id}`}
            type="button"
            className={`badge ${meta.className} cursor-pointer`}
            onClick={() => navigate(basePath + v.normativa_original)}
            title={v.orig_titulo || undefined}
          >
            {meta.label_salida} {renderOrigTexto(v)}
          </button>
        );
      })}
    </div>
  )}
</div>
            <AccionesPDF pdfUrl={pdfUrl} filename={normativa?.archivo} />
          </div>

          <MetaGrid normativa={normativa} />
          <ResumenBlock
            texto={normativa?.resumen}
            open={resumenOpen}
            onToggle={() => setResumenOpen((v) => !v)}
          />
        </aside>

        <div className="flex-1 flex justify-center px-0 sm:px-2">
          <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl rounded-xl overflow-hidden bg-base-300">
            <PdfViewer filename={normativa?.archivo} pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />
          </div>
        </div>
      </div>
    );
  }
  if (resolvedVariant === "consejo") {
    return (
      <div className="min-h-screen p-0 pt-15">
        <div className="lg:hidden flex flex-col gap-3 sm:gap-4 p-2 sm:p-4">
          <aside className="w-full bg-base-100 rounded-xl border border-base-300 p-4 sm:p-6">
            {loading && <Loading />}

            <div className="mb-2">
              <span className="badge badge-info badge-outline">Consejo Superior</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="space-y-1 sm:space-y-2">
  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-500 leading-tight">
    {normativa?.titulo || "—"}
  </h1>
  <p className="text-xs sm:text-sm text-gray-500">{normativa?.fecha || "—"}</p>
  {vinculosEntradaVisibles.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {vinculosEntradaVisibles.map((v) => {
        const meta =
          ACCION_BADGE[v.id_acciones] || {
            label_entrada: "Vinculada por",
            className: "badge-outline",
          };
        return (
          <button
            key={`in-${v.id}`}
            type="button"
            className={`badge ${meta.className} cursor-pointer`}
            onClick={() => navigate(basePath + v.normativa_complementaria)}
            title={v.comp_titulo || undefined}
          >
            {meta.label_entrada} {renderCompTexto(v)}
          </button>
        );
      })}
    </div>
  )}
  {vinculosSalidaVisibles.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {vinculosSalidaVisibles.map((v) => {
        const meta =
          ACCION_BADGE[v.id_acciones] || {
            label_salida: "Modifica a",
            className: "badge-outline",
          };
        return (
          <button
            key={`out-${v.id}`}
            type="button"
            className={`badge ${meta.className} cursor-pointer`}
            onClick={() => navigate(basePath + v.normativa_original)}
            title={v.orig_titulo || undefined}
          >
            {meta.label_salida} {renderOrigTexto(v)}
          </button>
        );
      })}
    </div>
  )}
</div>
              <AccionesPDF pdfUrl={pdfUrl} filename={normativa?.archivo} />
            </div>

            <MetaGrid normativa={normativa} />
            <ResumenBlock
              texto={normativa?.resumen}
              open={resumenOpen}
              onToggle={() => setResumenOpen((v) => !v)}
            />
          </aside>

          <div className="flex-1 flex justify-center px-0 sm:px-2">
            <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl rounded-xl overflow-hidden bg-base-300">
              <PdfViewer filename={normativa?.archivo} pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="drawer drawer-end lg:drawer-open">
            <input id="dv_consejo_drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-stretch justify-start">
              <div className="flex-1 min-h-0 bg-base-300 overflow-hidden">
                <PdfViewer filename={normativa?.archivo} pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />
              </div>
              <label
                htmlFor="dv_consejo_drawer"
                className="btn-custom-reader bg-primary text-primary-content lg:hidden m-3 self-end"
              >
                Open drawer
              </label>
            </div>

            <div className="drawer-side">
              <label
                htmlFor="dv_consejo_drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              />
              <div className="bg-base-200 border-l-2 border-base-300 min-h-full w-96 p-6 overflow-y-auto">
                {loading && <Loading />}

                <div className="flex flex-col gap-4">
                  <div className="flex flex-row justify-between items-center mb-2">
                    <span className="badge badge-info badge-outline">Consejo Superior</span>
                    <label htmlFor="dv_consejo_drawer" className="lg:hidden">
                      <LuArrowRightToLine className="w-6 h-6" size={20} />
                    </label>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-medium text-gray-500">{normativa?.fecha || "—"}</h2>
                    <h1 className="text-2xl font-semibold text-blue-400">
                      {normativa?.titulo || "—"}
                    </h1>
                    <h3 className="text-sm text-gray-500">
                      {tipoNormativaLabel(
                        normativa?.tipo_normativa ?? normativa?.id_tipo_normativa
                      )}{" "}
                      {normativa?.numero ? `N° ${normativa.numero}` : ""}
                    </h3>
                    <p className="text-sm text-gray-500">Emisor: {normativa?.emisor || "—"}</p>
                    <p className="text-sm text-gray-500">
                      Dependencia: {normativa?.dependencia || "—"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Resumen</h4>
                    <p className="text-sm bg-base-100 p-2 rounded-lg font-light text-base-content">
                      {normativa?.resumen || "No se provisto un resumen para esta normativa"}
                    </p>
                  </div>

                  <AccionesPDF pdfUrl={pdfUrl} filename={normativa?.archivo} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-0">
      <div className="lg:hidden flex flex-col gap-3 sm:gap-4 p-2 sm:p-4">
        <aside className="w-full bg-base-100 rounded-xl border border-base-300 p-4 sm:p-6">
          {loading && <Loading />}
          <div className="flex flex-col gap-3">
<div className="space-y-1 sm:space-y-2">
  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-500 leading-tight">
    {normativa?.titulo || "—"}
  </h1>
  <p className="text-xs sm:text-sm text-gray-500">{normativa?.fecha || "—"}</p>
  {vinculosEntradaVisibles.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {vinculosEntradaVisibles.map((v) => {
        const meta =
          ACCION_BADGE[v.id_acciones] || {
            label_entrada: "Vinculada por",
            className: "badge-outline",
          };
        return (
          <button
            key={`in-${v.id}`}
            type="button"
            className={`badge ${meta.className} cursor-pointer`}
            onClick={() => navigate(basePath + v.normativa_complementaria)}
            title={v.comp_titulo || undefined}
          >
            {meta.label_entrada} {renderCompTexto(v)}
          </button>
        );
      })}
    </div>
  )}
  {vinculosSalidaVisibles.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {vinculosSalidaVisibles.map((v) => {
        const meta =
          ACCION_BADGE[v.id_acciones] || {
            label_salida: "Modifica a",
            className: "badge-outline",
          };
        return (
          <button
            key={`out-${v.id}`}
            type="button"
            className={`badge ${meta.className} cursor-pointer`}
            onClick={() => navigate(basePath + v.normativa_original)}
            title={v.orig_titulo || undefined}
          >
            {meta.label_salida} {renderOrigTexto(v)}
          </button>
        );
      })}
    </div>
  )}
</div>

          <AccionesPDF pdfUrl={pdfUrl} filename={normativa?.archivo} />
          </div>

          <MetaGrid normativa={normativa} />
          <ResumenBlock
            texto={normativa?.resumen}
            open={resumenOpen}
            onToggle={() => setResumenOpen((v) => !v)}
          />
        </aside>

        <div className="flex-1 flex justify-center px-0 sm:px-2">
          <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl rounded-xl overflow-hidden bg-base-300">
            <PdfViewer filename={normativa?.archivo} pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="drawer drawer-end lg:drawer-open">
          <input id="dv_public_drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col items-stretch justify-start">
            <div className="flex-1 min-h-0 bg-base-300 overflow-hidden">
              <PdfViewer filename={normativa?.archivo} pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />
            </div>
            <label
              htmlFor="dv_public_drawer"
              className="btn-custom-reader bg-primary text-primary-content lg:hidden m-3 self-end"
            >
              Open drawer
            </label>
          </div>

          <div className="drawer-side">
            <label htmlFor="dv_public_drawer" aria-label="close sidebar" className="drawer-overlay" />
            <div className="bg-base-200 border-l-2 border-base-300 min-h-full w-96 p-6 overflow-y-auto">
              {loading && <Loading />}

              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center mb-2">
                  <label htmlFor="dv_public_drawer" className="lg:hidden">
                    <LuArrowRightToLine className="w-6 h-6" size={20} />
                  </label>
                  <h2 className="text-lg font-medium font-sans text-gray-500">
                    {normativa?.fecha || "—"}
                  </h2>
                </div>

                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-semibold text-blue-400">
                    {normativa?.titulo || "—"}
                  </h1>
                  <div className="space-y-1 sm:space-y-2">
  {vinculosEntradaVisibles.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {vinculosEntradaVisibles.map((v) => {
        const meta =
          ACCION_BADGE[v.id_acciones] || {
            label_entrada: "Vinculada por",
            className: "badge-outline",
          };
        return (
          <button
            key={`in-${v.id}`}
            type="button"
            className={`badge ${meta.className} cursor-pointer`}
            onClick={() => navigate(basePath + v.normativa_complementaria)}
            title={v.comp_titulo || undefined}
          >
            {meta.label_entrada} {renderCompTexto(v)}
          </button>
        );
      })}
    </div>
  )}

  {vinculosSalidaVisibles.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {vinculosSalidaVisibles.map((v) => {
        const meta =
          ACCION_BADGE[v.id_acciones] || {
            label_salida: "Modifica a",
            className: "badge-outline",
          };
        return (
          <button
            key={`out-${v.id}`}
            type="button"
            className={`badge ${meta.className} cursor-pointer`}
            onClick={() => navigate(basePath + v.normativa_original)}
            title={v.orig_titulo || undefined}
          >
            {meta.label_salida} {renderOrigTexto(v)}
          </button>
        );
      })}
    </div>
  )}
</div>

                  <h2 className="text-lg font-medium font-sans text-gray-500">
                    Emisor: {normativa?.emisor || "—"}
                  </h2>
                </div>

                <h3 className="text-lg font-sans font-medium text-gray-500">
                  {tipoNormativaLabel(
                    normativa?.tipo_normativa ?? normativa?.id_tipo_normativa
                  )}{" "}
                  {normativa?.numero ? `N° ${normativa.numero}` : ""} <br />
                </h3>

                <h2 className="text-lg font-medium font-sans text-gray-500">Resumen</h2>

                <p className="text-lg bg-base-100 p-2 rounded-lg font-light text-base-content">
                  {normativa?.resumen || "No se provisto un resumen para esta normativa"}
                </p>

                <AccionesPDF pdfUrl={pdfUrl} filename={normativa?.archivo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentView;

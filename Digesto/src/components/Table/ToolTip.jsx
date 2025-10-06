import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BiSolidShow } from "react-icons/bi";


function cortarResumen(texto, maxOraciones = 3, maxPalabras = 60) {
  const t = String(texto ?? "").trim();
  if (!t) return "...";
  const oraciones = t.match(/[^.!?]+[.!?]?/g) || [t];
  let seleccionado = oraciones.slice(0, maxOraciones).join(" ").trim();
  const palabrasSel = seleccionado.split(/\s+/);
  if (palabrasSel.length > maxPalabras) {
    seleccionado = palabrasSel.slice(0, maxPalabras).join(" ");
  }
  return `${seleccionado}...`;
}
function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }
function useIsSmallScreen(max = 1024) {
  const [isSmall, setIsSmall] = useState(
    typeof window !== "undefined" ? window.innerWidth <= max : false
  );
  useEffect(() => {
    const handler = () => setIsSmall(window.innerWidth <= max);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [max]);
  return isSmall;
}

/* ===== Componente ===== */
// eslint-disable-next-line react/prop-types
export default function ResumenTooltip({ texto, onVerMas, avoidOverlapSelector = ".table-pagination" }) {
  const contRef = useRef(null);
  const tipRef = useRef(null);
  const [abierto, setAbierto] = useState(false);

  // Desktop coords
  const [coords, setCoords] = useState({ top: 0, left: 0, place: "bottom" });

  const closeTimerRef = useRef(null);
  const isSmall = useIsSmallScreen(1024);

  const textoSeguro = String(texto ?? "").trim();
  const tieneTexto = textoSeguro.length > 0;
  const palabras = textoSeguro.split(/\s+/);
  const truncado = palabras.length > 3 ? palabras.slice(0, 2).join(" ") + "..." : textoSeguro;
  const preview = cortarResumen(textoSeguro, 3, 60);

  /* ===== Desktop: calcular posición FIXED con flip + clamp (via portal) ===== */
  useLayoutEffect(() => {
    if (!abierto || !contRef.current || isSmall) return;

    const placeTooltip = () => {
      const anchor = contRef.current.getBoundingClientRect();
      const margin = 8;
      const width = 300;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      let top = anchor.bottom + margin;
      let left = clamp(anchor.right - width, 8, vw - width - 8);
      let place = "bottom";

      const tipH = tipRef.current?.offsetHeight ?? 0;
      const projectedBottom = top + tipH;

      const pagEl = avoidOverlapSelector ? document.querySelector(avoidOverlapSelector) : null;
      if (pagEl && tipH > 0) {
        const pagRect = pagEl.getBoundingClientRect();
        const overlap =
          top < pagRect.bottom &&
          projectedBottom > pagRect.top &&
          anchor.left < pagRect.right &&
          anchor.right > pagRect.left;
        if (overlap) {
          const aboveTop = anchor.top - margin - tipH;
          if (aboveTop >= 8) {
            top = aboveTop;
            place = "top";
          }
        }
      }

      top = clamp(top, 8, vh - 8);
      left = clamp(left, 8, vw - width - 8);

      setCoords({ top, left, place });
    };

    placeTooltip();
    const onScrollOrResize = () => placeTooltip();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize, true);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize, true);
    };
  }, [abierto, isSmall, avoidOverlapSelector]);

  /* ===== Cerrar al click fuera ===== */
  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e) => {
      const insideAnchor = contRef.current?.contains(e.target);
      const insideTip = tipRef.current?.contains(e.target);
      if (!insideAnchor && !insideTip) setAbierto(false);
    };
    document.addEventListener("click", cerrar, true);
    return () => document.removeEventListener("click", cerrar, true);
  }, [abierto]);

  return (
    <div
      ref={contRef}
      className="relative group max-w-[260px]"
      onMouseEnter={() => {
        if (!tieneTexto || isSmall) return; // en mobile no usamos hover
        clearTimeout(closeTimerRef.current);
        setAbierto(true);
      }}
      onMouseLeave={() => {
        if (isSmall) return;
        closeTimerRef.current = setTimeout(() => setAbierto(false), 120);
      }}
    >
      {/* Trigger distinto en mobile/tablet vs desktop */}
      {isSmall ? (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="btn btn-xs btn-"
        >
           <BiSolidShow className="text-lg"/> VER
        </button>
      ) : (
        <div
          className="truncate cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (tieneTexto) setAbierto((v) => !v);
          }}
        >
          {tieneTexto ? truncado : <span className="text-gray-400 italic">Sin resumen</span>}
        </div>
      )}

      {/* ===== Render ===== */}
      {abierto && tieneTexto && createPortal(
        isSmall ? (
          /* ---------- MOBILE/TABLET: cajita fija abajo ---------- */
          <div
            ref={tipRef}
            className="fixed bottom-0 inset-x-0 z-[2000] bg-white border-t p-4 shadow-lg"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            <div className="whitespace-pre-wrap">{preview}</div>
            {typeof onVerMas === "function" && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onVerMas(); }}
                className="btn btn-primary btn-sm mt-3 w-full"
              >
                Ver más
              </button>
            )}
          </div>
        ) : (
          /* ---------- DESKTOP: tooltip FIXED ---------- */
          <div
            ref={tipRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: 300,
              zIndex: 2000,
            }}
            className="bg-white border border-gray-300 p-2 shadow-lg text-xs rounded-md
                       max-h-[60vh] overflow-y-auto"
            data-place={coords.place}
          >
            <div className="whitespace-pre-wrap">{preview}</div>
            {typeof onVerMas === "function" && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onVerMas(); }}
                className="group mt-2 inline-flex items-center gap-1
                           btn btn-sm btn-ghost text-primary no-underline
                           hover:bg-primary/10 focus:outline-none focus-visible:ring-2
                           focus-visible:ring-primary/40 rounded-md"
              >
                Ver más
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </button>
            )}
          </div>
        ),
        document.body
      )}
    </div>
  );
}

/* eslint-disable react/prop-types */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BiSolidShow } from "react-icons/bi";
import useIsSmallScreen from "./hooks/useIsSmallScreen";
import { cortarResumen, clamp } from "./utils/resumenTooltipUtils";
import ResumenTooltipMobile from "./components/ResumenTooltipMobile";
import ResumenTooltipDesktop from "./components/ResumenTooltipDesktop";

export default function ResumenTooltip({
  texto,
  onVerMas,
  avoidOverlapSelector = ".table-pagination",
}) {
  const contRef = useRef(null);
  const tipRef = useRef(null);
  const [abierto, setAbierto] = useState(false);

  const [coords, setCoords] = useState({ top: 0, left: 0, place: "bottom" });

  const closeTimerRef = useRef(null);
  const isSmall = useIsSmallScreen(1024);

  const textoSeguro = String(texto ?? "").trim();
  const tieneTexto = textoSeguro.length > 0;
  const palabras = textoSeguro.split(/\s+/);
  const truncado =
    palabras.length > 3 ? palabras.slice(0, 2).join(" ") + "..." : textoSeguro;
  const preview = cortarResumen(textoSeguro, 3, 60);

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

      const pagEl = avoidOverlapSelector
        ? document.querySelector(avoidOverlapSelector)
        : null;

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
        if (!tieneTexto || isSmall) return;
        clearTimeout(closeTimerRef.current);
        setAbierto(true);
      }}
      onMouseLeave={() => {
        if (isSmall) return;
        closeTimerRef.current = setTimeout(() => setAbierto(false), 120);
      }}
    >
      {isSmall ? (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="btn btn-xs btn-"
        >
          <BiSolidShow className="text-lg" /> VER
        </button>
      ) : (
        <div
          className="truncate cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (tieneTexto) setAbierto((v) => !v);
          }}
        >
          {tieneTexto ? (
            truncado
          ) : (
            <span className="text-gray-400 italic">Sin resumen</span>
          )}
        </div>
      )}

      {abierto &&
        tieneTexto &&
        createPortal(
          isSmall ? (
            <ResumenTooltipMobile
              tipRef={tipRef}
              preview={preview}
              onVerMas={onVerMas}
            />
          ) : (
            <ResumenTooltipDesktop
              tipRef={tipRef}
              coords={coords}
              preview={preview}
              onVerMas={onVerMas}
            />
          ),
          document.body
        )}
    </div>
  );
}

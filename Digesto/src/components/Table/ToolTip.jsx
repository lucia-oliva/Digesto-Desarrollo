import { useEffect, useLayoutEffect, useRef, useState } from "react";

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

// eslint-disable-next-line react/prop-types
function ResumenTooltip({ texto, onVerMas, avoidOverlapSelector = ".table-pagination" })
 {
  
  const contRef = useRef(null);
  const tipRef = useRef(null);
  const [abierto, setAbierto] = useState(false);
  const [arriba, setArriba] = useState(false);
  const closeTimerRef = useRef(null);

  
  const textoSeguro = String(texto ?? "").trim();
  const tieneTexto = textoSeguro.length > 0;

  
  const palabras = textoSeguro.split(/\s+/);
  const truncado =
    palabras.length > 3 ? palabras.slice(0, 2).join(" ") + "..." : textoSeguro;


  const preview = cortarResumen(textoSeguro, 3, 60);

  useLayoutEffect(() => {
   if (!abierto || !contRef.current || !tipRef.current) return;
    let irArriba = false;
    // Evitar solapar con paginacion
    if (avoidOverlapSelector) {
      const r = contRef.current.getBoundingClientRect();
      const hTip = tipRef.current.getBoundingClientRect().height;
      const margin = 8;
      const pagEl = document.querySelector(avoidOverlapSelector);
      if (pagEl) {
        const pagRect = pagEl.getBoundingClientRect();
        const tipProjectedTop = r.bottom + margin;
        const tipProjectedBottom = tipProjectedTop + hTip;
        const overlapVertical =
          tipProjectedTop < pagRect.bottom && tipProjectedBottom > pagRect.top;
        if (overlapVertical) irArriba = true;
      }
    }
    setArriba(irArriba);
  }, [abierto, textoSeguro, avoidOverlapSelector]);
   

 
  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e) => {
      if (!contRef.current?.contains(e.target)) setAbierto(false);
    };
    document.addEventListener("click", cerrar, true);
    return () => document.removeEventListener("click", cerrar, true);
  }, [abierto]);

  return (
    <div
      ref={contRef}
      className="relative group max-w-[260px] cursor-default"
      onMouseEnter={() => {
        if (!tieneTexto) return;
        clearTimeout(closeTimerRef.current);
        setAbierto(true);
      }}
      onMouseLeave={() => {
        closeTimerRef.current = setTimeout(() => setAbierto(false), 120); //delay
      }}
    >
      
      <div
        className="truncate"
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

      {abierto && tieneTexto && (
        <div
          ref={tipRef}
          className={`absolute z-[49] bg-white border border-gray-300 p-2 shadow-lg w-[300px] text-xs rounded-md right-0 ${
            arriba ? "bottom-full mb-1" : "top-full mt-1"
          } max-h-[60vh] overflow-y-auto`}
        >
          <div className="whitespace-pre-wrap">{preview}</div>

           {typeof onVerMas === "function" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onVerMas(); 
              }}
              className="group mt-2 inline-flex items-center gap-1
                         btn btn-sm btn-ghost text-primary no-underline
                         hover:bg-primary/10
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                         rounded-md"
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
      )}
    </div>
  );
}




export default ResumenTooltip;



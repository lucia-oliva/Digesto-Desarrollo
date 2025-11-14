/* eslint-disable react/prop-types */
export default function ResumenTooltipDesktop({
  tipRef,
  coords,
  preview,
  onVerMas,
}) {
  return (
    <div
      ref={tipRef}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        width: 300,
        zIndex: 2000,
      }}
      className="bg-white border border-gray-300 p-2 shadow-lg text-xs rounded-md max-h-[60vh] overflow-y-auto"
      data-place={coords.place}
    >
      <div className="whitespace-pre-wrap">{preview}</div>

      {typeof onVerMas === "function" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onVerMas();
          }}
          className="group mt-2 inline-flex items-center gap-1 btn btn-sm btn-ghost text-primary no-underline hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"
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
  );
}

/* eslint-disable react/prop-types */
export default function ResumenTooltipMobile({ tipRef, preview, onVerMas }) {
  return (
    <div
      ref={tipRef}
      className="fixed bottom-0 inset-x-0 z-[2000] bg-white border-t p-4 shadow-lg"
      style={{ maxHeight: "60vh", overflowY: "auto" }}
    >
      <div className="whitespace-pre-wrap">{preview}</div>

      {typeof onVerMas === "function" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onVerMas();
          }}
          className="btn btn-primary btn-sm mt-3 w-full"
        >
          Ver más
        </button>
      )}
    </div>
  );
}

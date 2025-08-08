// components/ToolTip.jsx

function ResumenTooltip({ texto }) {
  if (!texto) return <span className="text-gray-400 italic">Sin resumen</span>;

  const palabras = texto.split(" ");
  const primerPalabra = palabras.slice(0, 1).join(" ");
  const truncado = palabras.length > 3 ? primerPalabra + "..." : texto;

  return (
    <div className="relative group max-w-[260px] cursor-default">
      <div className="truncate">{truncado}</div>

      {/* Tooltip al hacer hover */}
      <div className="absolute z-10 hidden group-hover:block bg-white border border-gray-300 p-2 shadow-lg w-[300px] text-xs rounded-md left-0 top-full mt-1">
        {texto}
      </div>
    </div>
  );
}

export default ResumenTooltip;

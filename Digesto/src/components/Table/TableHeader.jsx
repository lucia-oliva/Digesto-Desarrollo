/* eslint-disable react/prop-types */
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

function TableHeader({
  columns,
  showActions,
  sortState,                 // { fecha: "ASC"|"DESC"|null, visitas: "ASC"|"DESC"|null }
  onToggleSort,             // (key, dir) => void
  sortableKeys = [],        // ← si viene [], no hay íconos ni clicks (p.ej. "inicio")
}) {
  const getSortIcon = (key) => {
    if (!sortableKeys.includes(key)) return null;
    const state = sortState?.[key] ?? null;

    const base = "ml-1 text-[14px] transition-colors duration-200 select-none";
    const active = "text-blue-300";
    const inactive = "text-white/60";

    if (!state) return <FaSort className={`${base} ${inactive}`} />;
    if (state === "ASC") return <FaSortUp className={`${base} ${active}`} />;
    return <FaSortDown className={`${base} ${active}`} />;
  };

  const handleClick = (key) => {
    if (!sortableKeys.includes(key)) return;
    const current = sortState?.[key] ?? null;
    const next = current === null ? "ASC" : current === "ASC" ? "DESC" : null;
    onToggleSort?.(key, next);
  };

  return (
    <tr className="bg-gradient-to-r from-primary to-blue-700 text-white text-center font-[Raleway] font-semibold text-base shadow-sm select-none">
      {columns.map((col) => {
        const isSortable = sortableKeys.includes(col.key);
        return (
          <th
            key={col.key}
            className={`py-4 text-center whitespace-nowrap ${isSortable ? "cursor-pointer hover:text-blue-200" : ""}`}
            onClick={() => handleClick(col.key)}
          >
            <div className="flex justify-center items-center gap-1">
              {col.label}
              {getSortIcon(col.key)}
            </div>
          </th>
        );
      })}
      {showActions && (
        <th className="py-4 md:w-[180px] text-center font-[Raleway]">Acciones</th>
      )}
    </tr>
  );
}

export default TableHeader;

/* eslint-disable react/prop-types */
// components/GenericTable/MobileCardList.jsx
import TablePagination from "./TablePagination";

export default function MobileCardList({
  data = [],
  columns = [],
  actions = [],
  page,
  totalPages,
  onPageChange,
  emptyMessage = "No se encontraron resultados. Intentá cambiando los filtros.",
}) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="p-6 text-center text-gray-500">{emptyMessage}</div>;
  }

  const hasTitulo = columns.some((c) => c.key === "titulo");

  return (
    <div className="space-y-4">
      {data.map((item,idx) => (
        <article
          key={item.id || item.id_sesion || `card-${idx}` }
          className="rounded-2xl overflow-hidden border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-md hover:shadow-lg transition-all duration-200"
          
        >
        
          {hasTitulo && item.titulo ? (
            <header className="bg-gradient-to-r from-primary to-blue-700 px-4 py-3">
              <h3 className="font-semibold text-white text-[16px] leading-5">
                {item.titulo}
              </h3>
            </header>
          ) : null}

         
          <div className="px-4 py-3 space-y-2">
            {columns.map((col) => {
              if (col.key === "resumen") return null;

              if (hasTitulo && col.key === "titulo") return null;
              const value = col.render
                ? col.render(item[col.key], item)
                : item[col.key];

              return (
                <div
                  key={col.key}
                  className="flex justify-between items-start bg-white/70  rounded-lg px-3 py-2 border border-blue-100"
                >
                  <span className="text-xs font-medium text-blue-700">
                    {col.label}
                  </span>
                  <div className="text-sm font-medium text-gray-900 text-right max-w-[65%] break-words">
                    {value ?? "—"}
                  </div>
                </div>
              );
            })}
          </div>

       
          {Array.isArray(actions) && actions.length > 0 && (
            <div className="px-4 pb-4 pt-2 bg-blue-50/40 border-t border-blue-100">
              <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))]">
                {actions.map((action) => {
                  const label =
                    typeof action.getLabel === "function"
                      ? action.getLabel(item)
                      : action.label;

                  const type =
                    typeof action.getType === "function"
                      ? action.getType(item)
                      : action.type;

                  const customClass =
                    typeof action.getClassName === "function"
                      ? action.getClassName(item)
                      : action.className || "";

                  const typeClass =
                    customClass ||
                    (type === "primary"
                      ? "btn-primary bg-blue-600 text-white hover:bg-blue-700"
                      : type === "error"
                      ? "btn-error bg-red-500 text-white hover:bg-red-600"
                      : "btn-secondary text-gray-800 hover:bg-gray-300");

                  return (
                    <button
                      key={label + (item.id ?? item.id_sesion ?? "")}
                      className={`btn btn-sm rounded-lg ${typeClass}`}
                      onClick={() => action.onClick(item)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      ))}

  
      {totalPages ? (
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}


function TableRow({ item, columns, actions }) {
  return (
   <tr className="odd:bg-blue-50 even:bg-white hover:bg-blue-100 transition-colors">

      {columns.map((col) => (
        <td key={col.key} className={col.className}>
          {col.render ? col.render(item[col.key], item) : item[col.key]}
        </td>
      ))}

      {actions.length > 0 && (
        <td className="flex flex-col gap-2 py-6">
          {actions.map((action) => {
            const label =
              typeof action.getLabel === "function" ? action.getLabel(item) : action.label;

            const type =
              typeof action.getType === "function" ? action.getType(item) : action.type;

            const customClass =
              typeof action.getClassName === "function"
                ? action.getClassName(item)
                : action.className || "";

            return (
              <button
                key={label + (item.id ?? item.id_sesion ?? "")}
                className={`btn btn-md md:w-[140px] font-[Montserrat] ${
                  customClass
                    ? customClass
                    : type === "primary"
                    ? "btn-primary"
                    : type === "error"
                    ? "btn-error text-white"
                    : "btn-secondary"
                }`}
                onClick={() => action.onClick(item)}
              >
                {label}
              </button>
            );
          })}
        </td>
      )}
    </tr>
  );
}

export default TableRow;

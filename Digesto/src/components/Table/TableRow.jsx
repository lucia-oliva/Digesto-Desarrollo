// components/GenericTable/TableRow.jsx
function TableRow({ item, columns, actions }) {
  
  return (
    <tr className="hover:bg-primary-content odd:bg-[#F7F6FE]">
      {columns.map((col) => (
        <td key={col.key} className={col.className} >
          {col.render ? col.render(item[col.key], item) : item[col.key]}
        </td>
      ))}
      {actions.length > 0 && (
      <td className="flex flex-col gap-2 py-6">
        {actions.map((action) => {
  const label = typeof action.getLabel === "function"
    ? action.getLabel(item)
    : action.label;

    const type = typeof action.getType === "function"
              ? action.getType(item)
              : action.type;


  return (
    <button
      key={label + item.id}
      className={`btn btn-md md:w-[140px] font-[Montserrat] ${
  type === 'primary'
    ? 'btn-primary'
    : type === 'error'
    ? 'btn-error text-white'
    : 'btn-secondary'
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

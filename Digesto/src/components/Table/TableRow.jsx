// components/GenericTable/TableRow.jsx
function TableRow({ item, columns, actions }) {
  
  return (
    <tr className="hover:bg-primary-content odd:bg-[#F7F6FE]">
      {columns.map((col) => (
        <td key={col.key} className={col.className} >
          {col.render ? col.render(item[col.key], item) : item[col.key]}
        </td>
      ))}
      <td className="flex flex-col gap-2 py-6">
        {actions.map((action) => (
          <button
            key={action.label}
            className={`btn btn-md md:w-[140px] font-[Montserrat]  ${
          action.type === 'primary'
            ? 'btn-primary'
            : action.type === 'error'
            ? 'btn-error text-white' 
            : 'btn-secondary'
        }`}
            onClick={() => action.onClick(item)}
          >
            {action.label}
          </button>
        ))}
      </td>
    </tr>
  );
}

export default TableRow;

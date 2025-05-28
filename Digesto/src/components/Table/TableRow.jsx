// components/GenericTable/TableRow.jsx
function TableRow({ item, columns, actions }) {
  return (
    <tr>
      {columns.map((col) => (
        <td key={col.key}>
          {col.render ? col.render(item[col.key], item) : item[col.key]}
        </td>
      ))}
      <td>
        {actions.map((action) => (
          <button
            key={action.label}
            className="btn btn-sm btn-outline"
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

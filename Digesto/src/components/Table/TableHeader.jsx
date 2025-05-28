// components/GenericTable/TableHeader.jsx
function TableHeader({ columns }) {
  return (
    <tr>
      {columns.map((col) => (
        <th key={col.key}>{col.label}</th>
      ))}
      <th>Acciones</th>
    </tr>
  );
}

export default TableHeader;

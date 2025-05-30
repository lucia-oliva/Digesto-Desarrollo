// components/GenericTable/TableHeader.jsx
function TableHeader({ columns }) {
  return (
    <tr className="bg-primary text-white" >
      {columns.map((col) => (
        <th key={col.key} className="py-4" > {col.label}</th>
      ))}
      <th className="py-4">Acciones</th>
    </tr>
  );
}

export default TableHeader;

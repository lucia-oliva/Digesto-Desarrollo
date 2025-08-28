// components/GenericTable/TableHeader.jsx
function TableHeader({ columns, showActions }) {
  return (
    <tr className="bg-gradient-to-r from-primary to-blue-700 text-white text-center font-[Raleway] font-semibold text-base shadow-sm">
      {columns.map((col) => (
        <th key={col.key} className="py-4" > {col.label}</th>
      ))}
      {showActions && (
      <th className="py-4 md:w-[180px] text-center font-[Raleway]">Acciones</th>)}
    </tr>
  );
}

export default TableHeader;

// components/GenericTable/TableHeader.jsx
function TableHeader({ columns, showActions }) {
  return (
    <tr className="bg-primary text-white text-center font-[Raleway] font-bold text-lg" >
      {columns.map((col) => (
        <th key={col.key} className="py-4" > {col.label}</th>
      ))}
      {showActions && (
      <th className="py-4 md:w-[180px] text-center font-[Raleway]">Acciones</th>)}
    </tr>
  );
}

export default TableHeader;

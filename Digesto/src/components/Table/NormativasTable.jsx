import GenericTable from "./GenericTable";
import { normativaColumns } from "./dataTable";
import { useNormativas } from "./useNormativas";

function NormativaTable() {
  const { normativas, page, totalPages, onPageChange, onEdit, onDelete } = useNormativas();

  const actions = [
    { label: "Editar", onClick: onEdit, type:"secondary" },
    { label: "Eliminar", onClick: onDelete, type:"error" },
  ];

  return (
    <GenericTable
      data={normativas}
      columns={normativaColumns}
      actions={actions}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}

export default NormativaTable;

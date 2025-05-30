import { useEffect } from "react";
import GenericTable from "./GenericTable";
import { normativaColumns, usuarioColumns,depenColumns } from "./dataTable";
import { useNormativas } from "./useNormativas";
import { useLocation } from "react-router";

const NormativaTable = ({ type }) => {
  const location = useLocation();
  let tipo = "";
  let columns = [];

  switch (type) {
    case "ListadoNormativa":
      tipo = "normativa";
      columns = normativaColumns;
      break;
    case "ListadoUsuarios":
      tipo = "usuarios";
      columns = usuarioColumns;
      break;
      case "ListadoDependencias":
        tipo = "dependencia";
        columns = depenColumns;
        break;
    default:
      tipo = "";
      columns = [];
      break;
  }

  const {
    normativas,
    page,
    totalPages,
    onPageChange,
    reload,
    onEdit,
    onDelete,
  } = useNormativas(tipo);

  useEffect(() => {
    reload();
  }, [location.pathname]);

  const actions = [
    { label: "Editar", onClick: onEdit, type:"secondary" },
    { label: "Eliminar", onClick: onDelete, type:"error" },
  ];

  console.log(normativas);
  

  return (
    <GenericTable
      data={normativas}
      columns={columns}
      actions={actions}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default NormativaTable;

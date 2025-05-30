import { useEffect } from "react";
import GenericTable from "./GenericTable";
import { useNormativas } from "./useNormativas";
import { useLocation } from "react-router";
import { adminConfig } from "./configTable";

const NormativaTable = ({ type }) => {
  const location = useLocation();
  const { tipo = "", columns = [] } = adminConfig[type] || {};

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

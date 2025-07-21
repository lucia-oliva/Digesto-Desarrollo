import { useEffect } from "react";
import GenericTable from "./GenericTable";
import { useNormativas } from "./useNormativas";
import { useLocation } from "react-router";
import { adminConfig } from "./configTable";

const NormativaTable = ({ type, filtros={}, onSeleccionar }) => {
  const location = useLocation();
  const { tipo = "", columns = [] } = adminConfig[type] || {};
  const isSeleccionarContext = location.pathname.includes("/NuevaNormativa");
  console.log(isSeleccionarContext);
  const {
    normativas,
    page,
    totalPages,
    onPageChange,
    reload,
    onEdit,
    onDelete,
  } = useNormativas(tipo,filtros);

  useEffect(() => {
    reload();
  }, [location.pathname, JSON.stringify(filtros)]);

 

 const actions = isSeleccionarContext
  ? [
      {
        label: "Seleccionar",
        onClick: onSeleccionar,
        type: "primary",
      },
    ]
  : [
      { label: "Editar", onClick: onEdit, type: "secondary" },
      { label: "Eliminar", onClick: onDelete, type: "error" },
    ];

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

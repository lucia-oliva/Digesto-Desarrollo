import { useEffect } from "react";
import {abrirPdfDesdeBlobUrl} from "./AbrirPdf";
import GenericTable from "./GenericTable";
import { useNormativas } from "./useNormativas";
import { useLocation } from "react-router";
import { adminConfig } from "./configTable";

const NormativaTable = ({ type, filtros = {}, onSeleccionar, modo }) => {
  const location = useLocation();
  const { tipo = "", columns = [] } = adminConfig[type] || {};
  const isSeleccionarContext = location.pathname.includes("/NuevaNormativa");
  const {
    normativas,
    page,
    totalPages,
    onPageChange,
    reload,
    onEdit,
    onDelete,
  } = useNormativas(tipo, filtros);  
  
  useEffect(() => {
    reload();
  }, [location.pathname, JSON.stringify(filtros)]);

  const actions =
  type === "ListadoAuditoria" ? [] :
    type === "SesionesConsejo"
      ? [
          {
            label: "Ver Orden",
           onClick: (item) => abrirPdfDesdeBlobUrl(item.orden_url),
            type: "primary",
          },
          {
            label: "Eliminar",
            onClick: onDelete,
            type: "error",
          },
        ]
      : modo === "ver"
      ? [
          {
            label: "Ver PDF",
            onClick: (item) => abrirPdfDesdeBlobUrl(item.archivo),
            type: "primary",
          },
        ]
      : isSeleccionarContext
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
      showActions={type !== "auditoria"}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default NormativaTable;

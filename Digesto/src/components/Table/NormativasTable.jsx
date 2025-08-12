import { useEffect } from "react";
import {abrirPdfDesdeBlobUrl} from "./AbrirPdf";
import GenericTable from "./GenericTable";
import { useNormativas } from "./useNormativas";
import { useLocation,useNavigate  } from "react-router";
import { adminConfig } from "./configTable";
import PropTypes from "prop-types";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";




const NormativaTable = ({ type, filtros = {}, onSeleccionar, modo, formData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tipo = "", columns = [] } = adminConfig[type] || {};
  const isSeleccionarContext = location.pathname.includes("/NuevaNormativa")|| location.pathname.includes("EditarNormativa"); 
  const baseDocPath = location.pathname.startsWith("/admin")
  ? "/admin/document"
  : location.pathname.startsWith("/consejo-superior")
  ? "/consejo-superior/document"
  : "/document";

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
          label: "Ver Acta",
          onClick: (item) => abrirPdfDesdeBlobUrl(item.acta_url),
          type: "primary",
        },
         {
            label: "Editar", // Sin texto
            type: "secondary",
            onClick: onEdit,
          },
          {
            label: "Eliminar",
            type: "error",
            onClick: onDelete,
          },
      ]
    : modo === "ver"
    ? [
        {
          label: "Ver PDF",
          onClick: (item) => navigate(`${baseDocPath}/${item.id}`),
          type: "primary",
        },
      ]
  : isSeleccionarContext
  ? [
      {
        getLabel: (item) =>
          (formData.normativas_modificadas || []).some((n) => n.id === item.id)
            ? "Seleccionado"
            : "Seleccionar",
        onClick: onSeleccionar,
        getType: (item) =>
          (formData.normativas_modificadas || []).some((n) => n.id === item.id)
            ? "secondary"
            : "primary",
      },
    ]

    : [
        { 
        label: "Ver Normativa", 
        onClick: (item) => navigate(`${baseDocPath}/${item.id}`), 
        type: "primary" 
        },
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


NormativaTable.PropTypes = {
   type: PropTypes.any,

}

export default NormativaTable;

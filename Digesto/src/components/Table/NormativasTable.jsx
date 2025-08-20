import { useEffect } from "react";
import { abrirPdfDesdeBlobUrl } from "./AbrirPdf";
import GenericTable from "./GenericTable";
import { useNormativas } from "./useNormativas";
import { useLocation, useNavigate } from "react-router";
import { adminConfig } from "./configTable";
import PropTypes from "prop-types";
import { useAuth } from "../../context/useAuth"; 
import { restoreApi } from "./NormativaApi";

const NormativaTable = ({ type, filtros = {}, onSeleccionar, modo, formData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const user = auth?.user;

  const { tipo = "", columns = [] } = adminConfig[type] || {};

  const isSeleccionarContext =
    location.pathname.includes("/NuevaNormativa") ||
    location.pathname.includes("EditarNormativa");

  const baseDocPath = location.pathname.startsWith("/admin")
    ? "/admin/document"
    : location.pathname.startsWith("/consejo-superior")
    ? "/consejo-superior/document"
    : "/document";

  const filteredColumns = columns.filter(
    (c) => !(Array.isArray(c.hiddenIn) && c.hiddenIn.includes(modo))
  );

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

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdmin = isAdminRoute || modo === "admin";

  

  const actions =
    type === "ListadoAuditoria"
      ? []
      : type === "SesionesConsejo"
      ? (() => {
          const base = [
            {
              label: "Ver Orden",
              onClick: (item) => abrirPdfDesdeBlobUrl(item.orden_url),
              type: "primary",
              className: "btn-outline btn-primary",
            },
            {
              label: "Ver Acta",
              onClick: (item) => abrirPdfDesdeBlobUrl(item.acta_url),
              type: "primary",
              className: "btn-outline btn-primary",
            },
          ];
          if (isAdmin) {
            base.push(
              { label: "Editar", type: "secondary", onClick: onEdit },
              { label: "Eliminar", type: "error", onClick: onDelete }
            );
          }
          return base;
        })()
      : modo === "ver"
      ? [
          {
            label: "Ver PDF",
            onClick: (item) => navigate(`${baseDocPath}/${item.id}`),
            type: "primary",
            className: "btn-outline btn-primary",
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
      : (() => {
          const base = [];

          if (isAdmin) {
            if (tipo === "normativa") {
              base.push({
                label: "Ver Normativa",
                onClick: (item) => navigate(`${baseDocPath}/${item.id}`),
                type: "primary",
                className: "btn-outline btn-primary",
              });
            }
            // Acciones normativas eliminadas
            if (tipo === "normativasEliminadas") {
              base.push({
                  label: "Restaurar",
                  onClick: async (item) => {
                    if (!window.confirm("¿Restaurar la normativa? Volverá a normativas despublicadas.")) return;
                    try {
                      const data = await restoreApi(item.id, user?.id);
                      if (!data.ok && !data.success) {
                        throw new Error(data?.message || "No se pudo restaurar");
                      }
                      reload();
                    } catch (e) {
                      console.error(e);
                      alert("Error al restaurar la normativa");
                    }
                  },
                  type: "secondary",
                }  
              );
            } else {
              // Acciones por defecto
              base.push(
                { label: "Editar", onClick: onEdit, type: "secondary" },
                { label: "Eliminar", onClick: onDelete, type: "error" }
              );
            }
          } else {
            base.push({
              label: "Ver PDF",
              onClick: (item) => navigate(`${baseDocPath}/${item.id}`),
              type: "primary",
              className: "btn-outline btn-primary",
            });
          }

          return base;
        })();

  return (
    <GenericTable
      data={normativas}
      columns={filteredColumns}
      actions={actions}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

NormativaTable.PropTypes = {
  type: PropTypes.any,
};

export default NormativaTable;

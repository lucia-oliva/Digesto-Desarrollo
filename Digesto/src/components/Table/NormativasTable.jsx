import { useEffect, useMemo } from "react";
import { abrirPdfDesdeBlobUrl } from "./AbrirPdf";
import GenericTable from "./GenericTable";
import { useNormativas } from "./useNormativas";
import { useLocation, useNavigate } from "react-router";
import { adminConfig } from "./configTable";
import PropTypes from "prop-types";
import { useAuth } from "../../context/useAuth";
import { restoreApi, publicarApi } from "./NormativaApi";
import { dependenciaOptions } from "../../pages/admin/Carga/config/mapeo";

const NormativaTable = ({ type, filtros = {}, onSeleccionar, modo, formData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const user = auth?.user;
  const tipoUser = auth.user?.tipo_usuario;
  const depName = auth.user?.dependencia; 
  const isSuperAdmin = tipoUser === "SuperAdministrador";
  const isSupervisorCS =
  (tipoUser === "Supervisor" || tipoUser === "Administrador de Dependencia") &&
  depName === "Consejo Superior";
   const DEP_BY_NAME = useMemo(
   () => new Map(dependenciaOptions.map(d => [String(d.label).trim(), String(d.value)])),
   []
 );
   
const userDepId = DEP_BY_NAME.get(String(depName || "").trim()) || user?.id_dependencia || null;
  const path = location.pathname;
  const isAdminRoute      = path.startsWith("/admin");
  const isEditarNormativa = /^\/admin\/EditarNormativa\/\d+$/i.test(path);
  const isNuevaNormativa  = /^\/admin\/NuevaNormativa$/i.test(path);
  

  const effectiveModo =
    modo ??
    (onSeleccionar
      ? "seleccionar"
      : (
          isEditarNormativa ? "crear_edit" :
          isNuevaNormativa  ? "seleccionar" :
          isAdminRoute      ? "admin" :
                              "ver"
        ));

//Bloquear filtro dependencia x rol.
  const filtrosEfectivos = useMemo(() => {
    if (isAdminRoute && effectiveModo !== "seleccionar" && !isSuperAdmin && (userDepId || depName)) {
      return { ...filtros, dependencia: String(userDepId ?? depName) };
    }
    return filtros;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminRoute, effectiveModo, isSuperAdmin, userDepId, depName, JSON.stringify(filtros)]);

   const { tipo = "", columns = [] } = adminConfig[type] || {};

  const baseDocPath = isAdminRoute
    ? "/admin/document"
    : path.startsWith("/consejo-superior")
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
  } = useNormativas(tipo, filtrosEfectivos);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, JSON.stringify(filtrosEfectivos)]);

 
  const filteredColumns = (columns || []).filter(
    (c) => !(Array.isArray(c.hiddenIn) && c.hiddenIn.includes(effectiveModo))
  );

 
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
          if (isAdminRoute || effectiveModo === "admin" || effectiveModo === "crear_edit") {
            base.push(
              { label: "Editar", type: "secondary", onClick: onEdit },
              { label: "Eliminar", type: "error", onClick: onDelete }
            );
          }
          if (isSuperAdmin || isSupervisorCS) {
            base.push({
              label: "Editar Sesión",
              onClick: (item) => navigate(`/consejo-superior/EditarSesion/${item.id_sesion}`),
              type: "success",
              className: "btn btn-info",
            });
          }
          return base;
        })()
      : effectiveModo === "ver"
      ? [
          {
            label: "Ver PDF",
            onClick: (item) => navigate(`${baseDocPath}/${item.id}`),
            type: "primary",
            className: "btn-outline btn-primary",
          },
        ]
      : effectiveModo === "seleccionar"
      ? [
          {
            getLabel: (item) =>
              (formData?.normativas_modificadas || []).some((n) => n.id === item.id)
                ? "Seleccionado"
                : "Seleccionar",
            onClick: onSeleccionar,
            getType: (item) =>
              (formData?.normativas_modificadas || []).some((n) => n.id === item.id)
                ? "secondary"
                : "primary",
          },
        ]
      : (() => {
          const base = [];
          const isAdminLike = isAdminRoute || effectiveModo === "admin" || effectiveModo === "crear_edit";

          if (isAdminLike) {
            if (tipo === "normativa") {
              base.push({
                label: "Ver Normativa",
                onClick: (item) => navigate(`${baseDocPath}/${item.id}`),
                type: "primary",
                className: "btn btn-primary",
              });
            }

            if (tipo === "normativasEliminadas") {
              base.push(
                {
                  label: "Restaurar",
                  onClick: async (item) => {
                    if (!window.confirm("¿Restaurar la normativa? Volverá a normativas despublicadas.")) return;
                    try {
                      const data = await restoreApi(item.id, user?.id);
                      if (!data?.ok && !data?.success) {
                        throw new Error(data?.message || "No se pudo restaurar");
                      }
                      reload();
                    } catch (e) {
                      console.error(e);
                      alert("Error al restaurar la normativa");
                    }
                  },
                  type: "secondary",
                },
                { label: "Editar", onClick: onEdit, type: "primary" },
                {
                  label: "Ver Normativa",
                  onClick: (item) => navigate(`${baseDocPath}/${item.id}`),
                  type: "primary",
                  className: "btn btn-info",
                }
              );
            } else if (tipo === "normativaDespublicadas") {
              base.push(
                {
                  label: "Publicar",
                  onClick: async (item) => {
                    if (!window.confirm("¿Publicar la normativa? Volverá a normativas publicadas.")) return;
                    try {
                      const data = await publicarApi(item.id, user?.id);
                      if (!data?.ok && !data?.success) {
                        throw new Error(data?.message || "No se pudo publicar");
                      }
                      reload();
                    } catch (e) {
                      console.error(e);
                      alert("Error al re-publicar la normativa");
                    }
                  },
                  type: "secondary",
                },
                { label: "Editar", onClick: onEdit, type: "primary" },
                { label: "Eliminar", onClick: onDelete, type: "error" },
                {
                  label: "Ver Normativa",
                  onClick: (item) => navigate(`${baseDocPath}/${item.id}`),
                  type: "primary",
                  className: "btn btn-info",
                }
              );
            } else {
              
              base.push(
                { label: "Editar", onClick: onEdit, type: "secondary" },
                { label: "Eliminar", onClick: onDelete, type: "error" }
              );
            }
          } else {
            // Público
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

NormativaTable.propTypes = {
  type: PropTypes.any,
  filtros: PropTypes.object,
  modo: PropTypes.oneOf(["admin", "ver", "seleccionar", "crear_edit"]),
  onSeleccionar: PropTypes.func,
  formData: PropTypes.object,
};

export default NormativaTable;


import ResumenTooltip from "./ToolTip";

function getDetallePath(id) {
  const path = window.location.pathname || "";
  if (!id) return null;
  if (path.startsWith("/admin")) return `/admin/document/${id}`;
  if (path.startsWith("/consejo-superior")) return `/consejo-superior/document/${id}`;
  return `/document/${id}`; 
}


export function renderResumen(value, row) {
  const to = getDetallePath(row?.id);
  return (
    <ResumenTooltip
      texto={value}
      onVerMas={() => { if (to) window.location.assign(to); }}
    />
  );
}



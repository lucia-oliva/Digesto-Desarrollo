
export const rutasPorEntidad = {
    usuario: "usuarios",
    normativa: "normativa",
    dependencia: "dependencia",
    emisor: "emisores",
    palabraclave: "tag",
}

//aqui cambiar
export const tipoNormativaOptions = [
  { label: "Resolución", value: "5" },
  { label: "Convenio", value: "3" },
  { label: "Ordenanza", value: "1" },
  { label: "Otros", value: "7" }
];


export const RolOptions = [
  { label: "Administrador de Dependencia", value: "2" },
  { label: "Supervisor", value: "4" },
  { label: "SuperAdministrador", value: "1" },
];


export const opcionesPorCampoFijo = {
  tipo_normativa: tipoNormativaOptions,
    rol: RolOptions,
};


export function getRuta(entidad) {
  return rutasPorEntidad[entidad] || entidad;
}


export function getLabelFijo(campo, value) {
  const opciones = opcionesPorCampoFijo[campo];
  if (!opciones) return value;
  const match = opciones.find((opt) => String(opt.value) === String(value));
  return match ? match.label : value;
}

export function toAccionId(accion) {
  if (accion === null || accion === undefined) return null;
  const raw = String(accion).trim().toLowerCase();
  const map = new Map([
    ["1", 1], ["modifica", 1],
    ["2", 2], ["deroga", 2],
    ["3", 3], ["complementa", 3],
  ]);
  return map.get(raw) ?? null;
}

export function toAccionText(accion) {
  const map = { "1": "Modifica", "2": "Deroga", "3": "Complementa" };
  const key = String(accion);
  return map[key] || accion || "";
}

export function isChanged(original = {}, now = {}) {
  const aOrigId = toAccionId(original.accion);
  const aNowId  = toAccionId(now.accion);
  const cOrig = (original.comentario ?? "").trim();
  const cNow  = (now.comentario ?? "").trim();
  return aOrigId !== aNowId || cOrig !== cNow;
}

export function buildRelacionesNormativas(formData = {}) {
  const originales = formData._originalesNormativas || [];

  const originalPorRelacionada = new Map(
    originales.map(o => [
      o.id,
      {
        id_relacion: o.id_relacion,
        accionId: toAccionId(o.accion),
        comentario: o.comentario || "",
      },
    ])
  );

  if (formData.cambia_normativa === "NO") {
    return originales
      .map(o => (o.id_relacion ? { id_relacion: o.id_relacion, estado: "eliminar" } : null))
      .filter(Boolean);
  }

 
  const altasYMods = (formData.normativas_modificadas || []).flatMap(n => {
    const relacionadaId = n.id;
    const now = {
      accionId: toAccionId(n.accion),               
      comentario: n.comentario || "",
    };

    const original = originalPorRelacionada.get(relacionadaId);
    const esOriginal = !!original;

    if (!esOriginal) {
      
      if (!now.accionId) return []; 
      return [{
        id: relacionadaId,
        accion: now.accionId,       
        comentario: now.comentario,
        estado: "nueva",
      }];
    }

    
    const changed = isChanged(
      { accion: original.accionId, comentario: original.comentario },
      { accion: now.accionId,      comentario: now.comentario }
    );
    if (changed || n.estado === "modificar") {
      const id_rel = n.id_relacion || original.id_relacion;
      if (!id_rel || !now.accionId) return [];
      return [{
        id_relacion: id_rel,
        accion: now.accionId,        
        comentario: now.comentario,
        estado: "modificar",
      }];
    }

    return [];
  });

  
  const bajas = (formData.normativas_bajas || [])
    .map(b => {
      const id_rel = b.id_relacion
        || (b.id ? (originalPorRelacionada.get(b.id)?.id_relacion) : null);
      return id_rel ? { id_relacion: id_rel, estado: "eliminar" } : null;
    })
    .filter(Boolean);

  return [...altasYMods, ...bajas];
}

export function findLabelByValue(list = [], value) {
  const v = String(value);
  const match = list.find(o => String(o.value ?? o.id) === v);
  return match ? (match.label ?? match.nombre ?? v) : v;
}

export function findValueByLabel(list = [], label) {
  const l = String(label).trim().toLowerCase();
  const match = list.find(o => String(o.label ?? o.nombre ?? "").trim().toLowerCase() === l);
  return match ? String(match.value ?? match.id) : "";
}
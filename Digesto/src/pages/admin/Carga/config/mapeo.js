
export const rutasPorEntidad = {
    usuario: "usuarios",
    normativa: "normativa",
}

export const tipoNormativaOptions = [
  { label: "Acta", value: "1" },
  { label: "Resolución", value: "2" },
  { label: "Convenio", value: "3" },
  { label: "Nota", value: "4" },
  { label: "Providencia", value: "5" },
  { label: "Ordenanza", value: "6" },
];

export const dependenciaOptions = [
  { label: "Aplicadas", value: "1" },
  { label: "Exactas", value: "2" },
  { label: "Salud", value: "3" },
  { label: "Sociales", value: "4" },
  { label: "Humanas", value: "5" },
  { label: "Consejo Superior", value: "20" },
  { label: "Sede Chepes", value: "22" },
  { label: "Sede Villa Unión", value: "26" },
  { label: "Sede Chamical", value: "25" },
  { label: "Sede Aimogasta", value: "24" },
  { label: "Sede Catuna", value: "23" },
];

export const RolOptions = [
  { label: "Administrador de Dependencia", value: "2" },
  { label: "Supervisor", value: "4" },
  { label: "SuperAdministrador", value: "1" },
];

export const emisorOptions = [
  { label: "Decano", value: "1" },
  { label: "Rector", value: "2" },
  { label: "Consejo Superior", value: "4" },
  { label: "Consejo Directivo", value: "3" },
  { label: "Interdepartamental", value: "5" },
  { label: "Relaciones Institucionales", value: "11" },
];

export const opcionesPorCampo = {
  tipo_normativa: tipoNormativaOptions,
  dependencia: dependenciaOptions,
    emisor: emisorOptions,
    rol: RolOptions,
  // Podés agregar más campos como "emisor", "rol", etc.
};


export function getRuta(entidad) {
  return rutasPorEntidad[entidad] || entidad;
}

export function getLabel(campo, value) {
  const opciones = opcionesPorCampo[campo];
  if (!opciones) return value;
  const match = opciones.find((opt) => opt.value === value);
  return match ? match.label : value;
}
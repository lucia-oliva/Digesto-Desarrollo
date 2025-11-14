export function cortarResumen(texto, maxOraciones = 3, maxPalabras = 60) {
  const t = String(texto ?? "").trim();
  if (!t) return "...";
  const oraciones = t.match(/[^.!?]+[.!?]?/g) || [t];
  let seleccionado = oraciones.slice(0, maxOraciones).join(" ").trim();
  const palabrasSel = seleccionado.split(/\s+/);
  if (palabrasSel.length > maxPalabras) {
    seleccionado = palabrasSel.slice(0, maxPalabras).join(" ");
  }
  return `${seleccionado}...`;
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

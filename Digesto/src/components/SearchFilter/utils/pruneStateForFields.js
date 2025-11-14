export function pruneStateForFields(state, fields) {
  const allowed = new Set(fields.map((f) => f.name));
  const next = {};
  for (const k of Object.keys(state || {})) {
    if (allowed.has(k)) next[k] = state[k];
  }
  return next;
}

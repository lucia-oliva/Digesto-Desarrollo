// src/utils/filtersNamespace.js
export function nsKey({ scope, type, pathname }) {
  return `ns:${scope}:${type}:${pathname}`;
}

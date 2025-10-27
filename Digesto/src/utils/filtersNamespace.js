
export function nsKey({ scope, type, pathname }) {
  return `ns:${scope}:${type}:${pathname}`;
}

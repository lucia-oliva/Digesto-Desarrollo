export function buildDeleteMessage(type) {
  if (type === "tag") return "¿Eliminar Tag?";
  if (type === "usuarios") return "¿Eliminar Usuario?";
  if (type === "dependencia") return "¿Eliminar Dependencia?";
  if (type === "emisores") return "¿Eliminar Emisor?";
  return "¿Eliminar normativa?";
}

export function isResponseOk(response) {
  return (
    (typeof response?.ok === "boolean" && response.ok) ||
    (typeof response?.status === "number" &&
      response.status >= 200 &&
      response.status < 300) ||
    response?.data?.success === true ||
    response?.success === true
  );
}

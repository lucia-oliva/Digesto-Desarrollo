export function httpError(status, publicMessage) {
  const err = new Error(publicMessage || "HTTP error");
  err.status = status;

  if (publicMessage) {
    err.publicMessage = publicMessage;
  }

  return err;
}
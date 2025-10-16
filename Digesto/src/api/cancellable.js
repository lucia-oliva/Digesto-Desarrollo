// src/api/cancellable.js
import api from "./axiosPrivate";

const inflight = new Map(); // ns -> AbortController
const latestReq = new Map(); // ns -> reqId

export async function getWithCancel(ns, url, { params } = {}) {
  // cancela la solicitud anterior del mismo ns
  const prev = inflight.get(ns);
  if (prev) prev.abort();

  const controller = new AbortController();
  inflight.set(ns, controller);

  const reqId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  latestReq.set(ns, reqId);

  try {
    const res = await api.get(url, {
      params,
      signal: controller.signal,
      headers: { "X-Search-NS": ns, "X-Search-ReqId": reqId },
      withCredentials: true,
    });
    // si llegó tarde una respuesta vieja, la ignoramos
    if (latestReq.get(ns) !== reqId) return { cancelled: true };
    return res;
  } catch (err) {
    if (err.name === "CanceledError" || err.name === "AbortError") {
      return { cancelled: true };
    }
    throw err;
  } finally {
    if (inflight.get(ns) === controller) inflight.delete(ns);
  }
}

export function cancelNamespace(ns) {
  const ctrl = inflight.get(ns);
  if (ctrl) ctrl.abort();
  inflight.delete(ns);
}

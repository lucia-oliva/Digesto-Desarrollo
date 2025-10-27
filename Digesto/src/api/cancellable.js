import api from "./axiosPrivate";

const inflight = new Map(); 
const latestReq = new Map(); 

export async function getWithCancel(ns, url, { params } = {}) {
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

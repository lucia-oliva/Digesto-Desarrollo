// src/context/referenciasContext.js
import { createContext, useContext } from "react";


export const ReferenciasCtx = createContext(null);


export function useReferencias() {
  const ctx = useContext(ReferenciasCtx);
  if (!ctx) {
    throw new Error("useReferencias debe usarse dentro de <ReferenciasProvider>");
  }
  return ctx;
}

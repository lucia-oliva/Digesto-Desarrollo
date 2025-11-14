import { useReferencias } from "../../../context/referenciasContext";

export function useContextOptions(fromContext) {
  const { dependencias, emisores } = useReferencias() || {};

  const mapList = (arr) =>
    (arr || []).map((it) => ({
      label: String(it?.nombre ?? it?.label ?? "").trim(),
      value: String(it?.id ?? it?.value ?? "").trim(),
    }));

  switch (fromContext) {
    case "dependencias":
      return mapList(dependencias);
    case "emisores":
      return mapList(emisores);
    default:
      return [];
  }
}

import api from "../../api/axiosPrivate";

export async function abrirPdfDesdeBlobUrl(tipo, id) {
  try {
    const response = await api.get("/file/download", {
      params: { tipo, id },
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch {
    window.alert("No se pudo abrir el PDF. Intente nuevamente.");
  }
}
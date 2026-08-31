import api from "../../api/axiosPrivate";

export async function abrirPdfDesdeBlobUrl(nombreArchivo) {
  try {
    const response = await api.get(
      "/file/download",
      {
        params: { filename: nombreArchivo },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    console.error("Error al abrir el PDF:", error);
  }
}

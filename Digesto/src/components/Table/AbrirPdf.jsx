import axios from "axios";

export async function abrirPdfDesdeBlobUrl(nombreArchivo) {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/file/download",
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

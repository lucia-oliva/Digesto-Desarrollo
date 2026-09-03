import { useEffect, useRef, useState } from "react";
import { Alert, Loading } from "components/ui/Ui";
import propTypes from "prop-types";
import api from "../../api/axiosPrivate";

export function PdfViewer({ filename, pdfUrl, setPdfUrl }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [blobUrl, setBlobUrl] = useState(null);
  const lastBlobUrlRef = useRef(null);

  useEffect(() => {
    if (pdfUrl || !filename) return;

    let cancelled = false;

    const cargarPdf = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/file/download", {
          params: { filename },
          responseType: "blob",
        });

        if (!cancelled) {
          setData(response.data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          console.error(e.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    cargarPdf();

    return () => {
      cancelled = true;
    };
  }, [filename, pdfUrl]);

  // Si este visor descargó el PDF, genera su propia URL.
  useEffect(() => {
    if (!data) return;

    const url = URL.createObjectURL(
      new Blob([data], {
        type: "application/pdf",
      }),
    );

    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(
        lastBlobUrlRef.current,
      );
    }

    lastBlobUrlRef.current = url;

    setBlobUrl(url);
    setPdfUrl?.(url);

    return () => {
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(
          lastBlobUrlRef.current,
        );

        lastBlobUrlRef.current = null;
      }
    };
  }, [data, setPdfUrl]);

  /*
   * Puede usar:
   * - su propio blobUrl, si este visor descargó el PDF;
   * - pdfUrl, si ya fue generado por otro PdfViewer.
   */
  const effectivePdfUrl =
    blobUrl || pdfUrl;

  const showLoading =
    loading && !effectivePdfUrl;

  return (
    <div className="w-full h-full min-h-[60vh] bg-neutral-900 flex flex-col text-neutral-100">
      <div
        className={`flex items-center justify-between px-3 py-2 bg-neutral-800 border-b border-neutral-700 text-xs sm:text-sm ${
          effectivePdfUrl
            ? "hidden"
            : ""
        }`}
      >
        <div className="truncate max-w-[80%]">
          {filename || "Documento PDF"}
        </div>
      </div>

      <div className="flex-1 bg-neutral-900">
        {showLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <Loading />
          </div>
        )}

        {!effectivePdfUrl &&
          error && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <Alert
                title="No se encontró el documento"
                message={error.message}
                error={false}
              />
            </div>
          )}

        {effectivePdfUrl && (
          <iframe
            title={
              filename ||
              "Documento PDF"
            }
            src={effectivePdfUrl}
            className="w-full h-full border-0"
          />
        )}
      </div>
    </div>
  );
}

PdfViewer.propTypes = {
  filename: propTypes.string,
  pdfUrl: propTypes.string,
  setPdfUrl: propTypes.func,
};
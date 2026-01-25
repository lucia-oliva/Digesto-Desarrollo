import useAxios from "axios-hooks";
import { useEffect, useRef, useState } from "react";
import { Alert, Loading } from "components/ui/Ui";
import propTypes from "prop-types";
import { API_BASE } from "../../api/axiosPrivate";

export function PdfViewer({ filename, pdfUrl, setPdfUrl }) {
  const [{ data, loading, error }, fetchPdf] = useAxios(
    {
      url: `${API_BASE}/file/download`,
      method: "GET",
      responseType: "blob",
    },
    { manual: true },
  );

  const [blobUrl, setBlobUrl] = useState(null);
  const lastBlobUrlRef = useRef(null);

  useEffect(() => {
    if (!pdfUrl) return;
    setBlobUrl(pdfUrl);
    setPdfUrl?.(pdfUrl);
  }, [pdfUrl, setPdfUrl]);

  // Si viene pdfUrl , no hace nada
  useEffect(() => {
    if (pdfUrl) return;
    if (!filename) return;

    fetchPdf({ params: { filename } }).catch((e) => {
      console.error(e.message);
    });
  }, [filename, pdfUrl, fetchPdf]);

  // Si NO viene pdfUrl, usamos back
  useEffect(() => {
    if (!data) return;

    const url = URL.createObjectURL(
      new Blob([data], { type: "application/pdf" }),
    );

    if (lastBlobUrlRef.current) URL.revokeObjectURL(lastBlobUrlRef.current);
    lastBlobUrlRef.current = url;

    setBlobUrl(url);
    setPdfUrl?.(url);

    return () => {
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
        lastBlobUrlRef.current = null;
      }
    };
  }, [data, setPdfUrl]);

  const showLoading = loading && !blobUrl && !pdfUrl;

  return (
    <div className="w-full h-full min-h-[60vh] bg-neutral-900 flex flex-col text-neutral-100">
      <div
        className={` flex items-center justify-between px-3 py-2 bg-neutral-800 border-b border-neutral-700 text-xs sm:text-sm ${pdfUrl ? "hidden" : ""} `}
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

        {!pdfUrl && error && (
          <div className="w-full h-full flex items-center justify-center p-4">
            <Alert
              title="No se encontró el documento"
              message={error.message}
              error={false}
            />
          </div>
        )}

        {blobUrl && (
          <iframe
            title={filename || "Documento PDF"}
            src={blobUrl}
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

import useAxios from "axios-hooks";
import { useEffect } from "react";
import { Alert, Loading } from "components/ui/Ui";
import propTypes from "prop-types";

export function PdfViewer({ filename, pdfUrl, setPdfUrl }) {
  const [{ data, loading, error }, fetchPdf] = useAxios(
    {
      url: `http://localhost:3000/api/file/download`,
      method: "GET",
      responseType: "blob",
    },
    { manual: true }
  );
  useEffect(() => {
    if (!filename) return;

    fetchPdf({
      params: {
        filename,
      },
    }).catch((error) => {
      console.error(error.message);
    });
  }, [ filename, fetchPdf]);
  useEffect(() => {
    if (data) {
      const blobUrl = URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      setPdfUrl(blobUrl);

      return () => URL.revokeObjectURL(blobUrl);
    }
  }, [data, setPdfUrl]);

  return (
    <div>
      {loading && <Loading />}
      {error && (
        <Alert
        title="No se encontro el documento "
        message={error.message}
          error={false}
        />
      )}
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          title="PDF"
          className="w-full h-[100vh] block bg-base-300"
        />
      )}
    </div>
  );
}

PdfViewer.propTypes = {
  filename: propTypes.string,
  pdfUrl: propTypes.string,
  setPdfUrl: propTypes.func,
};

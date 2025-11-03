import useAxios from "axios-hooks";
import { useEffect } from "react";
import { Alert, Loading } from "components/ui/Ui";
import propTypes from "prop-types";
import { API_BASE } from "../../api/axiosPrivate";
import { Viewer } from "@react-pdf-viewer/core";
import {defaultLayoutPlugin} from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export function PdfViewer({ filename, pdfUrl, setPdfUrl }) {
  const [{ data, loading, error }, fetchPdf] = useAxios(
    {
      url: `${API_BASE}/file/download`,
      method: "GET",
      responseType: "blob",
    },
    { manual: true }
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
        <Viewer 
        fileUrl={pdfUrl}
        plugins={[defaultLayoutPluginInstance]} />
      )}
    </div>
  );
}

PdfViewer.propTypes = {
  filename: propTypes.string,
  pdfUrl: propTypes.string,
  setPdfUrl: propTypes.func,
};

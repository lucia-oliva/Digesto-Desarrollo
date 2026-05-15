import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { PdfViewer } from "../components/ui/PdfViewer";

export default function HelpPdfView() {
  const [params] = useSearchParams();

  const defaultSrc = "/lorem.pdf";
  const defaultName = "manual_de_ayuda.pdf";

  const pdfSrc = useMemo(
    () => params.get("src") || defaultSrc,
    [params, defaultSrc],
  );

  const filename = useMemo(
    () => params.get("name") || defaultName,
    [params, defaultName],
  );

  const [pdfUrl, setPdfUrl] = useState(pdfSrc);

  useEffect(() => {
    setPdfUrl(pdfSrc);
  }, [pdfSrc]);

  return (
    <div className="h-screen w-screen bg-base-300 overflow-hidden">
      <div className="h-full w-full">
        <PdfViewer filename={filename} pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />
      </div>
    </div>
  );
}

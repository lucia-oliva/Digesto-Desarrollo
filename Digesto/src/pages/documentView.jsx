import useAxios from "axios-hooks";
import { LuArrowRightToLine } from "react-icons/lu";
import { useState } from "react";
import { useParams } from "react-router";
import { PdfViewer } from "../components/ui/PdfViewer";
import { Loading } from "../components/ui/Ui";

//BUG: No se puede scrollear la informacion por lo que no se ve el boton de descarga a veces...

function DocumentView() {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState("");

  const [{ data: normativa, loading }] = useAxios({
    url: `http://localhost:3000/api/normativa/id/${id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return (
    <div className="container">
      <div className="drawer drawer-end fixed lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <PdfViewer
            filename={normativa?.archivo}
            pdfUrl={pdfUrl}
            setPdfUrl={setPdfUrl}
          />
          <label
            htmlFor="my-drawer-2"
            className="btn-custom-reader bg-primary text-primary-content lg:hidden"
          >
            Open drawer
          </label>
        </div>
        <div className="drawer-side not-lg:pt-18">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          >
            {" "}
          </label>
          {loading && <Loading />}
          <div className="flex gap-8 bg-base-200 border-2 border-base-300 rounded-l-md  min-h-full sm:w-96 max-w-screen  p-6">
            <div className="flex flex-col">
              <div className="flex flex-row justify-between lg:justify-end  mb-8 items-center">
                <label htmlFor="my-drawer-2" className="lg:hidden">
                  <LuArrowRightToLine className="w-6 h-6" size={20} />
                </label>
                <h2 className="text-lg font-medium font-sans text-gray-500">
                  {normativa?.fecha}
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-semibold text-blue-400">
                    {normativa?.titulo}
                  </h1>
                  <h2 className="text-lg font-medium font-sans text-gray-500">
                    Emisor: {normativa?.emisor}
                  </h2>
                </div>

                <h3 className="text-lg font-sans font-medium text-gray-500">
                  {normativa?.tipo_normativa} N° {normativa?.numero} <br />
                  {normativa?.dependencia}
                </h3>

                <h2 className="text-lg font-medium font-sans text-gray-500">
                  Resumen
                </h2>

                <p className="text-lg bg-base-100 p-2 rounded-lg font-light text-black overflow-y-auto max-h-60">
                  {normativa?.resumen ||
                    "No se provisto un resumen para esta normativa"}
                </p>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    className="btn btn-primary justify-self-end"
                    download={normativa?.archivo || "documento.pdf"}
                  >
                    Descargar PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentView;

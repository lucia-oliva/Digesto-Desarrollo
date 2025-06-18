import PropTypes from "prop-types";
import { useState } from "react";
import useAxios from "axios-hooks";
import Table from "../../../../components/Table/GenericTable.jsx";
import Pagination from "../../../../components/Table/TablePagination.jsx";

function PasoNormativasModificadas({ formData, setFormData, onNext, onBack }) {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const [totalResults, setTotalResults] = useState(0);

  const [{ loading, error }, refetch] = useAxios(
    {
      url: `http://localhost:3000/api/normativa/search`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { manual: true }
  );

  const handleSearch = (numero) => {
    if (!numero) return;
    refetch({
      data: { numero },
      params: { page: currentPage, limit: resultsPerPage },
    })
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          resultadosBusqueda: res.data.normativas || [],
        }));
        setTotalResults(res.data.totalResults || 0);
      })
      .catch(() => {
        setFormData((prev) => ({ ...prev, resultadosBusqueda: [] }));
        setTotalResults(0);
      });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        ¿Su normativa modifica, deroga o complementa a otra?
      </h3>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() =>
            setFormData({ ...formData, cambia_normativa: "SI" })
          }
          className={`btn ${
            formData.cambia_normativa === "SI" ? "btn-primary" : "btn-outline"
          }`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              cambia_normativa: "NO",
              normativa_modificada: "",
              normativas_modificadas: [],
              resultadosBusqueda: [],
            })
          }
          className={`btn ${
            formData.cambia_normativa === "NO" ? "btn-primary" : "btn-outline"
          }`}
        >
          No
        </button>
      </div>

      {formData.cambia_normativa === "SI" && (
        <div>
          <label className="block text-sm font-medium mt-4 mb-2">
            Ingrese el número de la normativa que es afectada:
          </label>
          <input
            type="text"
            name="normativa_modificada"
            value={formData.normativa_modificada || ""}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((prev) => ({
                ...prev,
                normativa_modificada: value,
              }));
              setCurrentPage(1);
              handleSearch(value);
            }}
            className="input input-bordered w-full mb-3"
          />

          {loading ? (
            <p>Cargando resultados...</p>
          ) : error ? (
            <p className="text-red-500">Error al buscar normativas.</p>
          ) : formData.resultadosBusqueda?.length > 0 ? (
            <>
              <Table
                normativas={formData.resultadosBusqueda}
                normativasSeleccionadas={formData.normativas_modificadas || []}
                onSeleccionarNormativas={(normativa) => {
                  setFormData((prev) => {
                    const yaExiste = prev.normativas_modificadas?.some(
                      (n) => n.id === normativa.id
                    );
                    if (yaExiste) return prev;
                    return {
                      ...prev,
                      normativas_modificadas: [
                        ...(prev.normativas_modificadas || []),
                        normativa,
                      ],
                    };
                  });
                }}
                onDeseleccionarNormativas={(id) => {
                  setFormData((prev) => ({
                    ...prev,
                    normativas_modificadas:
                      prev.normativas_modificadas.filter((n) => n.id !== id),
                  }));
                }}
              />
              <Pagination
                currentPage={currentPage}
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <p className="text-gray-500">No se encontraron normativas.</p>
          )}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button type="button" onClick={onBack} className="btn btn-outline">
          Volver
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary">
          Siguiente
        </button>
      </div>
    </div>
  );
}

PasoNormativasModificadas.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default PasoNormativasModificadas;

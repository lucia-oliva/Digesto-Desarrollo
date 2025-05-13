import PropTypes from "prop-types";
import Table from "../Table.jsx";
import Pagination from "../Pagination.jsx";

function InformacionExtra({
  formData,
  setFormData,
  onBack,
  onNext,
  filteredNormativas,
  loading,
  error,
  handleSearchNormativas,
  currentPage,
  totalResults,
  resultsPerPage,
  onPageChange,
}) {
  const handleNormativaChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      normativa_modificada: value,
    }));
    onPageChange(1); // reset a la primera página
    handleSearchNormativas(value, 1);
  };

  const handleSeleccionarNormativa = (normativa) => {
    setFormData((prev) => {
      const yaExiste = prev.normativas_modificadas?.some((n) => n.id === normativa.id);
      if (yaExiste) {
        return {
          ...prev,
          normativas_modificadas: prev.normativas_modificadas.map((n) =>
            n.id === normativa.id ? normativa : n
          ),
        };
      }
      return {
        ...prev,
        normativas_modificadas: [
          ...(prev.normativas_modificadas || []),
          normativa,
        ],
      };
    });
  };

  const handleDeseleccionarNormativa = (id) => {
    setFormData((prev) => ({
      ...prev,
      normativas_modificadas: prev.normativas_modificadas.filter((n) => n.id !== id),
    }));
  };

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h3 className="text-lg font-semibold">
          ¿Su normativa modifica, deroga o complementa a otra?
        </h3>
        <div className="flex gap-4 mt-2">
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, cambia_normativa: "SI" })
            }
            className={`btn ${formData.cambia_normativa === "SI" ? "btn-primary" : "btn-outline"}`}
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
              })
            }
            className={`btn ${formData.cambia_normativa === "NO" ? "btn-primary" : "btn-outline"}`}
          >
            No
          </button>
        </div>
      </div>

      {formData.cambia_normativa === "SI" && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Ingrese el número de la normativa que es afectada:
          </label>
          <input
            type="text"
            name="normativa_modificada"
            value={formData.normativa_modificada}
            onChange={handleNormativaChange}
            className="input input-bordered w-full mb-3"
          />

          {formData.normativa_modificada && (
            <>
              {loading ? (
                <p>Cargando resultados...</p>
              ) : error ? (
                <p className="text-red-500">Error al buscar normativas.</p>
              ) : filteredNormativas.length > 0 ? (
                <>
                  <Table
                    normativas={filteredNormativas}
                    normativasSeleccionadas={formData.normativas_modificadas}
                    onSeleccionarNormativas={handleSeleccionarNormativa}
                    onDeseleccionarNormativas={handleDeseleccionarNormativa}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onPageChange={onPageChange}
                  />
                </>
              ) : (
                <p className="text-gray-500">No se encontraron normativas.</p>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn btn-outline mt-5">
          Volver
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary mt-5">
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default InformacionExtra;


InformacionExtra.propTypes = {
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    filteredNormativas: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    handleSearchNormativas: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalResults: PropTypes.number.isRequired,
    resultsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
}
import PropTypes from "prop-types";

const tipoNormativaMap = {
  "Acta": 2,
  "Resolución": 5,
  "Convenio": 3,
  "Nota": 6,
  "Providencia": 4,
  "Ordenanza": 1,
};

const tipoNormativaTexto = Object.entries(tipoNormativaMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

function VerificacionFinal({ formData, onBack, onSubmit, loading, dependenciaMap, emisorMap}) {

  const dependenciaMaptexto = Object.entries(dependenciaMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

  const emisorMaptexto = Object.entries(emisorMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Verifique los datos ingresados:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-base-200 p-4 rounded-lg">
          <p><strong>Tipo de Normativa:</strong> {tipoNormativaTexto[formData.tipo_normativa]}</p>
          <p><strong>Número:</strong> {formData.numero}</p>
          <p><strong>Año:</strong> {formData.anio}</p>
          <p><strong>Título:</strong> {formData.titulo}</p>
          <p><strong>Resumen:</strong> {formData.resumen}</p>
          <p><strong>Fecha:</strong> {formData.fecha}</p>
          <p><strong>Archivo PDF:</strong> {formData.archivo_pdf ? formData.archivo_pdf.name : "No cargado"}</p>
        </div>

        <div className="bg-base-200 p-4 rounded-lg">
          <p><strong>Dependencia:</strong> {dependenciaMaptexto[formData.dependencia]}</p>
          <p><strong>Emisor:</strong>{emisorMaptexto[formData.emisor]}</p>
          <p><strong>Estado:</strong> {formData.estado}</p>
          <p><strong>Modifica otra normativa:</strong> {formData.cambia_normativa}</p>

          {formData.cambia_normativa === "SI" && formData.normativas_modificadas?.length > 0 && (
            <>
              <p><strong>Normativas Afectadas:</strong></p>
              <ul className="list-disc list-inside">
                {formData.normativas_modificadas.map((n, i) => (
                  <li key={i}>
                    {n.numero} - {n.accion || "Sin acción"} {n.comentario && `(${n.comentario})`}
                  </li>
                ))}
              </ul>
            </>
          )}

          <p><strong>Palabras clave:</strong> {formData.palabras_clave.join(", ")}</p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="btn btn-outline">
          Volver
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className={`btn btn-success ${loading ? "loading" : ""}`}
        >
          Confirmar y Finalizar
        </button>
      </div>
    </div>
  );
}

VerificacionFinal.propTypes = {
  formData: PropTypes.shape({
    tipo_normativa: PropTypes.string.isRequired,
    numero: PropTypes.string.isRequired,
    anio: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    resumen: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    archivo_pdf: PropTypes.object,
    dependencia: PropTypes.string.isRequired,
    emisor: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    cambia_normativa: PropTypes.string.isRequired,
    normativas_modificadas: PropTypes.arrayOf(
      PropTypes.shape({
        numero: PropTypes.string.isRequired,
        accion: PropTypes.string,
        comentario: PropTypes.string
      })
    ),
    palabras_clave: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  dependenciaMap: PropTypes.object.isRequired,
  emisorMap: PropTypes.object.isRequired
};

export default VerificacionFinal;

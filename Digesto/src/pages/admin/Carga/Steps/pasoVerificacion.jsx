import PropTypes from "prop-types";

function PasoVerificacion({ formData, onBack, onSubmit }) {
  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Verifique los datos ingresados:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="align w-5xl bg-base-300 p-4 rounded-lg">
          {Object.entries(formData).map(([key, value]) => {
            if (key === "normativas_modificadas") {
              return (
                <div key={key}>
                  <strong>Normativas modificadas:</strong>
                  <ul className="list-disc list-inside">
                    {value.map((n, index) => (
                      <li key={index}>
                        <strong>Normativa:</strong> {n.titulo} - <strong>Accion:</strong> {n.accion} - <strong>Comentario: </strong>{n.comentario} 
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            // Ignorar campos innecesarios
            if (
              [
                "modalSeleccionarNormativa",
                "accionSeleccionada",
                "comentarioSeleccionado",
              ].includes(key)
            ) {
              return null;
            }

            // Etiquetas legibles
            const etiquetas = {
              tipo: "Tipo de Normativa",
              numero: "Número",
              anio: "Año",
              titulo: "Título",
              cambia_normativa: "¿Esta normativa modifica a otra?",
    
            };

            return (
              <p key={key}>
                <strong>{etiquetas[key] || key}:</strong>{" "}
                {Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "object" && value?.name
                  ? value.name
                  : value?.toString()}
              </p>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="btn btn-outline">
          Volver
        </button>
        <button type="button" onClick={onSubmit} className="btn btn-success">
          Confirmar y Finalizar
        </button>
      </div>
    </div>
  );
}

PasoVerificacion.propTypes = {
  formData: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PasoVerificacion;

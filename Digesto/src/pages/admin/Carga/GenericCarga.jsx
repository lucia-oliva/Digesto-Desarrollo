// GenericCarga.jsx
import { useState } from "react";
import GenericForm from "./GenericForm.jsx"; // Este componente se generará con campos dinámicos
import { formFieldsConfig } from "./formFieldsConfig.js"; // Define los campos por entidad
import { useLocation } from "react-router";

function GenericCarga({ tipoEntidad }) {
  
  
const location = useLocation();
const type = location.pathname.split("/")[2];   
console.log(type); 
const [pasoActual, setPasoActual] = useState(0);
const [formData, setFormData] = useState({});
const [errores, setErrores] = useState({});

  const campos = formFieldsConfig[type] || [];

  const validar = () => {
    const nuevosErrores = {};
    campos.forEach(({ name, required }) => {
      if (required && !formData[name]) {
        nuevosErrores[name] = "Este campo es obligatorio";
      }
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleNext = () => {
    if (pasoActual === 1 && !validar()) return;
    setPasoActual(pasoActual + 1);
  };

  const handleBack = () => setPasoActual(pasoActual - 1);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/${type}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error al guardar");
      alert("Registro creado correctamente");
      setPasoActual(0);
      setFormData({});
    } catch (err) {
      console.error(err);
      alert("Error al guardar el registro");
    }
  };

  return (
    <div className="w-full p-6 rounded-lg shadow-lg bg-base-100 text-neutral">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Agregar Nuevo {tipoEntidad}
      </h2>

      <div className="flex justify-center">
        <ul className="steps mb-6">
          <li className={`step ${pasoActual >= 0 ? "step-primary" : ""}`}>Paso 1</li>
          <li className={`step ${pasoActual >= 1 ? "step-primary" : ""}`}>Paso 2</li>
          <li className={`step ${pasoActual >= 2 ? "step-primary" : ""}`}>Verificación</li>
        </ul>
      </div>

      {pasoActual === 0 && (
        <div className="mb-6">
          <p className="text-lg">¿Deseás comenzar a cargar un nuevo registro?</p>
          <button onClick={handleNext} className="btn btn-primary mt-4">
            Comenzar
          </button>
        </div>
      )}

      {pasoActual === 1 && (
        <GenericForm
          entityName={tipoEntidad}
          fields={campos}
          onSubmit={() => handleNext()}
          initialData={formData}
        />
      )}

      {pasoActual === 2 && (
        <div className="space-y-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Verifique los datos ingresados:
          </h3>
          <div className="bg-base-200 p-4 rounded-lg">
            {campos.map((campo) => (
              <p key={campo.name}>
                <strong>{campo.label}:</strong> {String(formData[campo.name] || "-")}
              </p>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={handleBack} className="btn btn-outline">
              Volver
            </button>
            <button onClick={handleSubmit} className="btn btn-success">
              Confirmar y Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenericCarga;

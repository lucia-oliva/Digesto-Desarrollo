import { useState } from "react";
import { useLocation } from "react-router";
import PasoSeleccionTipo from "./Steps/pasoSeleccionTipo.jsx";
import PasoFormulario from "./Steps/pasoForm.jsx";
import PasoModifica from "./Steps/pasoNormativasModificadas.jsx";
import PasoVerificacion from "./Steps/pasoVerificacion.jsx"
import { flujoPorEntidad } from "./config/flujoSteps.js";

function GenericCarga() {
  const location = useLocation();
  const pathSegment = location.pathname.split("/").find((s) => s.startsWith("Nueva") || s.startsWith("Nuevo"));
  const entidad = pathSegment ? pathSegment.replace("Nueva", "").replace("Nuevo", "").toLowerCase() : null;

  const pasos = flujoPorEntidad[entidad] || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errores, setErrores] = useState({});

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        data.append(key, value);
      } else {
        data.append(key, JSON.stringify(value));
      }
    });

    fetch(`http://localhost:3000/api/${entidad}/create`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        alert(`${entidad.charAt(0).toUpperCase() + entidad.slice(1)} creado correctamente`);
        setFormData({});
        setErrores({});
        setCurrentStep(0);
      })
      .catch(() => alert("Error al crear registro"));
  };

  const renderPaso = () => {
    const paso = pasos[currentStep];
    switch (paso) {
      case "seleccionTipo":
        return (
          <PasoSeleccionTipo
            entidad={entidad}
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        );
      case "formulario":
        return (
          <PasoFormulario
            entidad={entidad}
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
            errores={errores}
            setErrores={setErrores}
          />
        );
      case "modificaNormativa":
        return (
          <PasoModifica
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "verificacion":
        return (
          <PasoVerificacion
            formData={formData}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return <p>No hay pasos configurados para esta entidad.</p>;
    }
  };

  return (
    <div className="w-full p-6 rounded-lg shadow-lg bg-base-100 text-neutral">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Crear nueva {entidad}
      </h2>

      {/* Steps visuales */}
      <div className="flex justify-center">
        <ul className="steps mb-6">
          {pasos.map((paso, i) => (
            <li
              key={paso}
              className={`step ${i <= currentStep ? "step-primary" : ""}`}
            >
              {paso.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
            </li>
          ))}
        </ul>
      </div>

      {renderPaso()}
    </div>
  );
}

export default GenericCarga;

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import PasoSeleccionTipo from "./Steps/pasoSeleccionTipo.jsx";
import PasoFormulario from "./Steps/pasoForm.jsx";
import PasoModifica from "./Steps/pasoNormativasModificadas.jsx";
import PasoVerificacion from "./Steps/pasoVerificacion.jsx";
import { flujoPorEntidad } from "./config/flujoSteps.js";
import { getRuta } from "./config/mapeo.js";
import { useAuth } from "../../../context/useAuth.jsx";

function GenericCarga() {
  const { auth } = useAuth();
    const user = auth.user;
  const location = useLocation();
  const pathSegment = location.pathname
    .split("/")
    .find((s) => s.startsWith("Nueva") || s.startsWith("Nuevo"));
  const entidad = pathSegment
    ? pathSegment.replace("Nueva", "").replace("Nuevo", "").toLowerCase()
    : null;

  const pasos = flujoPorEntidad[entidad] || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setCurrentStep(0);
}, [location.pathname]);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  
  const handleSubmit = () => {
  const dataToSend = { ...formData };
  const ruta = getRuta(entidad);

  try {
    //Ruta generica
    console.log("verificando data to Send:",dataToSend)
    fetch(`http://localhost:3000/api/${ruta}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...dataToSend,
        archivo: dataToSend.archivo?.name || "", // solo nombre
        user,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(`[POST] /api/${ruta}/create =>`, data);

        // Paso 2: subir el archivo solo si es normativa
        if (
          entidad === "normativa" &&
          dataToSend.archivo instanceof File &&
          data?.id
        ) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", dataToSend.archivo);
          formDataUpload.append("resolucion", String(dataToSend.numero));
          formDataUpload.append("anio", String(dataToSend.anio));
          formDataUpload.append("titulo", dataToSend.titulo);
          formDataUpload.append("id_dependencia", String(dataToSend.dependencia));
          formDataUpload.append("id_emisor", dataToSend.emisor);
          formDataUpload.append("tipo_normativa", dataToSend.tipo_normativa);

          const resUpload = await fetch(
            `http://localhost:3000/api/file/upload/${data.id}`,
            {
              method: "POST",
              body: formDataUpload,
            }
          );

          const resJson = await resUpload.json();
          console.log("Resultado de subida de archivo:", resJson);

          if (!resUpload.ok) {
            alert("Error al subir archivo PDF");
          }
        }

        alert(
          `${
            entidad.charAt(0).toUpperCase() + entidad.slice(1)
          } creado/a correctamente`
        );
        setFormData({});
        setErrores({});
        setCurrentStep(0);
      })
      .catch(() => alert("Error al crear registro"));
  } catch (err) {
    console.log("Error al serializar JSON:", err);
  }
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
    <div className="w-full p-6 rounded-lg text-neutral">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {entidad === "palabraclave"
          ? "Crear Palabra Clave"
          : `Crear ${entidad ? entidad.charAt(0).toUpperCase() + entidad.slice(1) : ""}`}
      </h2>

      {/* Steps visuales */}
      <div className="flex justify-center">
        <ul className="steps mb-6">
          {pasos.map((paso, i) => (
            <li
              key={paso}
              className={` mr-4 step ${i <= currentStep ? "step-primary" : ""}`}
            >
              {paso
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </li>
          ))}
        </ul>
      </div>

      {renderPaso()}
    </div>
  );
}

export default GenericCarga;

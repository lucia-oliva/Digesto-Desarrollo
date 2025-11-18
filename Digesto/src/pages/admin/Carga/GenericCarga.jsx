import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import PasoSeleccionTipo from "./Steps/pasoSeleccionTipo.jsx";
import PasoFormulario from "./Steps/pasoForm.jsx";
import PasoModifica from "./Steps/pasoNormativasModificadas.jsx";
import PasoVerificacion from "./Steps/pasoVerificacion.jsx";
import { flujoPorEntidad } from "./config/flujoSteps.js";
import { getRuta } from "./config/mapeo.js";
import { useAuth } from "../../../context/useAuth.jsx";
import { API_BASE } from "../../../api/axiosPrivate.js";
import { Alert } from "../../../components/ui/Ui.jsx";

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
  const [alertData, setAlertData] = useState(null);
  const pasos = flujoPorEntidad[entidad] || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setCurrentStep(0);
  }, [location.pathname]);

   const handleNext = () =>
   setCurrentStep((prev) => Math.min(prev + 1, pasos.length - 1));
   const handleBack = () =>
   setCurrentStep((prev) => Math.max(0, prev - 1));
   const canBack = currentStep > 0;

  const handleSubmit = () => {
    const dataToSend = { ...formData };
    const ruta = getRuta(entidad);

    try {
      
      console.log("verificando data to Send:", dataToSend);
      fetch(`${API_BASE}/${ruta}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataToSend,
          archivo: dataToSend.archivo?.name || "", 
          user,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          console.log(`[POST] /api/${ruta}/create =>`, data);
          if(!res.ok || data.ok ===false){
            throw new Error(data.msg || "Error al crear registro");
            }
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
            formDataUpload.append(
              "id_dependencia",
              String(dataToSend.dependencia)
            );
            formDataUpload.append("id_emisor", dataToSend.emisor);
            formDataUpload.append("tipo_normativa", dataToSend.tipo_normativa);

            const resUpload = await fetch(
              `${API_BASE}/file/upload/${data.id}`,
              {
                method: "POST",
                body: formDataUpload,
              }
            );

            const resJson = await resUpload.json();
            console.log("Resultado de subida de archivo:", resJson);

            if (!resUpload.ok) {
                setAlertData({
                  id: Date.now(),
                  title: "Error",
                  message:"Error al subir PDF",
                  error: true
                });
              
            }
          }        
          setFormData({});
          setErrores({});
          setCurrentStep(0);
          setAlertData({
            id: Date.now(),
            title: "Exito",
            message: data.msg || `${entidad.charAt(0).toUpperCase() + entidad.slice(1)} creado/a correctamente`,
            error: false

          })
        })
        .catch((err) => 
          setAlertData({
            id: Date.now(),
            title: "Error",
            message: err.message || "Error al crear registro",
            error: true,
          })
      );
      }catch (err) {
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
            canBack={canBack}
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
            canBack={canBack}
          />
        );
      case "modificaNormativa":
        return (
          <PasoModifica
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
            canBack={canBack}
          />
        );
      case "verificacion":
        return (
          <PasoVerificacion
            formData={formData}
            onBack={handleBack}
            onSubmit={handleSubmit}
             canBack={canBack}
          />
        );
      default:
        return <p>No hay pasos configurados para esta entidad.</p>;
    }
  };

  return (
    <div className="w-full rounded-lg text-neutral">
       {alertData && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full max-w-md px-4">
          <Alert
            key={alertData.id}
            title={alertData.title}
            message={alertData.message}
            error={alertData.error}
            duration={4000}
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4 text-center">
        {entidad === "palabraclave"
          ? "Crear Palabra Clave"
          : `Crear ${
              entidad ? entidad.charAt(0).toUpperCase() + entidad.slice(1) : ""
            }`}
      </h2>
      <div className="w-full flex justify-center mb-4 sm:mb-6">
        <ul className=" z-0 steps steps-horizontal inline-grid w-auto gap-1 sm:gap-3">
          {pasos.map((paso, i) => {
            const label = paso
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());
            return (
              <li
                key={paso}
                className={`step ${i <= currentStep ? "step-primary" : ""}`}
                title={label}
                aria-label={label}
              >
                <span className="hidden sm:block mt-2 text-xs text-center font-sans whitespace-nowrap">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {renderPaso()}
    </div>
  );
}

export default GenericCarga;

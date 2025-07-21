import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import PasoSeleccionTipo from "../Carga/Steps/pasoSeleccionTipo.jsx";
import PasoFormulario from "../Carga/Steps/pasoForm.jsx";
import PasoModifica from "../Carga/Steps/pasoNormativasModificadas.jsx";
import PasoVerificacion from "../Carga/Steps/pasoVerificacion.jsx";
import { flujoPorEntidad } from "../Carga/config/flujoSteps.js";
import { getRuta } from "../Carga/config/mapeo.js";
import { useAuth } from "../../../context/useAuth.jsx";
import {mapCamposEditar} from "./mapeoCamposEdit.js";


function GenericEdit() {

  const { auth } = useAuth();
  const user = auth.user;
  const location = useLocation();
  const { id } = useParams();

  const pathSegment = location.pathname
    .split("/")
    .find((s) => s.startsWith("Editar") || s.startsWith("Nuevo"));

  const entidad = pathSegment
    ? pathSegment.replace("Editar", "").replace("Nuevo", "").toLowerCase()
    : null;

  const pasos = flujoPorEntidad[entidad] || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [errores, setErrores] = useState({});


  useEffect(() => {
    setCurrentStep(0);
  }, [location.pathname]);

 useEffect(() => {
  if (entidad && id) {
    const ruta = getRuta(entidad);
    console.log(ruta);

    fetch(`http://localhost:3000/api/${ruta}/datos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al buscar");
        return res.json();
      })
      .then((data) => {
        if (!data) {
          alert("No se encontraron datos para editar.");
        } else {
          setFormData(data);
        }
      })
      .catch(() => alert("Error al cargar los datos para editar"));
  }
}, [entidad, id]);



  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = () => {

    if (!formData || !formData.id) {
    alert("Faltan datos clave para editar.");
    return;
  }
    const ruta = getRuta(entidad);
      const dataToSend = {
    ...mapCamposEditar(entidad, formData),
    userId: user.id,
  };

  console.log("datppppppppppps",dataToSend);

    fetch(`http://localhost:3000/api/${ruta}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`[POST] /api/${ruta}/edit =>`, data);
        alert(`Entidad ${entidad} editada correctamente.`);
      })
      .catch(() => alert("Error al editar registro"));
  };

  const renderPaso = () => {
    if (!formData) return <p className="text-center">Cargando datos...</p>;

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
        Editar {entidad ? entidad.charAt(0).toUpperCase() + entidad.slice(1) : ""}
      </h2>

      <div className="flex justify-center">
        <ul className="steps mb-6">
          {pasos.map((paso, i) => (
            <li
              key={paso}
              className={`mr-4 step ${i <= currentStep ? "step-primary" : ""}`}
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

export default GenericEdit;

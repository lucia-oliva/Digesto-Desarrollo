import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import PasoSeleccionTipo from "../Carga/Steps/pasoSeleccionTipo.jsx";
import PasoFormulario from "../Carga/Steps/pasoForm.jsx";
import PasoModifica from "../Carga/Steps/pasoNormativasModificadas.jsx";
import PasoVerificacion from "../Carga/Steps/pasoVerificacion.jsx";
import { flujoPorEntidad } from "../Carga/config/flujoSteps.js";
import { getRuta } from "../Carga/config/mapeo.js";
import { useAuth } from "../../../context/useAuth.jsx";
import { mapCamposEditar } from "./mapeoCamposEdit.js";
import { useReferencias } from "../../../context/referenciasContext.js";
import { buildRelacionesNormativas } from "../Carga/config/mapeo.js";
import ActualizarContrasenia from "../Edit/ActualizarContrasenia.jsx";
import { API_BASE } from "../../../api/axiosPrivate.js";

function GenericEdit() {


  
  const navigate = useNavigate();
  const { auth } = useAuth();
  const user = auth.user;
  const { dependencias, emisores } = useReferencias();
  const findIdByNameOrId = (list, value) => {
    if (value == null) return "";
    const s = String(value).trim();
    if (/^\d+$/.test(s)) return s; 
    const lower = s.toLowerCase();
    const hit = (list ?? []).find(
      (x) => String(x.nombre ?? x.label ?? "")
              .trim()
              .toLowerCase() === lower
    );
    return hit ? String(hit.id ?? hit.value ?? "") : "";
  };


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

      fetch(`${API_BASE}/${ruta}/datos/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al buscar");
          return res.json();
        })
        .then((data) => {
          if (!data) {
            alert("No se encontraron datos para editar.");
          } 
else if (entidad === "normativa") {
             setFormData({
               ...data,
              emisor: findIdByNameOrId(emisores, data.id_emisor ?? data.emisor),
             dependencia: findIdByNameOrId(
               dependencias,
                data.id_dependencia ?? data.dependencia
              ),
              tipo_normativa: String(data.id_tipo_normativa ?? data.tipo_normativa ?? "").trim(),
               archivo: data.archivo ?? "",
               cambia_normativa:
                 Array.isArray(data.normativas_modificadas) &&
                 data.normativas_modificadas.length > 0
                   ? "SI"
                   : data.cambia_normativa || "NO",
               _originalesNormativas: data.normativas_modificadas || [],
               normativas_bajas: [],
             });
          } else {
            setFormData({
              ...data,
              password: "",
              confirmPassword: "",
              _passwordEdited: false,
            });
          }
        })
        .catch(() => alert("Error al cargar los datos para editar"));
    }


    
  }, [entidad, id, dependencias,emisores]);

 useEffect(() => {
   if (entidad === "normativa" && formData) {
     const depId = findIdByNameOrId(dependencias, formData.dependencia);
     const emiId = findIdByNameOrId(emisores, formData.emisor);
     if (
       (depId && depId !== formData.dependencia) ||
       (emiId && emiId !== formData.emisor)
     ) {
       setFormData(prev => ({
         ...prev,
         dependencia: depId || "",
         emisor: emiId || ""
       }));
     }
   }
   
 }, [dependencias, emisores, entidad, formData]); 


   const handleNext = () =>
   setCurrentStep((prev) => Math.min(prev + 1, pasos.length - 1));
   const handleBack = () =>
   setCurrentStep((prev) => Math.max(0, prev - 1));
   const canBack = currentStep > 0;

  const handleSubmit = () => {
    if (!formData || !formData.id) {
      alert("Faltan datos clave para editar.");
      return;
    }
  const safeDep  = findIdByNameOrId(dependencias, formData.dependencia);
  const safeEmi  = findIdByNameOrId(emisores, formData.emisor);
  const safeTipo = formData.tipo_normativa ?? "";

    const ruta = getRuta(entidad);
    const cambios = buildRelacionesNormativas(formData);

    const {
      // eslint-disable-next-line no-unused-vars
      accionSeleccionada,
      // eslint-disable-next-line no-unused-vars
      comentarioSeleccionado,
      // eslint-disable-next-line no-unused-vars
      editingSelectedId,
      // eslint-disable-next-line no-unused-vars
      modalSeleccionarNormativa,
      // eslint-disable-next-line no-unused-vars
      normativas_bajas,
      // eslint-disable-next-line no-unused-vars
      _originalesNormativas,
      ...formClean
    } = formData;

    const archivoNombre =
      formClean.archivo instanceof File
        ? formClean.archivo.name
        : typeof formClean.archivo === "string"
        ? formClean.archivo
        : "";

    
  const safeForm = {
    ...formClean,
    dependencia: safeDep,
    emisor: safeEmi,
    tipo_normativa: safeTipo,
  };

  const dataToSend = {
    ...mapCamposEditar(entidad, safeForm),
     archivo: archivoNombre,
     userId: user.id,
     normativas_modificadas: cambios,
   };

    if(entidad === "usuario"){
      dataToSend.password = 
        formData._passwordEdited && formData.password?.trim() 
        ? formData.password.trim()
        : null;
    }

    fetch(`${API_BASE}/${ruta}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`[POST] /api/${ruta}/edit =>`, data);
        console.log("FORMDATAAAAAAAAAAAAAA:", formData);
        console.log("DataTOSEND", dataToSend);

        if (
          entidad === "normativa" &&
          formData.archivo instanceof File &&
          formData.id
        ) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", formData.archivo);
          formDataUpload.append("resolucion", String(formData.numero));
          formDataUpload.append("anio", String(formData.anio));
          formDataUpload.append("titulo", formData.titulo);
          formDataUpload.append("id_dependencia", String(safeDep || formData.dependencia || ""));
          formDataUpload.append("id_emisor", String(safeEmi || formData.emisor || ""));
          formDataUpload.append("tipo_normativa", String(safeTipo || formData.tipo_normativa || ""));

          return fetch(`${API_BASE}/file/upload/${formData.id}`, {
            method: "POST",
            body: formDataUpload,
          })
            .then((resUpload) => {
              if (!resUpload.ok) throw new Error("Error al subir archivo PDF.");
              return resUpload.json();
            })
            .then((resJson) => {
              console.log("Resultado de subida de archivo:", resJson);
              alert(`Entidad ${entidad} editada correctamente.`);
            });
        }
        setFormData({});
        setErrores({});
        if (entidad === "palabraclave") {
          navigate(`/admin/ListadoPalabrasClave`);
        } else if (entidad === "emisor") {
          navigate(`/admin/ListadoEmisores`);
        } else if (entidad === "dependencia") {
          navigate(`/admin/ListadoDependencias`);
        }
        alert(`Entidad ${entidad} editada correctamente.`);
      });
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
          <>
            {entidad === "usuario" && formData?.id && (
              <ActualizarContrasenia
                formData={formData}
                setFormData={setFormData}
                errores={errores}
              />
            )}
            <PasoFormulario
              entidad={entidad}
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
              errores={errores}
              setErrores={setErrores}
              omitPwdFields={entidad === "usuario"}
              canBack={canBack}
            />
          </>
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
      <h2 className="text-xl font-semibold mb-4 text-center">
        Editar{" "}
        {entidad ? entidad.charAt(0).toUpperCase() + entidad.slice(1) : ""}
      </h2>

      <div className="w-full flex justify-center mb-4 sm:mb-6">
        <ul className="steps steps-horizontal inline-grid w-auto gap-1 sm:gap-3">
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

export default GenericEdit;

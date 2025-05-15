import { useState } from "react";
import useAxios from "axios-hooks";
import SeleccionTipoNormativa from "./Carga/SeleccionTipoNormativa"; 
import FormularioDatos from "./Carga/FormularioDatos";
import InformacionExtra from "./Carga/InformacionExtra";
import VerificacionFinal from "./Carga/VerificacionFinal";
import {useFormNormativa} from "../layout/Carga/useFormNormativa.js"
//TODO: implementar la funcionalidad para crear normativas... 
//TODO: Ver como integramos la funcionalidad de normativas_modificadas

function Carga() {
  const [pasoActual, setPasoActual] = useState(0);
  const [filteredNormativas, setFilteredNormativas] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const [totalResults, setTotalResults] = useState(0);
  const dependenciaMap = {
    "Aplicadas": 1, "Exactas": 2, "Humanidades": 5,"Salud": 3, "Sociales": 4,"Sede Chepes": 22,"Sede Chamical": 25,
    "Sede Villa Unión": 26, "Sede Catuna": 23,"Sede Aimogasta": 24,"Consejo Superior": 20,};
  const emisorMap = {
    "Decano": 1,"Consejo Superior": 4,"Rector": 2,"Concejo Directivo": 3,"Interdepartamental": 5,"Relaciones Institucionales": 11,};
  const estadoOptions = ["publicado", "despublicado"];
  const { formData, setFormData, resetForm } = useFormNormativa();




  const [{ loading, error }, refetch] = useAxios(
    {
      url: `http://localhost:3000/api/normativa/search`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { manual: true }
  );

  const [{ loading: creating}, refetchCreate] = useAxios(
    {
      url: `http://localhost:3000/api/normativa/create`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { manual: true }
  );

  // Crear normativa
  const handleCreateNormativa = () => {
    const formDataToSend = {
      numero: formData.numero,
      anio: formData.anio,
      titulo: formData.titulo,
      resumen: formData.resumen,
      fecha: formData.fecha,
      dependencia: formData.dependencia,
      emisor: formData.emisor,
      tipo_normativa: formData.tipo_normativa,
      estado: formData.estado,
      tags: formData.palabras_clave,
      archivo: formData.archivo_pdf ? formData.archivo_pdf.name : null,
    };

    refetchCreate({ data: formDataToSend })
      .then((response) => {
        console.log("Normativa creada:", response.data);
        resetForm();
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000) // Resetear el formulario
        setPasoActual(0); // Volver al paso inicial
      })
      .catch((err) => {
        console.error("Error al crear la normativa:", err.message);
        alert("Error al crear la normativa");
      });
  };

  const handleSearchNormativas = (numero, page = 1) => {
    if (numero) {
      refetch({
        params: { page, limit: resultsPerPage },
        data: { numero },
      })
        .then((response) => {
          setFilteredNormativas(response.data.normativas || []);
          setTotalResults(response.data.totalResults || 0);
        })
        .catch((err) => {
          console.error("Error al buscar normativas:", err.message);
          setFilteredNormativas([]);
          setTotalResults(0);
        });
    } else {
      setFilteredNormativas([]);
      setTotalResults(0);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleSearchNormativas(formData.normativa_modificada, page);
  };

  return (
    <div className="w-full p-6 rounded-lg shadow-lg bg-base-100 text-neutral">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Agregar Nueva Normativa
      </h2>

      {/* STEPS VISUALES */}
      <div className="flex justify-center">
        <ul className="steps mb-6">
          <li className={`step ${pasoActual >= 0 ? "step-primary" : ""}`}>
            Seleccionar Normativa
          </li>
          <li className={`step ${pasoActual >= 1 ? "step-primary" : ""}`}>
            Cargar Datos
          </li>
          <li className={`step ${pasoActual >= 2 ? "step-primary" : ""}`}>
            Informacion Extra
          </li>
          <li className={`step ${pasoActual >= 3 ? "step-primary" : ""}`}>
            Verificación
          </li>
        </ul>
      </div>
      
      {/* PASO 1 - Selección de tipo de normativa */}
      {pasoActual === 0 && (
          <SeleccionTipoNormativa
            tipoActual={formData.tipo_normativa}
            onSelect={(tipo) => {
              setFormData({ ...formData, tipo_normativa: tipo });
              setPasoActual(1);
            }}
          />
      )}

      {/* PASO 2 - Formulario */}
      {pasoActual === 1 && (
        <FormularioDatos
          formData={formData}
          setFormData={setFormData}
          onBack={() => setPasoActual(0)}
          onNext={() => setPasoActual(2)}
          dependenciaOptions={dependenciaMap}
          emisorOptions={emisorMap}
          estadoOptions={estadoOptions}
        />
      )}

      {/* PASO 3 - Pregunta condicional */}
        {pasoActual === 2 && (
          <InformacionExtra
            formData={formData}
            setFormData={setFormData}
            onBack={() => setPasoActual(1)}
            onNext={() => setPasoActual(3)}
            filteredNormativas={filteredNormativas}
            loading={loading}
            error={error}
            handleSearchNormativas={handleSearchNormativas}
            currentPage={currentPage}
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onPageChange={handlePageChange}
          />
        )}

      {/* PASO 4 - Verificación final */}
      {pasoActual === 3 && (
        <VerificacionFinal
          formData={formData}
          onBack={() => setPasoActual(2)}
          onSubmit={handleCreateNormativa}
          loading={creating}
          dependenciaMap={dependenciaMap}
          emisorMap={emisorMap}
        />
      )}

      {toastVisible && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <span>La normativa se agregó exitosamente.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carga;

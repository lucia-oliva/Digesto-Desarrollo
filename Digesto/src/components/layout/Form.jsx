import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Form({ dependencia, onFormChange, dependenciaMap, anio, documento, emisor,numero}) {
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [selectedDependencia, setSelectedDependencia] = useState(dependencia);
  const [selectedNumero, setSelectedNumero] = useState(numero);
  const [selectedEmisor, setSelectedEmisor] = useState(emisor);
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(documento);
  const [selectedAnio, setSelectedAnio] = useState(anio);

  const dependenciaEnum = [
    "Exactas",
    "Salud",
    "Humanas",
    "Sociales",
    "Aplicadas",
    "Chepes",
    "Villa Union",
    "Chamical",
    "Aimogasta",
    "Catuna",
    "C. Superior",
    "Todas",
  ];

  const dependenciaMapInverted = {
    "2": "Exactas",
    "1": "Aplicadas",
    "3": "Salud",
    "4": "Sociales",
    "5": "Humanas",
    "20": "C. Superior",
    "22": "Chepes",
    "26": "Villa Union",
    "25": "Chamical",
    "24": "Aimogasta",
    "23": "Catuna",
    "": "Todas"
  };

  useEffect(() => {
    //Esta funcion solo me trae los años de las normativas, para mostrarlas como opciones. 
    const fetchYears = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/normativa/yearNormativa");
        setYears(response.data);
      } catch (error) {
        console.error("Error al obtener los años de normativas", error);
      }
    };

    fetchYears();
  }, []);

  useEffect(() => {
    if (dependencia) {
      if (dependenciaEnum.includes(dependencia)) {
        setSelectedDependencia(dependenciaMap[dependencia]);
      } else {
        setSelectedDependencia(""); 
      }
    }
  }, [dependencia]);

  const handleInputChange = (e, setState) => {
    const value = e.target.value;
    setState(value);
  };

  const handleDependenciaChange = (e) => {
    setSelectedDependencia(e.target.value);
  };

  const handleEmisorChange = (e) => {
    setSelectedEmisor(e.target.value);
  };

  const handleAnioChange = (e) => {
    setSelectedAnio(e.target.value);
  };

  const handleTipoDocumentoChange = (e) => {
    setSelectedTipoDocumento(e.target.value);
  };

  const handleBuscarClick = () => {
    const dependenciaNombre = dependenciaMapInverted[selectedDependencia];
    // Actualizamos la URL con el número de la dependencia
    navigate(`?dependencia=${dependenciaNombre}`, { replace: true });

    onFormChange({
      dependencia: selectedDependencia,
      numero: selectedNumero,
      emisor: selectedEmisor,
      documento: selectedTipoDocumento,
      anio: selectedAnio
    });
  };

  

  return (
    <div className="w-full p-6 rounded-box mb-7">
      <h2 className="text-lg font-bold font-[Montserrat] mb-4">Busqueda Avanzada</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Número</label>
          <input 
            type="text" 
            className="input input-bordered w-full" 
            placeholder="Buscar por numero"
            value={selectedNumero}
            onChange={(e) => handleInputChange(e, setSelectedNumero)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Dependencia</label>
          <select
            className="select select-bordered w-full"
            value={selectedDependencia}
            onChange={handleDependenciaChange}
          >
            <option value="">Todas las dependencias</option>
            <option value="2">Exactas</option>
            <option value="1">Aplicadas</option>
            <option value="3">Salud</option>
            <option value="4">Sociales</option>
            <option value="5">Humanas</option>
            <option value="20">Consejo Superior</option>
            <option value="22">Sede Chepes</option>
            <option value="26">Sede Villa Union</option>
            <option value="25">Sede Chamical</option>
            <option value="24">Sede Aimogasta</option>
            <option value="23">Sede Catuna</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Emisor</label>
          <select
            className="select select-bordered w-full"
            value={selectedEmisor}
            onChange={handleEmisorChange}
          >
            <option value="">Todos los emisores</option>
            <option value="1">Decano/a</option>
            <option value="2">Rector/a</option>
            <option value="3">Consejo Directivo</option>
            <option value="4">Consejo Superior</option>
            <option value="5">Interdepartamental</option>
            <option value="11">Relaciones Institucionales</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Año</label>
          <select
            className="select select-bordered w-full"
            value={selectedAnio}
            onChange={handleAnioChange}
          >
            <option value="">Seleccione</option>
            {years.length > 0 ? (
              years.map((yearObj) => (
                <option key={yearObj.anio} value={yearObj.anio}>
                  {yearObj.anio}
                </option>
              ))
            ) : (
              <option>Cargando...</option>
            )}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Tipo de Documento</label>
          <select
            className="select select-bordered w-full"
            value={selectedTipoDocumento}
            onChange={handleTipoDocumentoChange}
          >
            <option value="">Todo los documentos</option>
            <option value="1">Ordenanza</option>
            <option value="2">Acta</option>
            <option value="3">Convenio</option>
            <option value="5">Resolucion</option>
            <option value="6">Nota</option>
            <option value="4">Providencia</option>
          </select>
        </div>

        <div className="flex items-end">
          <button className="btn btn-primary w-full" onClick={handleBuscarClick}>Buscar</button>
        </div>
      </div>
    </div>
  );
}

Form.propTypes = {
  dependencia: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default Form;

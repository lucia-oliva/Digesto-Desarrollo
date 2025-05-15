import PropTypes from "prop-types";
import { useState } from "react";
import SelectNormativaModal from "./Table/SelectNormativaModal.jsx";
import EditNormativaModal from "./Table/EditNormativaModal.jsx"
import TableDesktop from "./Table/TableDesktop.jsx";
import TableMobile from "./Table/TableMobile.jsx";
 
//BUG: Hay que desactivar el scroll del fondo cuando los modales estan activos porque si no molestan...
//TODO: Ver como integramos la funcionalidad de normativas_modificadas

function Table({normativas,normativasSeleccionadas = [],onDeseleccionarNormativas,onSeleccionarNormativas
}){
  

 // Estado para manejar los modales y la carga de datos.
  const [modalData, setModalData] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedComment, setSelectedComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("alert-info");
  const [cambia_normativa] = useState("NO");
  const [normativa_modificadas, setNormativaModificadas] = useState([]);
  const [filteredNormativas, setFilteredNormativas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const  [setTotalResults] = useState(0);
  const resultsPerPage = 10;
  const estadoOptions = ["publicado", "despublicado"];
  const dependenciaMap = {
    "Aplicadas": 1, "Exactas": 2, "Humanidades": 5,"Salud": 3, "Sociales": 4,"Sede Chepes": 22,"Sede Chamical": 25,
    "Sede Villa Unión": 26, "Sede Catuna": 23,"Sede Aimogasta": 24,"Consejo Superior": 20,};
  const tipoNormativaMap = {
    "Acta": 2,"Resolucion": 5,"Convenio": 3,"Nota": 6,"Providencia": 4,"Ordenanza": 1,};
  const emisorMap = {
    "Decano": 1,"Consejo Superior": 4,"Rector": 2,"Concejo Directivo": 3,"Interdepartamental": 5,"Relaciones Institucionales": 11,};    
   //Funcion que muestra las normativas. 
    const handleSearchNormativas = async (numero, page = 1) => {
    if (numero) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/normativa/search?page=${page}&limit=${resultsPerPage}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ numero }),
          }
        );
        const data = await response.json();
        setFilteredNormativas(data.normativas || []);
        setTotalResults(data.totalResults || 0);
      } catch (err) {
        console.error("Error al buscar normativas:", err.message);
        setFilteredNormativas([]);
        setTotalResults(0);
      }
    } else {
      setFilteredNormativas([]);
      setTotalResults(0);
    }
  };
  //Funcion que muestra el modal de edicion de normativa.
  const openEditModal = async (normativa,tags) => {
    try {
      //Cargar los tags asociados a la normativa
      const responseTags = await fetch(
        `http://localhost:3000/api/tag/tags/${normativa.id}`
      );
      tags = await responseTags.json();
      //Cargar los datos de la normativa seleccionada
      setEditModalData({
        id: normativa.id,
        numero: normativa.numero || "",
        anio: normativa.anio || "",
        titulo: normativa.titulo || "",
        resumen: normativa.resumen || "",
        fecha: normativa.fecha || "",
        dependencia: normativa.dependencia || "",
        emisor: normativa.emisor || "",
        tipo_normativa: normativa.tipo_normativa || "",
        estado: normativa.estado || "publicado",
        archivo: "",
        tags: tags || [],
        cambia_normativa: cambia_normativa || "NO",
        normativa_modificadas: normativa_modificadas || [],
      });
      setShowEditModal(true); // Mostrar el modal de edición
    } catch (error) {
      console.error("Error al obtener los tags:", error);
      setAlertMessage("Error al obtener los tags");
      setAlertType("alert-error");
    }
    // Mostrar los valores mapeados en la consola
    console.log("ID de la normativa:", normativa.id);
    console.log("Normativa seleccionada:", normativa);
    console.log("Dependencia mapeada:", Object.keys(dependenciaMap).find(
      (key) => dependenciaMap[key] === parseInt(normativa.dependencia, 10)
    ));
    console.log("Emisor mapeado:", Object.keys(emisorMap).find(
      (key) => emisorMap[key] === parseInt(normativa.emisor, 10)
    ));
    console.log("Tipo Normativa mapeado:", Object.keys(tipoNormativaMap).find(
      (key) => tipoNormativaMap[key] === parseInt(normativa.tipo_normativa, 10)
    ));

    console.log("Valor actual en el select de dependencia:", editModalData?.dependencia);

  };

  //Funcion que cierra el modal de edicion de normativa.
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditModalData(null);
    setNormativaModificadas([]); // Limpiar la lista de normativas modificadas al cerrar el modal
  };

  //Funcion que se encarga de guardar los cambios en la normativa editada.
  const handleSaveEdit = async () => {
    const dataToSend = {
      ...editModalData,
      dependencia: dependenciaMap[editModalData.dependencia] || null,
      tipo_normativa: tipoNormativaMap[editModalData.tipo_normativa] || null,
      emisor: emisorMap[editModalData.emisor] || null,
      normativa_modificadas,
      tags: editModalData.tags || [], // Asegúrate de enviar los tags
    };
  
    console.log("Datos a enviar:", dataToSend);
  
    try {
      const response = await fetch(
        `http://localhost:3000/api/normativa/update/${editModalData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
  
      if (!response.ok) {
        throw new Error("Error al guardar los cambios");
      }
  
      const result = await response.json();
      console.log("Datos actualizados:", result);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      closeEditModal();
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      setAlertMessage("Error al actualizar los datos");
      setAlertType("alert-error");
    } finally {
      setIsLoading(false);
    }
  };

  //Funcion que se encarga de abrir el modal de carga de normativa_modificada.
  const openModal = (normativa) => {
    setModalData(normativa);
    setSelectedAction("");
    setSelectedComment("");
    setShowModal(true);
  };

  //Funcion que se encarga de cerrar el modal de edicion 
  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
    setSelectedAction("");
    setSelectedComment("");
  };

  //Funcion que se encarga de deseleccionar la normativa.
  const handleDeselect = (id) => {
    onDeseleccionarNormativas(id);
  };

  
  const isSelected = (id) => normativasSeleccionadas.some((n) => n.id === id);

  const handleDelete = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar esta normativa?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/normativa/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      console.log("Respuesta del servidor:", response);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "Error desconocido" };
        }
        console.error("Error al eliminar la normativa:", errorData.error);
        setAlertMessage(`Error al eliminar la normativa: ${errorData.error}`);
        setAlertType("alert-error");
      } else {
        const successData = await response.json();
        console.log("Normativa eliminada con éxito:", successData);
        setIsDeleteSuccess(true); // Muestra el mensaje de éxito de eliminación
        setTimeout(() => setIsDeleteSuccess(false), 3000); // Oculta el mensaje después de 3 segundos
      }
    } catch (error) {
      console.error("Error al eliminar la normativa:", error);
      setAlertMessage("Error al eliminar la normativa");
      setAlertType("alert-error");
    }
  };

  return (
    <div className="justify-center flex items-center">
      <div className="w-auto text-neutral text-center rounded-lg">
        {/* Mensaje de éxito para eliminar */}
        {isDeleteSuccess && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
            ¡Normativa eliminada con éxito!
          </div>
        )}

        {/* Mensaje de éxito para editar */}
        {isSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            ¡Normativa actualizada con éxito!
          </div>
        )}

        {/* Alerta general */}
        {alertMessage && (
          <div
            role="alert"
            className={`alert ${alertType} fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alertMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:hidden gap-4">
          <TableMobile
            normativas={normativas}
            isSelected={isSelected}
            onSelect={openModal}
            onDeselect={handleDeselect}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
        {/*Version DESKTOP */} 
        <TableDesktop
          normativas={normativas}
          isSelected={isSelected}
          onSelect={openModal}
          onDeselect={handleDeselect}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </div>

      {showModal && (  
        <SelectNormativaModal
            modalData={modalData}
            selectedAction={selectedAction}
            selectedComment={selectedComment}
            onChangeAction={setSelectedAction}
            onChangeComment={setSelectedComment}
            onCancel={closeModal}
            onSave={() => {
              if (!selectedAction) {alert("Debe seleccionar una acción.");
                return;}
              const updatedNormativa = {id: modalData.id,numero: modalData.numero,titulo: modalData.titulo,
                accion: selectedAction,comentario: selectedComment,};
              if (showEditModal) {
                setNormativaModificadas((prev) => [...prev, updatedNormativa]);
              }else {
                onSeleccionarNormativas(updatedNormativa);
              }
              closeModal();
            }}
          />
      )}

      {showEditModal && ( 
        <EditNormativaModal
          editModalData={editModalData}
          setEditModalData={setEditModalData}
          onClose={closeEditModal}
          onSave={handleSaveEdit}
          isLoading={isLoading}
          dependenciaMap={dependenciaMap}
          emisorMap={emisorMap}
          tipoNormativaMap={tipoNormativaMap}
          estadoOptions={estadoOptions}
          normativa_modificadas={normativa_modificadas}
          setNormativaModificadas={setNormativaModificadas}
          filteredNormativas={filteredNormativas}
          handleSearchNormativas={handleSearchNormativas}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setModalData={setModalData}
          setShowModal={setShowModal}
        />
      )}

      {isDeleteSuccess && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          ¡Normativa eliminada con éxito!
        </div>
      )}

      {alertMessage && (
        <div
          role="alert"
          className={`alert ${alertType} fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{alertMessage}</span>
        </div>
      )}
    </div>
  );
}

Table.propTypes = {
  normativas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      numero: PropTypes.string.isRequired,
      titulo: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      dependencia: PropTypes.string.isRequired,
      emisor: PropTypes.string.isRequired,
      tipo_normativa: PropTypes.string.isRequired,
      visitas: PropTypes.number.isRequired,
      onSeleccionarNormativas: PropTypes.func.isRequired,
    })
  ).isRequired,
  onSeleccionarNormativas: PropTypes.func.isRequired,
  onDeseleccionarNormativas: PropTypes.func.isRequired,
  normativasSeleccionadas: PropTypes.array,
};

export default Table;

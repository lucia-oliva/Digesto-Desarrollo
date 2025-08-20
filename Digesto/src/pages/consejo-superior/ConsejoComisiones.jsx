import { useState } from "react";

function ConsejoComisiones(){
    const [activeTab, setActiveTab] = useState("asuntosAcademicos");
    
    const tabs = [
    { key: "asuntosAcademicos", label: "Asuntos Academicos" },
    { key: "interpretacion", label: "Interpretacion y Reglamento" },
    { key: "presupuesto", label: "Presupuesto y Hacienda" },
    { key: "asuntosGenerales", label: "Asuntos Generales" },
    { key: "extension", label: "Extensión y Asuntos Institucionales" },
    ];

    const content = {
        asuntosAcademicos: (<div className="space-y-4 text-sm">
  <div>
    <strong className="block text-gray-900">Presidente:</strong>
    <p>Decano Mg. Lic. Marcelo Martinez</p>
  </div>
  <div>
    <strong className="block text-gray-900">Decano Sede Aimogasta:</strong>
    <p>Ing. Luis Eduardo Luna Mercado</p>
  </div>
  <div>
    <strong className="block text-gray-900 space-y-4">Docentes:</strong>
    <p>TORRES, Leila Lorena</p>
    <p>FLORES CORREA, Amalia</p>
    <p>BORDON, Adriana Beatriz</p>
    <p>TEPER ORTIZ, Alfredo</p>
    <p>AGUERO, Jose Alejandro</p>
  </div>
  <div>
    <strong className="block text-gray-900 space-y-4">Estudiantes:</strong>
    <p>CALLAPINO, Franco M</p>
    <p>ECHEVERRIA GONZALEZ, Alejandro</p>
    <p>PERALTA, Cristian Nicolas</p>
  </div>
  <div>
    <strong className="block text-gray-900">No Docentes:</strong>
    <p>ESCUDERO, Patricia Ines</p>
  </div>
  <div>
    <strong className="block text-gray-900">Graduados:</strong>
    <p>MOLINA, Mauricio</p>
  </div>
</div>
),
        interpretacion: (
            <div className="space-y-4 text-sm">
  <div>
    <strong className="block text-gray-900">Presidente:</strong>
    <p>Decano Mg. Lic. Gustavo Kofman</p>
  </div>
  <div>
    <strong className="block text-gray-900">Decano Sede Chamical:</strong>
    <p>Ing. Jose Vera Diaz</p>
  </div>
  <div>
    <strong className="block text-gray-900">Docentes:</strong>
    <p>HERRERA, Luis Eduardo</p>
    <p>ORONA, Mario David</p>
    <p>CACERES, Mercedes Evelina</p>
    <p>ORTIZ, Jorge Mario</p>
    <p>CARBEL, Ricardo Baltazar</p>
  </div>
  <div>
    <strong className="block text-gray-900">Estudiantes:</strong>
    <p>TRONCOSO, Angel Martin</p>
    <p>CARRIZO, Tamara Ayelen</p>
    <p>MALDONADO, Evangelina Maria</p>
  </div>
  <div>
    <strong className="block text-gray-900">No Docentes:</strong>
    <p>VILTE, Malvina Beatriz</p>
  </div>
  <div>
    <strong className="block text-gray-900">Graduados:</strong>
    <p>SANCHEZ ALEM, José Bernardo</p>
  </div>
</div>

        ),
        presupuesto: (
            <div className="space-y-4 text-sm">
  <div>
    <strong className="block text-gray-900">Presidente:</strong>
    <p>Cr. Juan Chade</p>
  </div>
  <div>
    <strong className="block text-gray-900">Decano Sede Catuna:</strong>
    <p>Dr. Cesar Tadeo Carrizo</p>
  </div>
  <div>
    <strong className="block text-gray-900">Docentes:</strong>
    <p>RIBOLDI, Jorge Hugo</p>
    <p>GUZZONATO, Ricardo Aldo</p>
    <p>SANTILLAN, Alejo Rodrigo</p>
    <p>CAMPAZZO, Eduardo</p>
    <p>MONTIVERO, Maria Silvia</p>
  </div>
  <div>
    <strong className="block text-gray-900">Estudiantes:</strong>
    <p>OLIVA, Silvia Elizabeth</p>
    <p>SARAVIA, Pablo David</p>
    <p>CORDOBA, Adrian Gabriel</p>
  </div>
  <div>
    <strong className="block text-gray-900">No Docentes:</strong>
    <p>RIVADULLA, Ariel Alan</p>
  </div>
  <div>
    <strong className="block text-gray-900">Graduados:</strong>
    <p>DIAZ, Melisa Elizabeth</p>
  </div>
</div>

        ),
        asuntosGenerales: (
            <div className="space-y-4 text-sm">
  <div>
    <strong className="block text-gray-900">Presidente:</strong>
    <p>Decana Alicia Azucena Leiva</p>
  </div>
  <div>
    <strong className="block text-gray-900">Decana Sede Chepes:</strong>
    <p>Bioq. Maria Marta Patane</p>
  </div>
  <div>
    <strong className="block text-gray-900">Docentes:</strong>
    <p>LUCERO, Nancy Beatriz</p>
    <p>LLANOS, Victor Hugo</p>
    <p>PAEZ, Valeria Fernanda</p>
    <p>SANCHEZ, Liliana Edith</p>
    <p>ABUD, Horacio</p>
  </div>
  <div>
    <strong className="block text-gray-900">Estudiantes:</strong>
    <p>MERCADO, Gabriela Alejandra</p>
    <p>LOSSO, Miguel Alejandro</p>
    <p>MEGIAS, Franco Exequiel</p>
  </div>
  <div>
    <strong className="block text-gray-900">No Docentes:</strong>
    <p>ROMERO CACERES, Maria Ramona</p>
  </div>
  <div>
    <strong className="block text-gray-900">Graduados:</strong>
    <p>RAMIREZ, Maria Belen</p>
  </div>
</div>

        ),
        extension: (
            <div className="space-y-4 text-sm">
  <div>
    <strong className="block text-gray-900">Presidente:</strong>
    <p>Decana Silvina Valeria Schab</p>
  </div>
  <div>
    <strong className="block text-gray-900">Decano Sede Villa Union:</strong>
    <p>Ing. Silvio Alejandro Santillan</p>
  </div>
  <div>
    <strong className="block text-gray-900">Docentes:</strong>
    <p>VALBUENA LOPEZ, Alcira</p>
    <p>CESARINI, Claudia</p>
    <p>GARCIA MUÑOZ, Enrique</p>
    <p>PARCO PARISI, Laura</p>
    <p>BRITOS, Cristian Tomas</p>
  </div>
  <div>
    <strong className="block text-gray-900">Estudiantes:</strong>
    <p>PASSERA, Rocio Maria</p>
    <p>CASTRO, Maria Victoria</p>
    <p>GONZALEZ IRAMAIN, Sofia</p>
  </div>
  <div>
    <strong className="block text-gray-900">No Docentes:</strong>
    <p>REINOSO, Carlos Alberto</p>
  </div>
  <div>
    <strong className="block text-gray-900">Graduados:</strong>
    <p>NIEVAS, Ania Arabela</p>
  </div>
</div>

        )
    } 

    return (
       <div
        className="max-w-6xl mx-auto mt-4 md:mb-4 bg-white md:rounded-lg overflow-hidden"
        style={{
          boxShadow:
            "4px 4px 19px 5px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)",
        }}
      >
      {/* Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar (siempre visible) */}
        <div className="w-full md:w-1/3 md:border-r md:border-gray-400 bg-gray-50">
          {tabs.map((tab) => (
            <div key={tab.key}>
              <button
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-5 py-4 border-b border-gray-400 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "bg-primary text-white"
                    : "hover:bg-blue-100 text-gray-800"
                }`}
              >
                {tab.label}
              </button>

              {/* Mobile content shown below button */}
              {activeTab === tab.key && (
                <div className="md:hidden bg-white px-5 py-4 text-gray-700 border-b border-gray-400 animate-fade-in">
                  {content[tab.key]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop content */}
        <div className="hidden md:block flex-1 p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4 font-sans">
            {tabs.find((t) => t.key === activeTab).label}
          </h2>
          <div className="text-gray-800">{content[activeTab]}</div>
        </div>
      </div>
    </div>
    )
}

export default ConsejoComisiones;

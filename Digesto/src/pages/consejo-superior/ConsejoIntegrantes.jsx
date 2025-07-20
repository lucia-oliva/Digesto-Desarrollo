import { useState } from "react";

function ConsejoIntegrantes() {
  const [activeTab, setActiveTab] = useState("autoridades");

  const tabs = [
    { key: "autoridades", label: "Autoridades" },
    { key: "docentes", label: "Docentes" },
    { key: "nodocentes", label: "No Docentes" },
    { key: "estudiantes", label: "Estudiantes" },
  ];

  const content = {
    autoridades: (
      <div className="space-y-4 text-sm">
        <div>
          <strong className="block text-gray-900">Rector:</strong>
          <p>Lic. Fabian Alejandro CALDERON</p>
        </div>
        <div>
          <strong className="block text-gray-900">Vice Rector:</strong>
          <p>Ing. Jose GASPANELLO</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decana Dpto. Ciencias y Tecnologías Aplicadas a la Producción, al
            Ambiente y al Urbanismo:
          </strong>
          <p>Geol. Alicia Azucena LEIVA</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decana Dpto. Ciencias de la Salud:
          </strong>
          <p>Dra. Silvina Valeria SCHAB</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decano Dpto. Académico de Ciencias Exactas, Físicas y Naturales:
          </strong>
          <p>Lic. Marcelo MARTINEZ</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decano Dpto. Académico de Ciencias Sociales, Jurídicas y Económicas:
          </strong>
          <p>Cr. Juan CHADE</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decano Dpto. Académico de Ciencias Humanas y de la Educación:
          </strong>
          <p>Lic. Gustavo Eduardo KOFMAN</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decano Sede Universitaria Chamical:
          </strong>
          <p>Ing. José VERA DIAZ</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decano Sede Universitaria Villa Unión:
          </strong>
          <p>Ing. Silvio Alejandro SANTILLAN</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decana Sede Universitaria Chepes:
          </strong>
          <p>Bioq. Marta PATANE</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decano Sede Universitaria Aimogasta:
          </strong>
          <p>Ing. Luis Eduardo LUNA MERCADO</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Decano Sede Universitaria Catuna:
          </strong>
          <p>Dr. César Tadeo CARRIZO</p>
        </div>
        <div>
          <strong className="block text-gray-900">
            Secretario Relator Técnico:
          </strong>
          <p>Ab. Gonzalo Villach</p>
        </div>
      </div>
    ),
    docentes: (
      <div className="space-y-4 text-sm">
        <div>
          <p>
            <strong className=" text-gray-900">GUZZONATO</strong>, Ricardo A.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">ORTIZ</strong>, Jorge Mario.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">FLORES CORREA</strong>, Amalia.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">CAMPAZZO</strong>, Eduardo N.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">SANCHEZ</strong>, Liliana Edith.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">CESARINI</strong>, Claudia.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">RIBOLDI</strong>, Jorge Hugo.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">ORONA</strong>, Mario David.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">TORRES</strong>, Leila Lorena.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">ABUD</strong>, Horacio.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">MONTIVERO</strong>, Maria Silvia.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">PARCO PARISI</strong>, Laura A.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">VALBUENA LOPEZ</strong>, Alcira.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">CÁCERES</strong>, Mercedes Evelina.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">TEPER ORTIZ</strong>, Alfredo N.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">SANTILLAN</strong>, Alejo Rodrigo.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">HERRERA</strong>, Luis Eduardo.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">BORDON</strong>, Adriana Beatriz
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">BRITOS</strong>, Cristian Tomas
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">AGUERO</strong>, Jose Alejandro.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">CARBEL</strong>, Ricardo Baltazar
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">LUCERO</strong>, Nancy Beatriz
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">LLANOS</strong>, Victor Hugo
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">GARCIA MUÑOZ</strong>, Enrique
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">PAEZ</strong>, Valeria Fernanda
          </p>
        </div>
      </div>
    ),
    nodocentes: (
        <div className="space-y-4 text-sm">
            <div>
          <p>
            <strong className=" text-gray-900">VILTE</strong>, Beatriz Malvina
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">RIVADULLA</strong>, Ariel Alan
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">ESCUDERO</strong>, Patricia Ines
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">REINOSO</strong>, Carlos Alberto
          </p>
        </div>
        <div>
          <p className="mb-70">
            <strong className=" text-gray-900">ROMERO CACERES</strong>, Maria Ramona
          </p>
        </div>
        </div>
    ),
    graduados: (
        <div className="space-y-4 text-sm">
            <div>
          <p>
            <strong className=" text-gray-900">SANCHEZ ALEM</strong>, Jose B.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">MOLINA</strong>, Mauricio.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">RAMIREZ</strong>, Maria Belen.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">NIEVAS</strong>, Ania Arabela.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">DIAZ</strong>, Melisa Elizabeth.
          </p>
        </div>
        </div>
    ),
    estudiantes: (
        <div className="space-y-4 text-sm">
            <div>
          <p>
            <strong className=" text-gray-900">PASSERA</strong>, Rocio Maria
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">TRONCOSO</strong>, Ángel Martin.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">CARRIZO</strong>, Tamara Ayelen
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">CALLAPINO</strong>, FRanco M.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">CASTRO</strong>, Maria Victoria.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">LOSSO</strong>, Miguel Alejandro.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">OLIVA</strong>, Silvina Elizabeth
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">SARAVIA</strong>, Pablo David.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">MERCADO</strong>, Gabriela Alejandra.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">ECHEVERRÍA GONZALEZ</strong>, Alejandro.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">GONZALEZ IRAMAÍN</strong>, Sofia.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">CÓRDOBA</strong>, Adrian Gabriel.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">PERALTA</strong>, Cristian Nicolas.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">MALDONADO</strong>, Evangelina M.
          </p>
        </div>
        <div>
          <p>
            <strong className=" text-gray-900">MEGIAS</strong>, Franco Exequiel.
          </p>
        </div>
        </div>
    ),
  };

  return (
    <div
  className={
    `max-w-6xl mx-auto mt-4 md:mb-4 bg-white shadow md:rounded-lg overflow-hidden `
  }>
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
  );
}

export default ConsejoIntegrantes;

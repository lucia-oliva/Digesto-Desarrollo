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
        <p>Dra. Natalia Álvarez</p>
      </div>
      <div>
        <strong className="block text-gray-900">Vice Rector:</strong>
        <p>Ing. Luis Oscar Oviedo</p>
      </div>

      <div>
        <strong className="block text-gray-900">
          Decano/a Dpto. Ciencias y Tecnologías Aplicadas a la Producción, al Ambiente y al Urbanismo:
        </strong>
        <p>Cabrera, Villafañe Luis Alfredo</p>
      </div>

      <div>
        <strong className="block text-gray-900">Decano/a Dpto. Ciencias de la Salud:</strong>
        <p>Feryala, Cecilia Sara</p>
      </div>

      <div>
        <strong className="block text-gray-900">
          Decano/a Dpto. Académico de Ciencias Exactas, Físicas y Naturales:
        </strong>
        <p>Molina, Miguel Ángel</p>
      </div>

      <div>
        <strong className="block text-gray-900">
          Decano/a Dpto. Académico de Ciencias Sociales, Jurídicas y Económicas:
        </strong>
        <p>Peralta de la Fuente, María Inés</p>
      </div>

      <div>
        <strong className="block text-gray-900">
          Decano/a Dpto. Académico de Ciencias Humanas y de la Educación:
        </strong>
        <p>Fernández, Cynthia Noelia Del Valle</p>
      </div>

      <div>
        <strong className="block text-gray-900">Decano/a Sede Universitaria Chamical:</strong>
        <p>Quintero, Stella Maris</p>
      </div>

      <div>
        <strong className="block text-gray-900">Decano/a Sede Universitaria Villa Unión:</strong>
        <p>Brac, Luis Ángel</p>
      </div>

      <div>
        <strong className="block text-gray-900">Decano/a Sede Universitaria Chepes:</strong>
        <p>Lucero, Nancy Beatriz</p>
      </div>

      <div>
        <strong className="block text-gray-900">Decano/a Sede Universitaria Aimogasta:</strong>
        <p>Luna Mercado, Luis Eduardo</p>
      </div>

      <div>
        <strong className="block text-gray-900">Decano/a Sede Universitaria Catuna:</strong>
        <p>Muñoz, Gladys Viviana</p>
      </div>
    </div>
  ),

  docentes: (
    <div className="text-sm">
      <ul className="list-disc list-inside space-y-2">
        {/* Asuntos Académicos */}
        <li><strong>Titular:</strong> Valdés, Viviana Alejandra<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Castro, Lujan Graciela María</span></li>
        <li><strong>Titular:</strong> Escobar, Eduardo Ernesto<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Oliva, Cristian Alberto</span></li>
        <li><strong>Titular:</strong> Mercado, Adrián Gustavo<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Cuello, Daniel David</span></li>
        <li><strong>Titular:</strong> Candelero, Diego Javier<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Bocchi, José Agustín</span></li>
        <li><strong>Titular:</strong> Porras, Ofelia Gerónima<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Bertetto, Alejandra</span></li>

        {/* Interpretación y Reglamento */}
        <li><strong>Titular:</strong> Llorente, María De Las Nieves<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Gallardo, Oscar Francisco</span></li>
        <li><strong>Titular:</strong> Schab, Silvina Valeria<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Alba, Matías Guillermo</span></li>
        <li><strong>Titular:</strong> Munuce, Marcelo Alejandro<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Mercado, Paola Carina</span></li>
        <li><strong>Titular:</strong> Maza, Luis Aníbal<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Bernárdez, Rosa Delia</span></li>
        <li><strong>Titular:</strong> Matzkin, Cecilia Inés<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Quiroga, Sonia Beatriz</span></li>

        {/* Presupuesto y Hacienda */}
        <li><strong>Titular:</strong> Brizuela, Ana Gabriela<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Ceballos, Marcela Liliana</span></li>
        <li><strong>Titular:</strong> Quintero, Roberto Ezequiel<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> González, Gisela Luciana</span></li>
        <li><strong>Titular:</strong> Ibáñez, Yanina María<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Melidoro, Marcela Analía</span></li>
        <li><strong>Titular:</strong> Mercado, Andrea Carolina<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Bittar, Salim Issam</span></li>
        <li><strong>Titular:</strong> Santander, Claudia del Carmen<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Mazzucchelli, Hernán Javier</span></li>

        {/* Asuntos Generales */}
        <li><strong>Titular:</strong> Sánchez, Elvira Carla<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Ortiz, Jorge Mario</span></li>
        <li><strong>Titular:</strong> Orona, Mario David<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Romero, Carlos Horario</span></li>
        <li><strong>Titular:</strong> Nazar, María Inés<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Tutino, Alejandra Del Valle</span></li>
        <li><strong>Titular:</strong> Pugliese, Cristian Nicolás<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Villagra, Luis Alberto</span></li>
        <li><strong>Titular:</strong> Palis, Estela Maris<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Robledo, Diego</span></li>

        {/* Extensión, de Género y Relaciones Institucionales */}
        <li><strong>Titular:</strong> Blanes, Sandra del Valle<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Sánchez, Liliana Edith</span></li>
        <li><strong>Titular:</strong> Sosa Mangano, Gustavo Antonio<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Rodríguez, María Angélica</span></li>
        <li><strong>Titular:</strong> Sotomayor, Ana María<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Aciares, María Eugenia</span></li>
        <li><strong>Titular:</strong> Rivadeneira, María Eugenia<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Zalazar, María Inés</span></li>
        <li><strong>Titular:</strong> Maidana Parisi, Victor<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Córdoba, Beatriz del Valle</span></li>
      </ul>
    </div>
  ),

  nodocentes: (
    <div className="text-sm">
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Titular:</strong> Avallay, Hugo Hernán<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Gómez, Diego Fernando</span></li>
        <li><strong>Titular:</strong> Romero Cáceres, María Ramona<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Reinoso, Carlos Alberto</span></li>
        <li><strong>Titular:</strong> Troncoso, María Romina<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Mediavilla, Carlos Héctor</span></li>
        <li><strong>Titular:</strong> Ortega, Patricia de las Mercedes<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Moran, José Edgar</span></li>
        <li><strong>Titular:</strong> Romero, Valeria Dolores<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Díaz Bazán, Ruth</span></li>
      </ul>
    </div>
  ),

  graduados: (
    <div className="text-sm">
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Titular:</strong> Ávila, Rosario<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Páez, María Vanesa</span></li>
        <li><strong>Titular:</strong> Tejeda, Carlos Alejandro<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Aguirre Mercado Luna, Lucrecia</span></li>
        <li><strong>Titular:</strong> Cornejo, Gimena María Del Valle<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Corzo, Alejandro Javier</span></li>
        <li><strong>Titular:</strong> Sánchez, Leandro Iván<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Bazán Lucero, Marcos David Alberto</span></li>
        <li><strong>Titular:</strong> Flores, Walter Sebastián<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Valles, Melina De Los Ángeles</span></li>
      </ul>
    </div>
  ),

  estudiantes: (
    <div className="text-sm">
      <ul className="list-disc list-inside space-y-2">
        {/* Asuntos Académicos */}
        <li><strong>Titular:</strong> Boneu Krohn, Quimet Pascual<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Elorriaga, María Alejandra</span></li>
        <li><strong>Titular:</strong> Sánchez, Antonella<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Navarro, Claudia Marcela</span></li>
        <li><strong>Titular:</strong> Castro Correa, Agustina Marlen<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Sánchez Cohen, Augusto Rene</span></li>

        {/* Interpretación y Reglamento */}
        <li><strong>Titular:</strong> Gorosito, María Elena<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Ance, Celina Del Carmen</span></li>
        <li><strong>Titular:</strong> Díaz Muñoz, Abril Micaela<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Álvarez, Nadia Macarena</span></li>
        <li><strong>Titular:</strong> Bruni, Giuliana del Rocío<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> González Carrizo, Rocío Abigail</span></li>

        {/* Presupuesto y Hacienda */}
        <li><strong>Titular:</strong> Soria, Dalila Margarita<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Silva, Ignacio Nahuel</span></li>
        <li><strong>Titular:</strong> Díaz Chacoma, Victoria Canela<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Bracamonte Arias, Cristela Rocío</span></li>
        <li><strong>Titular:</strong> Vidal, Agustín Nicolás<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Pérez, Valeria Elizabeth</span></li>

        {/* Asuntos Generales */}
        <li><strong>Titular:</strong> Molina, Raúl Emilio<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Reyes Romero, Irina Lara</span></li>
        <li><strong>Titular:</strong> Peralta, Juan Esteban<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Navarro, Aylen Lucila</span></li>
        <li><strong>Titular:</strong> Artaza, Yamila Mariel<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Gallardo, Franco Manuel</span></li>

        {/* Extensión, de Género y Relaciones Institucionales */}
        <li><strong>Titular:</strong> Rodríguez, Guillermo Martín<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Castillo, Rubén Daniel</span></li>
        <li><strong>Titular:</strong> Correa Jorquera, Marcos Nicolás<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Romero, Rodolfo Tomás</span></li>
        <li><strong>Titular:</strong> Giménez, Dalila Fabiola<br/><span className="ml-6 text-gray-700"><strong>Suplente:</strong> Torres Karen, Viviana</span></li>
      </ul>
    </div>
  ),
};


  return (
   <div
      className="max-w-6xl mx-auto mt-4 md:mb-4 bg-white md:rounded-lg overflow-hidden"
      style={{
        boxShadow: "4px 4px 19px 5px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)",
      }}
    >

      {/* Layout */}
      <div className="flex flex-col md:flex-row pt-13">
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

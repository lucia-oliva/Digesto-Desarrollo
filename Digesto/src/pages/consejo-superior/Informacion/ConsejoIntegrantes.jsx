import ConsejoBase, { KeyValueGrid } from "./ConsejoBase";
import defaultPalette from "./palette";
import IntegrantesCuadros from "./IntegrantesCuadros";

function ConsejoIntegrantes() {
  const tabs = [
    { key: "autoridades", label: "Autoridades" },
    { key: "docentes", label: "Docentes" },
    { key: "nodocentes", label: "Nodocentes" },
    { key: "estudiantes", label: "Estudiantes" },
  ];

  const palette = {
    default: defaultPalette.default,
    autoridades: defaultPalette.blue,
    docentes: defaultPalette.emerald,
    nodocentes: defaultPalette.violet,
    estudiantes: defaultPalette.amber,
  };

  const pal = (k) => palette[k] ?? palette.autoridades;

  const autoridadesPairs = [
    ["Rector:", "Dra. Natalia Álvarez"],
    ["Vice Rector:", "Ing. Luis Oscar Oviedo"],
    [
      "Decano/a Dpto. Ciencias y Tecnologías Aplicadas a la Producción, al Ambiente y al Urbanismo:",
      "Cabrera, Villafañe Luis Alfredo",
    ],
    ["Decano/a Dpto. Ciencias de la Salud:", "Feryala, Cecilia Sara"],
    [
      "Decano/a Dpto. Académico de Ciencias Exactas, Físicas y Naturales:",
      "Molina, Miguel Ángel",
    ],
    [
      "Decano/a Dpto. Académico de Ciencias Sociales, Jurídicas y Económicas:",
      "Peralta de la Fuente, María Inés",
    ],
    [
      "Decano/a Dpto. Académico de Ciencias Humanas y de la Educación:",
      "Fernández, Cynthia Noelia Del Valle",
    ],
    ["Decano/a Sede Universitaria Chamical:", "Quintero, Stella Maris"],
    ["Decano/a Sede Universitaria Villa Unión:", "Brac, Luis Ángel"],
    ["Decano/a Sede Universitaria Chepes:", "Lucero, Nancy Beatriz"],
    ["Decano/a Sede Universitaria Aimogasta:", "Luna Mercado, Luis Eduardo"],
    ["Decano/a Sede Universitaria Catuna:", "Muñoz, Gladys Viviana"],
  ];

  const docentesItems = {
    titulares: [
      "Valdés, Viviana Alejandra",
      "Escobar, Eduardo Ernesto",
      "Mercado, Adrián Gustavo",
      "Candelero, Diego Javier",
      "Porras, Ofelia Gerónima",
      "Llorente, María De Las Nieves",
      "Schab, Silvina Valeria",
      "Munuce, Marcelo Alejandro",
      "Maza, Luis Aníbal",
      "Matzkin, Cecilia Inés",
      "Brizuela, Ana Gabriela",
      "Quintero, Roberto Ezequiel",
      "Ibáñez, Yanina María",
      "Mercado, Andrea Carolina",
      "Santander, Claudia del Carmen",
      "Sánchez, Elvira Carla",
      "Orona, Mario David",
      "Nazar, María Inés",
      "Pugliese, Cristian Nicolás",
      "Palis, Estela Maris",
      "Blanes, Sandra del Valle",
      "Sosa Mangano, Gustavo Antonio",
      "Sotomayor, Ana María",
      "Rivadeneira, María Eugenia",
      "Maidana Parisi, Victor",
    ],
    suplentes: [
      "Castro, Lujan Graciela María",
      "Oliva, Cristian Alberto",
      "Cuello, Daniel David",
      "Bocchi, José Agustín",
      "Bertetto, Alejandra",
      "Gallardo, Oscar Francisco",
      "Alba, Matías Guillermo",
      "Mercado, Paola Carina",
      "Bernárdez, Rosa Delia",
      "Quiroga, Sonia Beatriz",
      "Ceballos, Marcela Liliana",
      "González, Gisela Luciana",
      "Melidoro, Marcela Analía",
      "Bittar, Salim Issam",
      "Mazzucchelli, Hernán Javier",
      "Ortiz, Jorge Mario",
      "Romero, Carlos Horario",
      "Tutino, Alejandra Del Valle",
      "Villagra, Luis Alberto",
      "Robledo, Diego",
      "Sánchez, Liliana Edith",
      "Rodríguez, María Angélica",
      "Aciares, María Eugenia",
      "Zalazar, María Inés",
      "Córdoba, Beatriz del Valle",
    ],
  };

  const nodocentesItems = {
    titulares: [
      "Avallay, Hugo Hernán",
      "Romero Cáceres, María Ramona",
      "Troncoso, María Romina",
      "Ortega, Patricia de las Mercedes",
      "Romero, Valeria Dolores",
    ],
    suplentes: [
      "Gómez, Diego Fernando",
      "Reinoso, Carlos Alberto",
      "Mediavilla, Carlos Héctor",
      "Moran, José Edgar",
      "Díaz Bazán, Ruth",
    ],
  };

  const estudiantesItems = {
    titulares: [
      "Boneu Krohn, Quimet Pascual",
      "Sánchez, Antonella",
      "Castro Correa, Agustina Marlen",
      "Gorosito, María Elena",
      "Díaz Muñoz, Abril Micaela",
      "Bruni, Giuliana del Rocío",
      "Soria, Dalila Margarita",
      "Díaz Chacoma, Victoria Canela",
      "Vidal, Agustín Nicolás",
      "Molina, Raúl Emilio",
      "Peralta, Juan Esteban",
      "Artaza, Yamila Mariel",
      "Rodríguez, Guillermo Martín",
      "Correa Jorquera, Marcos Nicolás",
      "Giménez, Dalila Fabiola",
    ],
    suplentes: [
      "Elorriaga, María Alejandra",
      "Navarro, Claudia Marcela",
      "Sánchez Cohen, Augusto Rene",
      "Ance, Celina Del Carmen",
      "Álvarez, Nadia Macarena",
      "González Carrizo, Rocío Abigail",
      "Silva, Ignacio Nahuel",
      "Bracamonte Arias, Cristela Rocío",
      "Pérez, Valeria Elizabeth",
      "Reyes Romero, Irina Lara",
      "Navarro, Aylen Lucila",
      "Gallardo, Franco Manuel",
      "Castillo, Rubén Daniel",
      "Romero, Rodolfo Tomás",
      "Torres Karen, Viviana",
    ],
  };

  const content = {
    autoridades: (
      <KeyValueGrid pairs={autoridadesPairs} pal={pal("autoridades")} />
    ),
    docentes: <IntegrantesCuadros data={docentesItems} pal={pal("docentes")} />,
    nodocentes: (
      <IntegrantesCuadros data={nodocentesItems} pal={pal("nodocentes")} />
    ),
    estudiantes: (
      <IntegrantesCuadros data={estudiantesItems} pal={pal("estudiantes")} />
    ),
  };

  const counts = {
    autoridades: autoridadesPairs.length,
    docentes: docentesItems.length,
    nodocentes: nodocentesItems.length,
    estudiantes: estudiantesItems.length,
  };

  return (
    <ConsejoBase
      title="Consejo Superior"
      subtitle="Integrantes"
      tabs={tabs}
      content={content}
      palette={palette}
      counts={counts}
      initialTabKey="autoridades"
    />
  );
}

export default ConsejoIntegrantes;

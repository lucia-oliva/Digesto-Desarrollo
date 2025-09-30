import ConsejoBase, {SectionList, KeyValueGrid } from "./ConsejoBase";
import defaultPalette from "./palette";

function ConsejoIntegrantes() {
  const tabs = [
    { key: "autoridades", label: "Autoridades" },
    { key: "docentes", label: "Docentes" },
    { key: "nodocentes", label: "No Docentes" },
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
    ["Decano/a Dpto. Ciencias y Tecnologías Aplicadas a la Producción, al Ambiente y al Urbanismo:", "Cabrera, Villafañe Luis Alfredo"],
    ["Decano/a Dpto. Ciencias de la Salud:", "Feryala, Cecilia Sara"],
    ["Decano/a Dpto. Académico de Ciencias Exactas, Físicas y Naturales:", "Molina, Miguel Ángel"],
    ["Decano/a Dpto. Académico de Ciencias Sociales, Jurídicas y Económicas:", "Peralta de la Fuente, María Inés"],
    ["Decano/a Dpto. Académico de Ciencias Humanas y de la Educación:", "Fernández, Cynthia Noelia Del Valle"],
    ["Decano/a Sede Universitaria Chamical:", "Quintero, Stella Maris"],
    ["Decano/a Sede Universitaria Villa Unión:", "Brac, Luis Ángel"],
    ["Decano/a Sede Universitaria Chepes:", "Lucero, Nancy Beatriz"],
    ["Decano/a Sede Universitaria Aimogasta:", "Luna Mercado, Luis Eduardo"],
    ["Decano/a Sede Universitaria Catuna:", "Muñoz, Gladys Viviana"],
  ];

  const docentesItems = [
    ["Titular:", "Valdés, Viviana Alejandra", "Suplente:", "Castro, Lujan Graciela María"],
    ["Titular:", "Escobar, Eduardo Ernesto", "Suplente:", "Oliva, Cristian Alberto"],
    ["Titular:", "Mercado, Adrián Gustavo", "Suplente:", "Cuello, Daniel David"],
    ["Titular:", "Candelero, Diego Javier", "Suplente:", "Bocchi, José Agustín"],
    ["Titular:", "Porras, Ofelia Gerónima", "Suplente:", "Bertetto, Alejandra"],
    ["Titular:", "Llorente, María De Las Nieves", "Suplente:", "Gallardo, Oscar Francisco"],
    ["Titular:", "Schab, Silvina Valeria", "Suplente:", "Alba, Matías Guillermo"],
    ["Titular:", "Munuce, Marcelo Alejandro", "Suplente:", "Mercado, Paola Carina"],
    ["Titular:", "Maza, Luis Aníbal", "Suplente:", "Bernárdez, Rosa Delia"],
    ["Titular:", "Matzkin, Cecilia Inés", "Suplente:", "Quiroga, Sonia Beatriz"],
    ["Titular:", "Brizuela, Ana Gabriela", "Suplente:", "Ceballos, Marcela Liliana"],
    ["Titular:", "Quintero, Roberto Ezequiel", "Suplente:", "González, Gisela Luciana"],
    ["Titular:", "Ibáñez, Yanina María", "Suplente:", "Melidoro, Marcela Analía"],
    ["Titular:", "Mercado, Andrea Carolina", "Suplente:", "Bittar, Salim Issam"],
    ["Titular:", "Santander, Claudia del Carmen", "Suplente:", "Mazzucchelli, Hernán Javier"],
    ["Titular:", "Sánchez, Elvira Carla", "Suplente:", "Ortiz, Jorge Mario"],
    ["Titular:", "Orona, Mario David", "Suplente:", "Romero, Carlos Horario"],
    ["Titular:", "Nazar, María Inés", "Suplente:", "Tutino, Alejandra Del Valle"],
    ["Titular:", "Pugliese, Cristian Nicolás", "Suplente:", "Villagra, Luis Alberto"],
    ["Titular:", "Palis, Estela Maris", "Suplente:", "Robledo, Diego"],
    ["Titular:", "Blanes, Sandra del Valle", "Suplente:", "Sánchez, Liliana Edith"],
    ["Titular:", "Sosa Mangano, Gustavo Antonio", "Suplente:", "Rodríguez, María Angélica"],
    ["Titular:", "Sotomayor, Ana María", "Suplente:", "Aciares, María Eugenia"],
    ["Titular:", "Rivadeneira, María Eugenia", "Suplente:", "Zalazar, María Inés"],
    ["Titular:", "Maidana Parisi, Victor", "Suplente:", "Córdoba, Beatriz del Valle"],
  ];

  const nodocentesItems = [
    ["Titular:", "Avallay, Hugo Hernán", "Suplente:", "Gómez, Diego Fernando"],
    ["Titular:", "Romero Cáceres, María Ramona", "Suplente:", "Reinoso, Carlos Alberto"],
    ["Titular:", "Troncoso, María Romina", "Suplente:", "Mediavilla, Carlos Héctor"],
    ["Titular:", "Ortega, Patricia de las Mercedes", "Suplente:", "Moran, José Edgar"],
    ["Titular:", "Romero, Valeria Dolores", "Suplente:", "Díaz Bazán, Ruth"],
  ];

  const estudiantesItems = [
    ["Titular:", "Boneu Krohn, Quimet Pascual", "Suplente:", "Elorriaga, María Alejandra"],
    ["Titular:", "Sánchez, Antonella", "Suplente:", "Navarro, Claudia Marcela"],
    ["Titular:", "Castro Correa, Agustina Marlen", "Suplente:", "Sánchez Cohen, Augusto Rene"],
    ["Titular:", "Gorosito, María Elena", "Suplente:", "Ance, Celina Del Carmen"],
    ["Titular:", "Díaz Muñoz, Abril Micaela", "Suplente:", "Álvarez, Nadia Macarena"],
    ["Titular:", "Bruni, Giuliana del Rocío", "Suplente:", "González Carrizo, Rocío Abigail"],
    ["Titular:", "Soria, Dalila Margarita", "Suplente:", "Silva, Ignacio Nahuel"],
    ["Titular:", "Díaz Chacoma, Victoria Canela", "Suplente:", "Bracamonte Arias, Cristela Rocío"],
    ["Titular:", "Vidal, Agustín Nicolás", "Suplente:", "Pérez, Valeria Elizabeth"],
    ["Titular:", "Molina, Raúl Emilio", "Suplente:", "Reyes Romero, Irina Lara"],
    ["Titular:", "Peralta, Juan Esteban", "Suplente:", "Navarro, Aylen Lucila"],
    ["Titular:", "Artaza, Yamila Mariel", "Suplente:", "Gallardo, Franco Manuel"],
    ["Titular:", "Rodríguez, Guillermo Martín", "Suplente:", "Castillo, Rubén Daniel"],
    ["Titular:", "Correa Jorquera, Marcos Nicolás", "Suplente:", "Romero, Rodolfo Tomás"],
    ["Titular:", "Giménez, Dalila Fabiola", "Suplente:", "Torres Karen, Viviana"],
  ];

  const content = {
    autoridades: <KeyValueGrid pairs={autoridadesPairs} pal={pal("autoridades")} />,
    docentes: <SectionList items={docentesItems} pal={pal("docentes")} />,
    nodocentes: <SectionList items={nodocentesItems} pal={pal("nodocentes")} />,
    estudiantes: <SectionList items={estudiantesItems} pal={pal("estudiantes")} />,
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

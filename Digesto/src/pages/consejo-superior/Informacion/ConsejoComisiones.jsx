/* eslint-disable react/prop-types */
import ConsejoBase, { SectionList, KeyValueGrid} from "./ConsejoBase";
import defaultPalette from "./palette";

function ConsejoComisiones() {
  const tabs = [
    { key: "asuntosAcademicos", label: "Asuntos Académicos" },
    { key: "interpretacion", label: "Interpretación y Reglamento" },
    { key: "presupuesto", label: "Presupuesto y Hacienda" },
    { key: "asuntosGenerales", label: "Asuntos Generales" },
    { key: "extension", label: "Extensión, Género y RR. Institucionales" },
  ];

 
  const palette = {
    default: defaultPalette.default,
    asuntosAcademicos: defaultPalette.blue,
    interpretacion: defaultPalette.emerald,
    presupuesto: defaultPalette.violet,
    asuntosGenerales: defaultPalette.amber,
    extension: defaultPalette.blue, 
  };
  const pal = (k) => palette[k] ?? palette.default;

  const aaAutoridades = [
    ["Presidente:", "Decano del Dpto. Ciencias Aplicadas a la Producción, al Ambiente y al Urbanismo — Cabrera Villafañe, Luis Alfredo"],
    ["Vicepresidente:", "Decano Sede Regional Aimogasta — Ing. Luis Eduardo Luna Mercado"],
  ];
  const aaDocentes = [
    ["Titular:", "Valdés, Viviana Alejandra", "Suplente:", "Castro, Lujan Graciela María"],
    ["Titular:", "Escobar, Eduardo Ernesto", "Suplente:", "Oliva, Cristian Alberto"],
    ["Titular:", "Mercado, Adrián Gustavo", "Suplente:", "Cuello, Daniel David"],
    ["Titular:", "Candelero, Diego Javier", "Suplente:", "Bocchi, José Agustín"],
    ["Titular:", "Porras, Ogelia Gerónima", "Suplente:", "Bertetto, Alejandra"],
  ];
  const aaNoDoc = [
    ["Titular:", "Avallay, Hugo Hernán", "Suplente:", "Gómez, Diego Fernando"],
  ];
  const aaEst = [
    ["Titular:", "Boneu Krohn, Quimet Pascual", "Suplente:", "Elorriaga, María Alejandra"],
    ["Titular:", "Sánchez, Antonella", "Suplente:", "Navarro, Claudia Marcela"],
    ["Titular:", "Castro Correa, Agustina Marlen", "Suplente:", "Sánchez Cohen, Augusto Rene"],
  ];
  const aaGrad = [
    ["Titular:", "Ávila, Rosario", "Suplente:", "Páez, María Vanesa"],
  ];
  const irAutoridades = [
    ["Presidente:", "Decana del Dpto. Cs. Sociales, Jurídicas y Económicas — Peralta de la Fuente, María Inés"],
    ["Vicepresidente:", "Decana Sede Regional Chepes — Lucero, Nancy Beatriz"],
  ];
  const irDocentes = [
    ["Titular:", "Llorente, María De Las Nieves", "Suplente:", "Gallardo, Oscar Francisco"],
    ["Titular:", "Schab, Silvina Valeria", "Suplente:", "Alba, Matias Guillermo"],
    ["Titular:", "Munuce, Marcelo Alejandro", "Suplente:", "Mercado, Paola Carina"],
    ["Titular:", "Maza, Luis Aníbal", "Suplente:", "Bernández, Rosa Delia"],
    ["Titular:", "Matzkin, Cecilia Inés", "Suplente:", "Quiroga, Sonia Beatriz"],
  ];
  const irNoDoc = [
    ["Titular:", "Romero Cáceres, María Ramona", "Suplente:", "Reinoso, Carlos Alberto"],
  ];
  const irEst = [
    ["Titular:", "Gorosito, María Elena", "Suplente:", "Ance, Celina Del Carmen"],
    ["Titular:", "Diaz Muñoz, Abril Micaela", "Suplente:", "Álvarez, Nadia Macarena"],
    ["Titular:", "Bruni, Giuliana del Rocío", "Suplente:", "González Carrizo, Rocío Abigail"],
  ];
  const irGrad = [
    ["Titular:", "Tejeda, Carlos Alejandro", "Suplente:", "Aguirre Mercado Luna, Lucrecia"],
  ];
  const phAutoridades = [
    ["Presidente:", "Decano del Dpto. Cs. Exactas, Físicas y Naturales — Molina, Miguel Ángel"],
    ["Vicepresidente:", "Decana Sede Regional Chamical — Quintero, Stella Maris"],
  ];
  const phDocentes = [
    ["Titular:", "Brizuela, Ana Gabriela", "Suplente:", "Ceballos, Marcela Liliana"],
    ["Titular:", "Quintero, Roberto Ezequiel", "Suplente:", "González, Gisela Luciana"],
    ["Titular:", "Ibáñez, Yanina María", "Suplente:", "Melidoro, Marcela Analía"],
    ["Titular:", "Mercado, Andrea Carolina", "Suplente:", "Bittar, Salim Issam"],
    ["Titular:", "Santander, Claudia del Carmen", "Suplente:", "Mazzucchelli, Hernán Javier"],
  ];
  const phNoDoc = [
    ["Titular:", "Troncoso, María Romina", "Suplente:", "Mediavilla, Carlos Héctor"],
  ];
  const phEst = [
    ["Titular:", "Soria, Dalila Margarita", "Suplente:", "Silva, Ignacio Nahuel"],
    ["Titular:", "Díaz Chacoma, Victoria Canela", "Suplente:", "Bracamonte Arias, Cristela Rocío"],
    ["Titular:", "Vidal, Agustín Nicolás", "Suplente:", "Pérez, Valeria Elizabeth"],
  ];
  const phGrad = [
    ["Titular:", "Cornejo, Gimenza María del Valle", "Suplente:", "Corzo, Alejandro Javier"],
  ];
  const agAutoridades = [
    ["Presidente:", "Decana del Dpto. Cs. Humanas y de la Educación — Fernández, Cynthia Noelia Del Valle"],
    ["Vicepresidente:", "Decana Sede Regional Catuna — Muñoz, Gladys Viviana"],
  ];
  const agDocentes = [
    ["Titular:", "Sánchez, Elvira Carla", "Suplente:", "Ortiz, Jorge Mario"],
    ["Titular:", "Orona, Mario David", "Suplente:", "Romero, Carlos Horacio"],
    ["Titular:", "Nazar, María Inés", "Suplente:", "Tutino, Alejandra Del Valle"],
    ["Titular:", "Pugliese, Cristian Nicolás", "Suplente:", "Villagra, Luis Alberto"],
    ["Titular:", "Palis, Estela Maris", "Suplente:", "Robledo, Diego"],
  ];
  const agNoDoc = [
    ["Titular:", "Ortega, Patricia de las Mercedes", "Suplente:", "Moran, José Edgar"],
  ];
  const agEst = [
    ["Titular:", "Molina, Raúl Emilio", "Suplente:", "Reyes Romero, Irina Lara"],
    ["Titular:", "Peralta, Juan Esteban", "Suplente:", "Navarro, Aylen Lucila"],
    ["Titular:", "Artaza, Yamila Mariel", "Suplente:", "Gallardo, Franco Manuel"],
  ];
  const agGrad = [
    ["Titular:", "Sánchez, Leandro Iván", "Suplente:", "Bazán Lucero, Marcos David Alberto"],
  ];
  const exAutoridades = [
    ["Presidente:", "Decana del Dpto. Ciencias de la Salud — Feryala, Cecilia Sara"],
    ["Vicepresidente:", "Decano Sede Regional Villa Unión — Brac, Luis Ángel"],
  ];
  const exDocentes = [
    ["Titular:", "Blanes, Sandra del Valle", "Suplente:", "Sánchez, Liliana Edith"],
    ["Titular:", "Sosa Mangano, Gustavo Antonio", "Suplente:", "Rodríguez, María Angélica"],
    ["Titular:", "Sotomayor, Ana María", "Suplente:", "Aciares, María Eugenia"],
    ["Titular:", "Rivadeneira, María Eugenia", "Suplente:", "Zalazar, María Inés"],
    ["Titular:", "Maidana Parisi, Victor", "Suplente:", "Córdoba, Beatriz del Valle"],
  ];
  const exNoDoc = [
    ["Titular:", "Romero, Valeria Dolores", "Suplente:", "Díaz Bazán, Ruth"],
  ];
  const exEst = [
    ["Titular:", "Rodríguez, Guillermo Martin", "Suplente:", "Castillo, Rubén Daniel"],
    ["Titular:", "Correa, Jorquera Marcos", "Suplente:", "Romero, Rodolfo Tomás"],
    ["Titular:", "Giménez, Dalila Fabiola", "Suplente:", "Torres Karen, Viviana"],
  ];
  const exGrad = [
    ["Titular:", "Flores, Walter Sebastián", "Suplente:", "Valles, Melina De Los Ángeles"],
  ];

  const content = {
    asuntosAcademicos: (
      <div className="space-y-6">
        <KeyValueGrid pairs={aaAutoridades} pal={pal("asuntosAcademicos")} />
        <SectionBlock title="Docentes" items={aaDocentes} pal={pal("asuntosAcademicos")} />
        <SectionBlock title="No Docentes" items={aaNoDoc} pal={pal("asuntosAcademicos")} />
        <SectionBlock title="Estudiantes" items={aaEst} pal={pal("asuntosAcademicos")} />
        <SectionBlock title="Graduados" items={aaGrad} pal={pal("asuntosAcademicos")} />
      </div>
    ),
    interpretacion: (
      <div className="space-y-6">
        <KeyValueGrid pairs={irAutoridades} pal={pal("interpretacion")} />
        <SectionBlock title="Docentes" items={irDocentes} pal={pal("interpretacion")} />
        <SectionBlock title="No Docentes" items={irNoDoc} pal={pal("interpretacion")} />
        <SectionBlock title="Estudiantes" items={irEst} pal={pal("interpretacion")} />
        <SectionBlock title="Graduados" items={irGrad} pal={pal("interpretacion")} />
      </div>
    ),
    presupuesto: (
      <div className="space-y-6">
        <KeyValueGrid pairs={phAutoridades} pal={pal("presupuesto")} />
        <SectionBlock title="Docentes" items={phDocentes} pal={pal("presupuesto")} />
        <SectionBlock title="No Docentes" items={phNoDoc} pal={pal("presupuesto")} />
        <SectionBlock title="Estudiantes" items={phEst} pal={pal("presupuesto")} />
        <SectionBlock title="Graduados" items={phGrad} pal={pal("presupuesto")} />
      </div>
    ),
    asuntosGenerales: (
      <div className="space-y-6">
        <KeyValueGrid pairs={agAutoridades} pal={pal("asuntosGenerales")} />
        <SectionBlock title="Docentes" items={agDocentes} pal={pal("asuntosGenerales")} />
        <SectionBlock title="No Docentes" items={agNoDoc} pal={pal("asuntosGenerales")} />
        <SectionBlock title="Estudiantes" items={agEst} pal={pal("asuntosGenerales")} />
        <SectionBlock title="Graduados" items={agGrad} pal={pal("asuntosGenerales")} />
      </div>
    ),
    extension: (
      <div className="space-y-6">
        <KeyValueGrid pairs={exAutoridades} pal={pal("extension")} />
        <SectionBlock title="Docentes" items={exDocentes} pal={pal("extension")} />
        <SectionBlock title="No Docentes" items={exNoDoc} pal={pal("extension")} />
        <SectionBlock title="Estudiantes" items={exEst} pal={pal("extension")} />
        <SectionBlock title="Graduados" items={exGrad} pal={pal("extension")} />
      </div>
    ),
  };

  const counts = {
    asuntosAcademicos: aaAutoridades.length + aaDocentes.length + aaNoDoc.length + aaEst.length + aaGrad.length,
    interpretacion:   irAutoridades.length + irDocentes.length + irNoDoc.length + irEst.length + irGrad.length,
    presupuesto:      phAutoridades.length + phDocentes.length + phNoDoc.length + phEst.length + phGrad.length,
    asuntosGenerales: agAutoridades.length + agDocentes.length + agNoDoc.length + agEst.length + agGrad.length,
    extension:        exAutoridades.length + exDocentes.length + exNoDoc.length + exEst.length + exGrad.length,
  };

  return (
    <ConsejoBase
      title="Consejo Superior"
      subtitle="Comisiones"
      tabs={tabs}
      content={content}
      palette={palette}
      counts={counts}
      initialTabKey="asuntosAcademicos"
    />
  );
}


function SectionBlock({ title, items, pal }) {
  return (
    <div>
      <h3 className={["mb-2 text-sm font-semibold", pal?.label ?? "text-gray-900"].join(" ")}>
        {title}
      </h3>
      <SectionList items={items} pal={pal} />
    </div>
  );
}

export default ConsejoComisiones;

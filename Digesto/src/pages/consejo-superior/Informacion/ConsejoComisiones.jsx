/* eslint-disable react/prop-types */
import ConsejoBase from "./ConsejoBase";
import defaultPalette from "./palette";

function ConsejoComisiones() {
  const tabs = [
    { key: "asuntosAcademicos", label: "Asuntos Académicos" },
    { key: "interpretacion", label: "Interpretación y Reglamento" },
    { key: "presupuesto", label: "Presupuesto y Hacienda" },
    { key: "asuntosGenerales", label: "Asuntos Generales" },
    { key: "extension", label: "Extensión, Género y Relaciones Institucionales" },
  ];

  const palette = {
    default: defaultPalette.blue,
    asuntosAcademicos: defaultPalette.blue,
    interpretacion: defaultPalette.blue,
    presupuesto: defaultPalette.blue,
    asuntosGenerales: defaultPalette.blue,
    extension: defaultPalette.blue,
  };

  const pal = (k) => palette[k] ?? palette.default;

  const aaAutoridades = [
    [
      "Presidente:",
      "Decano del Dpto. Ciencias Aplicadas a la Producción, al Ambiente y al Urbanismo — Cabrera Villafañe, Luis Alfredo",
    ],
    [
      "Vicepresidente:",
      "Decano Sede Regional Aimogasta — Luna Mercado, Luis Eduardo",
    ],
  ];

  const aaDocentes = [
    [
      "Titular:",
      "Valdés, Viviana Alejandra",
      "Suplente:",
      "Castro, Lujan Graciela María",
    ],
    [
      "Titular:",
      "Escobar, Eduardo Ernesto",
      "Suplente:",
      "Oliva, Cristian Alberto",
    ],
    [
      "Titular:",
      "Mercado, Adrián Gustavo",
      "Suplente:",
      "Cuello, Daniel David",
    ],
    [
      "Titular:",
      "Candelero, Diego Javier",
      "Suplente:",
      "Bocchi, José Agustín",
    ],
    ["Titular:", "Porras, Ogelia Gerónima", "Suplente:", "Bertetto, Alejandra"],
  ];

  const aaNoDoc = [
    ["Titular:", "Avallay, Hugo Hernán", "Suplente:", "Gómez, Diego Fernando"],
  ];

  const aaEst = [
    [
      "Titular:",
      "Boneu Krohn, Quimet Pascual",
      "Suplente:",
      "Elorriaga, María Alejandra",
    ],
    ["Titular:", "Sánchez, Antonella", "Suplente:", "Navarro, Claudia Marcela"],
    [
      "Titular:",
      "Castro Correa, Agustina Marlen",
      "Suplente:",
      "Sánchez Cohen, Augusto Rene",
    ],
  ];

  const aaGrad = [
    ["Titular:", "Ávila, Rosario", "Suplente:", "Páez, María Vanesa"],
  ];

  const irAutoridades = [
    [
      "Presidenta:",
      "Decana del Dpto. Cs. Sociales, Jurídicas y Económicas — Peralta de la Fuente, María Inés",
    ],
    ["Vicepresidenta:", "Decana Sede Regional Chepes — Lucero, Nancy Beatriz"],
  ];

  const irDocentes = [
    [
      "Titular:",
      "Llorente, María De Las Nieves",
      "Suplente:",
      "Gallardo, Oscar Francisco",
    ],
    [
      "Titular:",
      "Schab, Silvina Valeria",
      "Suplente:",
      "Alba, Matias Guillermo",
    ],
    [
      "Titular:",
      "Munuce, Marcelo Alejandro",
      "Suplente:",
      "Mercado, Paola Carina",
    ],
    ["Titular:", "Maza, Luis Aníbal", "Suplente:", "Bernández, Rosa Delia"],
    [
      "Titular:",
      "Matzkin, Cecilia Inés",
      "Suplente:",
      "Quiroga, Sonia Beatriz",
    ],
  ];

  const irNoDoc = [
    [
      "Titular:",
      "Romero Cáceres, María Ramona",
      "Suplente:",
      "Reinoso, Carlos Alberto",
    ],
  ];

  const irEst = [
    [
      "Titular:",
      "Gorosito, María Elena",
      "Suplente:",
      "Ance, Celina Del Carmen",
    ],
    [
      "Titular:",
      "Diaz Muñoz, Abril Micaela",
      "Suplente:",
      "Álvarez, Nadia Macarena",
    ],
    [
      "Titular:",
      "Díaz Chacoma, Victoria Canela",
      "Suplente:",
      "Bracamonte Arias, Cristela Rocio",
    ],
  ];

  const irGrad = [
    [
      "Titular:",
      "Tejeda, Carlos Alejandro",
      "Suplente:",
      "Aguirre Mercado Luna, Lucrecia",
    ],
  ];

  const phAutoridades = [
    [
      "Presidente:",
      "Decano del Dpto. Cs. Exactas, Físicas y Naturales — Molina, Miguel Ángel",
    ],
    [
      "Vicepresidente:",
      "Decana Sede Regional Chamical — Quintero, Stella Maris",
    ],
  ];

  const phDocentes = [
    [
      "Titular:",
      "Brizuela, Ana Gabriela",
      "Suplente:",
      "Ceballos, Marcela Liliana",
    ],
    [
      "Titular:",
      "Quintero, Roberto Ezequiel",
      "Suplente:",
      "González, Gisela Luciana",
    ],
    [
      "Titular:",
      "Sánchez, Elvira Carla",
      "Suplente:",
      "Ortiz, Jorge Mario",
    ],
    [
      "Titular:",
      "Mercado, Andrea Carolina",
      "Suplente:",
      "Bittar, Salim Issam",
    ],
    [
      "Titular:",
      "Santander, Claudia del Carmen",
      "Suplente:",
      "Mazzucchelli, Hernán Javier",
    ],
  ];

  const phNoDoc = [
    [
      "Titular:",
      "Troncoso, María Romina",
      "Suplente:",
      "Mediavilla, Carlos Héctor",
    ],
  ];

  const phEst = [
    [
      "Titular:",
      "Soria, Dalila Margarita",
      "Suplente:",
      "Silva, Ignacio Nahuel",
    ],
    [
      "Titular:",
      "Peralta Juan Esteban",
      "Suplente:",
      "Navarro, Aylen Lucila",
    ],
    [
      "Titular:",
      "Vidal, Agustín Nicolás",
      "Suplente:",
      "Pérez, Valeria Elizabeth",
    ],
  ];

  const phGrad = [
    [
      "Titular:",
      "Cornejo, Gimenza María del Valle",
      "Suplente:",
      "Corzo, Alejandro Javier",
    ],
  ];

  const agAutoridades = [
    [
      "Presidenta:",
      "Decana del Dpto. Cs. Humanas y de la Educación — Fernández, Cynthia Noelia Del Valle",
    ],
    ["Vicepresidenta:", "Decana Sede Regional Catuna — Muñoz, Gladys Viviana"],
  ];

  const agDocentes = [
    ["Titular:", "Ibañez, Yanina María", "Suplente:", "Melidoro, Marcela Analia"],
    ["Titular:", "Orona, Mario David", "Suplente:", "Romero, Carlos Horacio"],
    [
      "Titular:",
      "Nazar, María Inés",
      "Suplente:",
      "Tutino, Alejandra Del Valle",
    ],
    [
      "Titular:",
      "Pugliese, Cristian Nicolás",
      "Suplente:",
      "Villagra, Luis Alberto",
    ],
    ["Titular:", "Palis, Estela Maris", "Suplente:", "Robledo, Diego"],
  ];

  const agNoDoc = [
    [
      "Titular:",
      "Ortega, Patricia de las Mercedes",
      "Suplente:",
      "Moran, José Edgar",
    ],
  ];

  const agEst = [
    [
      "Titular:",
      "Molina, Raúl Emilio",
      "Suplente:",
      "Reyes Romero, Irina Lara",
    ],
    ["Titular:", "Rodríguez, Guillermo Martin", "Suplente:", "Castillo, Rubén Daniel"],
    [
      "Titular:",
      "Artaza, Yamila Mariel",
      "Suplente:",
      "Gallardo, Franco Manuel",
    ],
  ];

  const agGrad = [
    [
      "Titular:",
      "Sánchez, Leandro Iván",
      "Suplente:",
      "Bazán Lucero, Marcos David Alberto",
    ],
  ];

  const exAutoridades = [
    [
      "Presidenta:",
      "Decana del Dpto. Ciencias de la Salud — Feryala, Cecilia Sara",
    ],
    ["Vicepresidente:", "Decano Sede Regional Villa Unión — Brac, Luis Ángel"],
  ];

  const exDocentes = [
    [
      "Titular:",
      "Blanes, Sandra del Valle",
      "Suplente:",
      "Sánchez, Liliana Edith",
    ],
    [
      "Titular:",
      "Sosa Mangano, Gustavo Antonio",
      "Suplente:",
      "Rodríguez, María Angélica",
    ],
    ["Titular:", "Sotomayor, Ana María", "Suplente:", "Aciares, María Eugenia"],
    [
      "Titular:",
      "Rivadeneira, María Eugenia",
      "Suplente:",
      "Zalazar, María Inés",
    ],
    [
      "Titular:",
      "Maidana Parisi, Victor",
      "Suplente:",
      "Córdoba, Beatriz del Valle",
    ],
  ];

  const exNoDoc = [
    ["Titular:", "Romero, Valeria Dolores", "Suplente:", "Díaz Bazán, Ruth"],
  ];

  const exEst = [
    [
      "Titular:",
      "González Carrizo, Rocio Abigail",
      "Suplente:",
      "-",
    ],
    [
      "Titular:",
      "Correa, Jorquera Marcos",
      "Suplente:",
      "Romero, Rodolfo Tomás",
    ],
    [
      "Titular:",
      "Giménez, Dalila Fabiola",
      "Suplente:",
      "Torres Karen, Viviana",
    ],
  ];

  const exGrad = [
    [
      "Titular:",
      "Flores, Walter Sebastián",
      "Suplente:",
      "Valles, Melina De Los Ángeles",
    ],
  ];

  const content = {
    asuntosAcademicos: (
      <div className="space-y-6">
        <LocalKeyValueGrid pairs={aaAutoridades} pal={pal("asuntosAcademicos")} />
        <SectionBlock
          title="Docentes"
          items={aaDocentes}
          pal={pal("asuntosAcademicos")}
        />
        <SectionBlock
          title="Nodocentes"
          items={aaNoDoc}
          pal={pal("asuntosAcademicos")}
        />
        <SectionBlock
          title="Estudiantes"
          items={aaEst}
          pal={pal("asuntosAcademicos")}
        />
        <SectionBlock
          title="Graduados"
          items={aaGrad}
          pal={pal("asuntosAcademicos")}
        />
      </div>
    ),
    interpretacion: (
      <div className="space-y-6">
        <LocalKeyValueGrid pairs={irAutoridades} pal={pal("interpretacion")} />
        <SectionBlock
          title="Docentes"
          items={irDocentes}
          pal={pal("interpretacion")}
        />
        <SectionBlock
          title="Nodocentes"
          items={irNoDoc}
          pal={pal("interpretacion")}
        />
        <SectionBlock
          title="Estudiantes"
          items={irEst}
          pal={pal("interpretacion")}
        />
        <SectionBlock
          title="Graduados"
          items={irGrad}
          pal={pal("interpretacion")}
        />
      </div>
    ),
    presupuesto: (
      <div className="space-y-6">
        <LocalKeyValueGrid pairs={phAutoridades} pal={pal("presupuesto")} />
        <SectionBlock
          title="Docentes"
          items={phDocentes}
          pal={pal("presupuesto")}
        />
        <SectionBlock
          title="Nodocentes"
          items={phNoDoc}
          pal={pal("presupuesto")}
        />
        <SectionBlock
          title="Estudiantes"
          items={phEst}
          pal={pal("presupuesto")}
        />
        <SectionBlock
          title="Graduados"
          items={phGrad}
          pal={pal("presupuesto")}
        />
      </div>
    ),
    asuntosGenerales: (
      <div className="space-y-6">
        <LocalKeyValueGrid pairs={agAutoridades} pal={pal("asuntosGenerales")} />
        <SectionBlock
          title="Docentes"
          items={agDocentes}
          pal={pal("asuntosGenerales")}
        />
        <SectionBlock
          title="Nodocentes"
          items={agNoDoc}
          pal={pal("asuntosGenerales")}
        />
        <SectionBlock
          title="Estudiantes"
          items={agEst}
          pal={pal("asuntosGenerales")}
        />
        <SectionBlock
          title="Graduados"
          items={agGrad}
          pal={pal("asuntosGenerales")}
        />
      </div>
    ),
    extension: (
      <div className="space-y-6">
        <LocalKeyValueGrid pairs={exAutoridades} pal={pal("extension")} />
        <SectionBlock
          title="Docentes"
          items={exDocentes}
          pal={pal("extension")}
        />
        <SectionBlock
          title="Nodocentes"
          items={exNoDoc}
          pal={pal("extension")}
        />
        <SectionBlock
          title="Estudiantes"
          items={exEst}
          pal={pal("extension")}
        />
        <SectionBlock title="Graduados" items={exGrad} pal={pal("extension")} />
      </div>
    ),
  };

  const counts = {
    asuntosAcademicos:
      aaAutoridades.length +
      aaDocentes.length +
      aaNoDoc.length +
      aaEst.length +
      aaGrad.length,
    interpretacion:
      irAutoridades.length +
      irDocentes.length +
      irNoDoc.length +
      irEst.length +
      irGrad.length,
    presupuesto:
      phAutoridades.length +
      phDocentes.length +
      phNoDoc.length +
      phEst.length +
      phGrad.length,
    asuntosGenerales:
      agAutoridades.length +
      agDocentes.length +
      agNoDoc.length +
      agEst.length +
      agGrad.length,
    extension:
      exAutoridades.length +
      exDocentes.length +
      exNoDoc.length +
      exEst.length +
      exGrad.length,
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
      <h3
        className={[
          "mb-2 text-sm font-semibold",
          pal?.label ?? "text-blue-700",
        ].join(" ")}
      >
        {title}
      </h3>
      <LocalSectionList items={items} pal={pal} />
    </div>
  );
}

function LocalSectionList({ items = [], pal }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-blue-200 p-6 text-center text-sm text-blue-700">
        No hay datos disponibles.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((row, i) => (
        <div
          key={i}
          className={[
            "rounded-xl border p-4 shadow-sm transition hover:shadow-md",
            pal?.tintBg ?? "bg-blue-50",
            pal?.tintBorder ?? "border-blue-200",
          ].join(" ")}
        >
          <div className="space-y-1">
            <p
              className={[
                "text-xs font-semibold uppercase tracking-wide",
                pal?.label ?? "text-blue-700",
              ].join(" ")}
            >
              {row[0]}{" "}
              <span
                className={[
                  "normal-case",
                  pal?.label ?? "text-blue-700",
                ].join(" ")}
              >
                {row[1]}
              </span>
            </p>

            {row[2] && (
              <p
                className={[
                  "text-xs font-semibold uppercase tracking-wide",
                  pal?.label ?? "text-blue-700",
                ].join(" ")}
              >
                {row[2]}{" "}
                <span
                  className={[
                    "normal-case",
                    pal?.label ?? "text-blue-700",
                  ].join(" ")}
                >
                  {row[3]}
                </span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function LocalKeyValueGrid({ pairs = [], pal }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {pairs.map(([label, value], i) => (
        <div
          key={label + i}
          className={[
            "rounded-xl border p-4 shadow-sm transition hover:shadow-md",
            pal?.tintBg ?? "bg-blue-50",
            pal?.tintBorder ?? "border-blue-200",
          ].join(" ")}
        >
          <p
            className={[
              "text-xs font-semibold uppercase tracking-wide",
              pal?.label ?? "text-blue-700",
            ].join(" ")}
          >
            {label}
          </p>
          <p
            className={[
              "mt-1 text-sm",
              pal?.label ?? "text-blue-700",
            ].join(" ")}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ConsejoComisiones;
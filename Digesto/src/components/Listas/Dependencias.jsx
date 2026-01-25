import PropTypes from "prop-types";
import { Link } from "react-router";

const dependenciaEnum = [
  "C. Superior",
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
  "Todas",
];

const colors = [
  "bg-blue-300",
  "bg-green-300",
  "bg-orange-300",
  "bg-cyan-300",
  "bg-red-300",
  "bg-purple-300",
];

const nombreToId = {
  Aplicadas: "1",
  Exactas: "2",
  Salud: "3",
  Sociales: "4",
  Humanas: "5",
  "C. Superior": "20",
  "C.Superior": "20",
  Chepes: "22",
  "Villa Union": "26",
  "Villa Unión": "26",
  Chamical: "25",
  Aimogasta: "24",
  Catuna: "23",
};

function Dependencias({ dependencias }) {
  const displayedDependencias = dependencias?.length
    ? dependencias
    : dependenciaEnum;

  const normalizeLabel = (nombre) =>
    nombre === "C. Superior" ? "C.Superior" : String(nombre);

  const buildTo = (label, id) =>
    label.toLowerCase() === "todas" || !id
      ? "/busqueda"
      : `/busqueda?dependencia=${encodeURIComponent(id)}`;

  const MAIN_LABEL = "C.Superior";

  const mainItem = displayedDependencias.find(
    (n) => normalizeLabel(n) === MAIN_LABEL,
  );
  const restItems = displayedDependencias.filter(
    (n) => normalizeLabel(n) !== MAIN_LABEL,
  );

  const topItems = restItems.slice(0, 5);
  const otherItems = restItems.slice(5);

  const Card = ({
    nombre,
    className = "",
    colorIndex = 0,
    compact = false,
    colored = false,
  }) => {
    const label = normalizeLabel(nombre);
    const id = nombreToId[nombre] ?? nombreToId[label] ?? "";
    const to = buildTo(label, id);

    const bgClass = colored
      ? colors[colorIndex % colors.length] || "bg-slate-400"
      : "bg-slate-200";

    const textClass = colored ? "text-white" : "text-slate-900";

    return (
      <Link
        to={to}
        className={[
          "card group flex items-center gap-3 rounded-xl",
          "hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-in-out",
          bgClass,
          textClass,
          compact
            ? "p-2 md:p-3 lg:p-4 text-base md:text-lg lg:text-xl"
            : "p-4 md:p-5 lg:p-6 text-lg md:text-2xl lg:text-3xl",
          className,
        ].join(" ")}
      >
        <figure
          className={[
            "flex items-center justify-center rounded-full shrink-0",
            compact
              ? "w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12"
              : "w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
            colored ? "bg-white/20" : "bg-slate-900/10",
          ].join(" ")}
        >
          <img
            src="src/assets/UnlarLogo.png"
            alt=""
            className="object-contain w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
          />
        </figure>

        <span className="leading-tight font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-12 gap-3 md:gap-4 lg:gap-5">
        {mainItem && (
          <div className="col-span-12 md:col-span-6 md:row-span-2 lg:col-span-3 lg:row-span-2">
            <Card
              nombre={mainItem}
              compact={false}
              colored={true}
              colorIndex={5}
            />
          </div>
        )}

        {topItems.map((nombre, idx) => (
          <div
            key={normalizeLabel(nombre)}
            className="col-span-6 md:col-span-3 lg:col-span-3"
          >
            <Card nombre={nombre} colorIndex={idx} compact colored />
          </div>
        ))}

        {otherItems.map((nombre) => (
          <div
            key={normalizeLabel(nombre)}
            className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2"
          >
            <Card nombre={nombre} compact colored={false} />
          </div>
        ))}
      </div>
    </section>
  );
}

Dependencias.propTypes = {
  dependencias: PropTypes.array.isRequired,
};

export default Dependencias;

import PropTypes from "prop-types";
import { Link } from "react-router";

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

const colors = [
  "bg-blue-300",
  "bg-green-300",
  "bg-orange-300",
  "bg-cyan-300",
  "bg-red-300",
];

function Dependencias({ dependencias }) {
  const displayedDependencias = dependencias.length
    ? dependencias
    : dependenciaEnum;

  return (
    <div className="flex flex-wrap gap-2">
      {displayedDependencias.map((nombre, index) => (
        <Link
          key={index}
          to={`busqueda/?dependencia=${nombre}`}
          className={`card  flex flex-1/4 md:flex-1/5 items-center p-2
            text-white font-medium md:text-xl
            ${colors[index] || "bg-slate-400"}
            hover:-translate-y-1 hover:shadow-lg
            transition-all duration-300 ease-in-out
            `}
        >
          <figure className="flex items-center self-start justify-start w-10 h-10 rounded-full">
            <img
              src="src/assets/UnlarLogo.png"
              alt=""
              className="object-contain"
            />
          </figure>
          {nombre}
        </Link>
      ))}
    </div>
  );
}

Dependencias.propTypes = {
  dependencias: PropTypes.array.isRequired,
};

export default Dependencias;

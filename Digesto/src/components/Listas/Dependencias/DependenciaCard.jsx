import PropTypes from "prop-types";
import { Link } from "react-router";

const colors = [
  "bg-[#526cc4]",
  "bg-[#193db7]",
];

const dependenciaNombreToId = {
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

const emisorNombreToId = {
  Rectorado: "2",
  Asamblea: "99",
  "Cjo. Superior" : "4",
  "Consejo Superior" : "4"
}

const normalizeLabel = (nombre) =>
  nombre === "C. Superior" ? "C.Superior" : String(nombre);

const buildTo = ({label,id,field}) =>
  String(label).toLowerCase() === "todas" || !id
    ? "/busqueda"
    : `/busqueda?${field}=${encodeURIComponent(id)}`;


   export default function DependenciaCard({
  nombre,
  colorIndex = 0,
  colored = true,
  big = false,
  kind = "dependencia" 
}) {
  const label = normalizeLabel(nombre);
    const map = kind === "emisor" ? emisorNombreToId : dependenciaNombreToId;
    const field = kind === "emisor" ? "emisor" : "dependencia";
  const id = map[nombre] ?? map[label] ?? "";
  const to = buildTo({ label, id, field });
   console.log({nombre,label,kind,field,id,to});


  return (
    <Link
      to={to}
      className={[
        "group flex items-center gap-3 rounded-xl",
        "transition hover:-translate-y-0.5 hover:shadow-md",
        colored ? (colors[colorIndex] ?? colors[0]) : "bg-slate-200",
        colored ? "text-white" : "text-slate-900",
        big
          ? "p-3 sm:p-4 text-base sm:text-lg"
          : "p-2.5 sm:p-3 text-sm sm:text-base",
      ].join(" ")}
    >
      <span
        className={[
          "flex items-center justify-center rounded-full shrink-0",
          big ? "w-10 h-10 sm:w-11 sm:h-11" : "w-9 h-9 sm:w-10 sm:h-10",
          colored ? "bg-white/20" : "bg-slate-900/10",
        ].join(" ")}
      >
        <img
          src="src/assets/UnlarLogo.png"
          alt=""
          className={big ? "w-6 h-6" : "w-5 h-5"}
        />
      </span>

      <span className="font-medium leading-tight">{label}</span>
    </Link>
  );
}

DependenciaCard.propTypes = {
  nombre: PropTypes.string.isRequired,
  colorIndex: PropTypes.number,
  colored: PropTypes.bool,
  big: PropTypes.bool,
  kind: PropTypes.oneOf(["dependencia", "emisor"])
};

export { normalizeLabel };

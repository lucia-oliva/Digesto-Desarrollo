import PropTypes from "prop-types";
import DependenciaCard, {
  normalizeLabel,
} from "./Dependencias/DependenciaCard";
import DependenciasRow from "./Dependencias/DependenciasRow";

const dependenciaEnum = [
  "Consejo Superior",
  "Rectorado",
  "Asamblea",
  "Exactas",
  "Salud",
  "Humanas",
  "Sociales",
  "Aplicadas",
  "Chepes",
  "Villa Unión",
  "Chamical",
  "Aimogasta",
  "Catuna",
  "Todas",
];

export default function Dependencias({ dependencias }) {
  const list = dependencias?.length ? dependencias : dependenciaEnum;

  const pick = (labels) => {
    const map = new Map(list.map((n) => [normalizeLabel(n), n]));
    return labels.map((k) => map.get(k)).filter(Boolean);
  };

  const top = pick(["Consejo Superior", "Asamblea", "Rectorado"]);
  const facus = pick(["Exactas", "Salud", "Humanas", "Sociales", "Aplicadas"]);
  const sedes = pick([
    "Chepes",
    "Villa Unión",
    "Chamical",
    "Aimogasta",
    "Catuna",
  ]);
  const todas = pick(["Todas"])[0];
  const topGetCardProps = () => ({kind: "emisor"});

  return (
    <section className="w-full">
      <div className="grid grid-cols-12 gap-4">
        {/* Fila 1 */}
        <DependenciasRow
          items={top}
          big
          colsClass="grid-cols-1 sm:grid-cols-3"
          startColor={1}
          getCardProps={topGetCardProps}
        />

        {/* Fila 2 */}
        <DependenciasRow
          title="Departamentos"
          items={facus}
          colsClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
          startColor={0}
        />

        {/* Fila 3 */}
        <DependenciasRow
          title="Sedes"
          items={sedes}
          colsClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
          Colored={false}
        />

        {/* Todas */}
        {todas && (
          <div className="col-span-5">
            <DependenciaCard nombre={todas} colored={false} />
          </div>
        )}
      </div>
    </section>
  );
}

Dependencias.propTypes = {
  dependencias: PropTypes.array.isRequired,
};

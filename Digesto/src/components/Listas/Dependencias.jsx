import PropTypes from "prop-types";
import DependenciaCard, {
  normalizeLabel,
} from "./Dependencias/DependenciaCard";
import DependenciasRow from "./Dependencias/DependenciasRow";

const dependenciaEnum = [
  "Cjo. Superior",
  "Rector",
  "Asamblea",
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

export default function Dependencias({ dependencias }) {
  const list = dependencias?.length ? dependencias : dependenciaEnum;

  const pick = (labels) => {
    const map = new Map(list.map((n) => [normalizeLabel(n), n]));
    return labels.map((k) => map.get(k)).filter(Boolean);
  };

  const top = pick(["Cjo. Superior", "Asamblea", "Rector"]);
  const facus = pick(["Exactas", "Salud", "Humanas", "Sociales", "Aplicadas"]);
  const sedes = pick([
    "Chepes",
    "Villa Union",
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
          startColor={4}
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

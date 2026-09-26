import PropTypes from "prop-types";
import DependenciaCard from "./DependenciaCard";
import { normalizeDependenciaLabel } from "../../../utils/dependencias";

export default function DependenciasRow({
  title,
  items,
  colsClass,
  big = false,
  startColor = 0,
  Colored = true,
  getCardProps
}) {
  if (!items?.length) return null;

  return (
    <div className="col-span-12">
      {title && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {title}
        </p>
      )}

      <div className={`grid gap-3 ${colsClass}`}>
        {items.map((n) => {
          const extra = getCardProps?.(n) || {};
          return (
          <DependenciaCard
            key={normalizeDependenciaLabel(n)}
            nombre={n}
            big={big}
            colored={Colored}
            colorIndex={startColor}
            {...extra}
          />
        );
        })}
      </div>
    </div>
  );
}

DependenciasRow.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  colsClass: PropTypes.string.isRequired,
  big: PropTypes.bool,
  startColor: PropTypes.number,
  Colored: PropTypes.bool,
  getCardProps: PropTypes.func,
};

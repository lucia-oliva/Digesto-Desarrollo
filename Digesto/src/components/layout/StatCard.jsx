/* eslint-disable react/prop-types */
import { Link } from "react-router";

function StatCard({
  title,
  value,
  description,
  iconFront,
  iconBg,
  color,
  toList,
  toCreate,
  textList,
  textCreate,
  user,
  permissions,
}) {
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-xl p-6 shadow-sm text-white transition transform hover:scale-[1.02] hover:shadow-md ${color} min-h-[180px]`}
    >
      <div className="absolute right-4 bottom-0 text-[100px] opacity-10 pointer-events-none select-none">
        {iconBg}
      </div>
      <div className="flex items-start justify-between z-10">
        <div className="text-5xl">{iconFront}</div>
        <div className="text-right">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-200">{description}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-end gap-2 lg:gap-3 mt-6 z-10">
        <Link
          to={toList}
          className={`${ (!permissions || user === permissions) ? "" : "hidden" }
          } text-sm text-center bg-white/20 px-4 py-2 rounded hover:bg-white/30 transition`}
        >
          {textList}
        </Link>
        <Link
          to={toCreate}
          className={`${ (!permissions || user === permissions) ? "" : "hidden" }
          } text-sm text-center bg-white/20 px-4 py-2 rounded hover:bg-white/30 transition`}
        >
          {textCreate}
        </Link>
      </div>
    </div>
  );
}

export default StatCard;

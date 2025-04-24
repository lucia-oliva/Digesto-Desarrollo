import PropTypes from "prop-types";
import { useLocation } from "react-router";

function Table({ normativas }) {
  const location = useLocation();

  const isNuevaNormativa =
    location.pathname === "/administracion" &&
    new URLSearchParams(location.search).get("option") === "Nueva Normativa";

  const ocultarVisitas =
    location.pathname === "/busqueda" || isNuevaNormativa;

  return (
    <div className="justify-center flex items-center">
      <div className="w-auto text-neutral text-center rounded-lg">
        {/* Vista de Tarjetas en Mobile */}
        <div className="grid grid-cols-1 md:hidden gap-4">
          {normativas?.map((normativa, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800">{normativa.titulo}</h2>
              <div className="space-y-2 mt-2">
                <p className="text-sm text-gray-600">
                  <strong className="font-medium">Número:</strong> {normativa.numero}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-medium">Fecha:</strong> {normativa.fecha}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-medium">Dependencia:</strong> {normativa.dependencia}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-medium">Emisor:</strong> {normativa.emisor}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="font-medium">Tipo:</strong> {normativa.tipo_normativa}
                </p>
                {!ocultarVisitas && (
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium">Visitas:</strong> {normativa.visitas}
                  </p>
                )}
              </div>
              <div className="flex justify-center mt-4">
                {isNuevaNormativa ? (
                  <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">
                    Seleccionar
                  </button>
                ) : (
                  <a
                    href={`document/${normativa.id}`}
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Ver Normativa
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vista de Tabla en Desktop */}
        <div className="overflow-x-auto hidden md:block rounded-box border border-base-content/5 bg-base-100">
          <table className="table-md">
            <thead>
              <tr className="bg-primary text-white">
                <th>Número</th>
                <th>Título</th>
                <th>Fecha</th>
                <th>Dependencia</th>
                <th>Emisor</th>
                <th>Tipo</th>
                {!ocultarVisitas && <th>Visitas</th>}
                <th>{isNuevaNormativa ? "Seleccionar" : "Archivo PDF"}</th>
              </tr>
            </thead>
            <tbody>
              {normativas?.map((normativa, index) => (
                <tr className="hover:bg-primary-content odd:bg-[#F7F6FE]" key={index}>
                  <td>{normativa.numero}</td>
                  <td>{normativa.titulo}</td>
                  <td>{normativa.fecha}</td>
                  <td>{normativa.dependencia}</td>
                  <td>{normativa.emisor}</td>
                  <td>{normativa.tipo_normativa}</td>
                  {!ocultarVisitas && <td>{normativa.visitas}</td>}
                  <td className="flex flex-col items-center gap-1">
                    {isNuevaNormativa ? (
                      <button className="btn btn-outline btn-primary btn-sm m-3 p-6">
                        Seleccionar
                      </button>
                    ) : (
                      <a
                        href={`/document/${normativa.id}`}
                        className="btn btn-outline btn-primary btn-sm m-3 p-6"
                      >
                        Ver Normativa
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Table.propTypes = {
  normativas: PropTypes.arrayOf(
    PropTypes.shape({
      numero: PropTypes.string.isRequired,
      titulo: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      dependencia: PropTypes.string.isRequired,
      emisor: PropTypes.string.isRequired,
      tipo_normativa: PropTypes.string.isRequired,
      visitas: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Table;

import PropTypes from 'prop-types';

function Table({ normativas }) {
  
  return (
    <div className="justify-center flex items-center">
      {/* Section de Normativas mas buscadas */}
      <div className="w-auto  text-neutral text-center rounded-lg">
        {/* Vista de Tarjetas en Mobile */}
        <div className="grid grid-cols-1 md:hidden gap-4">
          {normativas?.map((normativa, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md bg-white text-left"
            >
              <h2 className="text-lg font-semibold">{normativa.titulo}</h2>
              <p className="text-sm">
                <strong>Número:</strong> {normativa.numero}
              </p>
              <p className="text-sm">
                <strong>Fecha:</strong> {normativa.fecha}
              </p>
              <p className="text-sm">
                <strong>Dependencia:</strong> {normativa.dependencia}
              </p>
              <p className="text-sm">
                <strong>Emisor:</strong> {normativa.emisor}
              </p>
              <p className="text-sm">
                <strong>Tipo:</strong> {normativa.tipo_normativa}
              </p>
              <p className="text-sm">
                <strong>Visitas:</strong> {normativa.visitas}
              </p>
              <div className="flex flex-col items-center gap-2 mt-2">
                <button
                  
                  className="btn btn-ghost btn-xs"
                >
                  Descargar PDF
                </button>
                <button className="btn btn-ghost btn-xs">Ver Normativa</button>
              </div>
            </div>
          ))}
        </div>

        {/* Vista de Tabla en Desktop */}
        <div className="overflow-x-auto hidden md:block rounded-box border border-base-content/5 bg-base-100">
          <table className="table-md">
            <thead>
              <tr className="bg-[#F2F2F2]">
                <th>Numero</th>
                <th>Titulo</th>
                <th>Fecha</th>
                <th>Dependencia</th>
                <th>Emisor</th>
                <th>Tipo</th>
                <th>Visitas</th>
                <th>Archivo PDF</th>
              </tr>
            </thead>
            <tbody>
              {normativas.map((normativa, index) => (
                <tr
                  className=" hover:bg-primary-content odd:bg-[#F7F6FE]"
                  key={index}
                >
                  <td>{normativa.numero}</td>
                  <td>{normativa.titulo}</td>
                  <td>{normativa.fecha}</td>
                  <td>{normativa.dependencia}</td>
                  <td>{normativa.emisor}</td>
                  <td>{normativa.tipo_normativa}</td>
                  <td>{normativa.visitas}</td>
                  <td className="flex flex-col items-center gap-1">
                    <button className="btn btn-outline btn-primary btn-sm m-3 p-6">
                      Ver Normativa
                    </button>
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
    })
  ).isRequired,
};

export default Table;
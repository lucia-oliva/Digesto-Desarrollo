import PropTypes from "prop-types";
function IntegrantesCuadros({ data, pal }) {
  const Box = ({ title, list }) => (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div
        className={
          (pal?.tintBg ?? "bg-gray-50") + " px-4 py-3 border-b border-gray-200"
        }
      >
        <p
          className={
            (pal?.label ?? "text-gray-700") +
            " text-xs font-semibold uppercase tracking-wide"
          }
        >
          {title}
        </p>
      </div>
      <div className="divide-y divide-gray-200">
        {list.map((name, i) => (
          <div key={i} className="px-4 py-3 text-sm text-gray-900">
            {name}
          </div>
        ))}
      </div>
    </div>
  );

  Box.propTypes = {
    title: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Box title="Titulares" list={data.titulares ?? []} />
      <Box title="Suplentes" list={data.suplentes ?? []} />
    </div>
  );
}

IntegrantesCuadros.propTypes = {
  data: PropTypes.shape({
    titulares: PropTypes.arrayOf(PropTypes.string),
    suplentes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  pal: PropTypes.object,
};

export default IntegrantesCuadros;

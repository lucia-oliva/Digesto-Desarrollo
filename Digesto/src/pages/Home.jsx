import useAxios from "axios-hooks";
const Home = () => {
  const [{ data, loading, error }] = useAxios({
    url: "http://localhost:3000/api/dependencia",
    method: "GET",
  });

  console.log(data);

  return (
    <div>
      <h1>Home</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          <li>{data.length}</li>
          {data.map((el) => (
            <li key={el.id}>{el.nombre}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;

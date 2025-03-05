import { useState } from "react";
import axios from "axios"; 
import "../styles/Home.css";

function Home() {
  const [normativas, setNormativas] = useState([]);
  const [formData, setFormData] = useState({
    numero: "",
    dependencia: "",
    anio: "",
    documento: "",
    emisor: ""
  });

  
  async function searchNormativas() {
    const { numero, dependencia, emisor, tipo_normativa, anio } = formData;
    const limite = 10; 
    const page = 1;
    
    try {
      const response = await axios.post(
        "http://localhost:3000/api/normativa/search", 
        { numero, emisor, documento: tipo_normativa, anio, limite },
        { params: { dependencia, page } }
      );
      console.log(response.data);
      setNormativas(response.data); 
    } catch (error) {
      console.error("Error al buscar las normativas", error);
    }
  }

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div>

      <section className="landing">
        <div className="landing-div">
        </div>
        <button type="button" className="boton">Buscar Normativa!</button>
      </section>

      {/* Formulario de búsqueda */}
      <form onSubmit={(e) => { e.preventDefault(); searchNormativas(); }}>
        {/* Input para Número */}
        <div>
          <label htmlFor="numero">Número:</label>
          <input
            type="text"
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            placeholder="Ingrese el número"
          />
        </div>

        {/* Toggle de Dependencia */}
        <div>
          <label>Dependencia:</label>
          <label>
            <input
              type="radio"
              name="dependencia"
              value="1"
              onChange={handleInputChange}
            /> Dependencia 1
          </label>
          <label>
            <input
              type="radio"
              name="dependencia"
              value="2"
              onChange={handleInputChange}
            /> Dependencia 2
          </label>
        </div>

        {/* Toggle de Año */}
        <div>
          <label>Año:</label>
          <label>
            <input
              type="radio"
              name="anio"
              value="2021"
              onChange={handleInputChange}
            /> 2021
          </label>
          <label>
            <input
              type="radio"
              name="anio"
              value="2022"
              onChange={handleInputChange}
            /> 2022
          </label>
        </div>

        {/* Toggle de Tipo Normativa */}
        <div>
          <label>Tipo de Normativa:</label>
          <label>
            <input
              type="radio"
              name="tipo_normativa"
              value="1"
              onChange={handleInputChange}
            /> Tipo 1
          </label>
          <label>
            <input
              type="radio"
              name="tipo_normativa"
              value="2"
              onChange={handleInputChange}
            /> Tipo 2
          </label>
        </div>

        {/* Toggle de Emisor */}
        <div>
          <label>Emisor:</label>
          <label>
            <input
              type="radio"
              name="emisor"
              value="1"
              onChange={handleInputChange}
            /> Emisor 1
          </label>
          <label>
            <input
              type="radio"
              name="emisor"
              value="2"
              onChange={handleInputChange}
            /> Emisor 2
          </label>
        </div>

        {/* Botón para enviar el formulario */}
        <div>
          <button type="submit">Buscar</button>
        </div>
      </form>

      {/* Mostrar las normativas obtenidas */}
      <div>
        {normativas.length > 0 ? (
          <ul>
            {normativas.map((normativa, index) => (
              <li key={index}>{normativa.nombre}</li> // Ajusta 'nombre' según lo que retorne tu API
            ))}
          </ul>
        ) : (
          <p>No se encontraron normativas.</p>
        )}
      </div>
    </div>
  );
}

export default Home;

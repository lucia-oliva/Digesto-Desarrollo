import { useState } from "react";
import axios from "axios"; 
import "../styles/Home.css";
import Dependencia from "../components/Dependencia";

function Home() {
  const [normativas, setNormativas] = useState([]);
  const arrayNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [formData, setFormData] = useState({
    numero: "",
    dependencia: "",
    anio: "",
    documento: "",
    emisor: ""
  });

  const dependencias = ["Exactas", "Salud", "Humanas", "Sociales", "Aplicadas", "Chepes","Villa Union","Chamical", "Aimogasta","Catuna", "C. Superior" ,"Todas" ]


  
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
      {/* Hero section */}
      <div
        className="hero min-h-screen "
        style={{
          backgroundImage:
            "url(https://www.unlar.edu.ar/images/fotos-noticias/Enero2025/UNLaR.jpg)",
        }}
      >
        <div className="hero-overlay "></div>
        <div
          className="hero-content text-center flex items-start py-25
           min-h-screen "
        >
          <div className="max-w-md">
            <h1 className="mb-4 text-5xl font-semibold font-[Montserrat]">
              Bienvenido a Digesto UNLaR
            </h1>
            <p className="mb-5 font-[Raleway]">
              La plataforma que sirve como espacio digital para consultar las
              normativas y toda documentacion emitada por todas las dependencias
              de la Universidad Nacional de La Rioja.
            </p>
            <button
              className="btn border-1 bg-blue-900
                border-slate-800
                font-[Raleway]
               "
            >
              Busqueda Avanzada
            </button>
            <div className="divider font-[Raleway]">
              O Buscar por Dependencias
            </div>
            <div className="w-auto flex justify-center">
              <svg
                width="60px"
                height="auto"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 13L12 16M12 16L15 13M12 16V8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#FFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Section de Dependencias */}
      <div className="grid grid-cols-4 gap-4 hidden">
            {dependencias.map((nombre, index) => (
                <Dependencia key={index} nombre={nombre} />
            ))}
        </div>
      
      {/* A partir de aqui el codigo viejo */}
      <div className="hidden">
        <section className="landing">
          <div className="landing-div"></div>
          <button type="button" className="boton">
            Buscar Normativa!
          </button>
        </section>

        {/* Formulario de búsqueda */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchNormativas();
          }}
        >
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
              />{" "}
              Dependencia 1
            </label>
            <label>
              <input
                type="radio"
                name="dependencia"
                value="2"
                onChange={handleInputChange}
              />{" "}
              Dependencia 2
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
              />{" "}
              2021
            </label>
            <label>
              <input
                type="radio"
                name="anio"
                value="2022"
                onChange={handleInputChange}
              />{" "}
              2022
            </label>
          </div>
          <ul className="w-full items-center text-center grid-cols-3 md:grid-cols-5 grid ">
            {arrayNum.map((num) => (
              <li key={num}>{num}</li>
            ))}
          </ul>

          {/* Toggle de Tipo Normativa */}
          <div>
            <label>Tipo de Normativa:</label>
            <label>
              <input
                type="radio"
                name="tipo_normativa"
                value="1"
                onChange={handleInputChange}
              />{" "}
              Tipo 1
            </label>
            <label>
              <input
                type="radio"
                name="tipo_normativa"
                value="2"
                onChange={handleInputChange}
              />{" "}
              Tipo 2
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
              />{" "}
              Emisor 1
            </label>
            <label>
              <input
                type="radio"
                name="emisor"
                value="2"
                onChange={handleInputChange}
              />{" "}
              Emisor 2
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
    </div>
  );
}

export default Home;

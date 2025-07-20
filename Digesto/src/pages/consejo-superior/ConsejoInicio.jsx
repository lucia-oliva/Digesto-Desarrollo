import React from 'react';
import consejoImg from '/src/assets/consejo.jpg';

const ConsejoInicio = () => {
  return (
    <section className="relative w-full h-[700px] overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src={consejoImg}
        alt="Consejo Superior"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Capa oscura ligera para resaltar el texto */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Contenido centrado */}
      <div className="relative z-20 h-full flex items-center px-6 sm:px-12 lg:px-24">
        <div className="bg-white/80 backdrop-blur-md text-gray-800 max-w-2xl lg:max-w-xl p-8 rounded-xl shadow-xl ring-1 ring-black/10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-primary">
            Consejo Superior
          </h1>

          <p className="text-gray-700 text-lg">
            El Consejo Superior es el órgano colegiado de gobierno universitario, 
            encargado de tomar decisiones clave para el desarrollo académico e institucional 
            de la Universidad.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">¿Quiénes lo integran?</h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>
                <span className="font-semibold text-gray-800">Autoridades:</span>{' '}
                Rector/a, Vicerrector/a, Decanos/as
              </li>
              <li>
                <span className="font-semibold text-gray-800">Estamentos:</span>{' '}
                25 docentes, 15 estudiantes, 5 nodocentes, 5 graduados
              </li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-primary">Funcionamiento</h2>
            <p className="text-sm text-gray-700">
              Se reúne al menos una vez al mes entre el 15 de febrero y el 20 de diciembre. 
              También puede convocar sesiones extraordinarias fuera de ese período.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsejoInicio;

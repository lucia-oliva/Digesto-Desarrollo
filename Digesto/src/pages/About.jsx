function About() {
  return (
    <div className="bg-base-100">
      {/* About Landing */}
      <div className="hero bg-base-200 min-h-screen -mt-18">
        <div className="hero-content flex-col md:flex-row gap-10 py-20">
          <div className="max-w-md">
            <h2 className="text-lg font-medium font-sans text-gray-500">
              Acerca de
            </h2>
            <h1 className="text-2xl mb-4 font-sans font-semibold text-slate-800">
              Digesto ayuda a los administrativos a gestionar y revisar las
              normativas de la institución.
            </h1>
            <p className="text-lg font-light text-black">
              Digesto es una aplicación web que permite a los administrativos
              gestionar y revisar las normativas de la institución de manera
              rápida
            </p>
          </div>
          <div className="w-1/2 gap-4 flex justify-center items-center">
            <img
              src="https://www.cellmark.com/wp-content/uploads/2019/10/office-papers.jpg"
              alt="Persona sosteniendo papeles"
              className="object-cover w-fit rounded-3xl"
            />
          </div>
        </div>
      </div>

      {/* About Features */}
      <div className="py-12 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
            Características de Digesto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card p-6 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Acceso a Normativas
              </h3>
              <p className="text-base font-light text-black">
              Consulta fácilmente Ordenanzas, Resoluciones y Actas emitidas por la Institución. Mantente informado sobre la normativa vigente.
              </p>
            </div>
            <div className="feature-card p-6 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Convenios Institucionales
              </h3>
              <p className="text-base font-light text-black">
              Con Digesto podes consultar los acuerdos y convenios firmados con otras instituciones.
              </p>
            </div>
            <div className="feature-card p-6 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Interfaz Intuitiva
              </h3>
              <p className="text-base font-light text-black">
                Ofrece una interfaz de usuario intuitiva y fácil de usar,
                mejorando la experiencia del usuario.
              </p>
            </div>
            <div className="feature-card p-6 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Resguardo Digital
              </h3>
              <p className="text-base font-light text-black">
                Digesto funciona como resguardo digital de toda la documentacion emitida hasta la actualidad.
              </p>
            </div>
            <div className="feature-card p-6 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Busqueda Inteligente
              </h3>
              <p className="text-base font-light text-black">
              Encuentra documentos fácilmente con un índice de consulta electrónico. Filtra por diferentes criterios y accede a la información que necesitas
              </p>
            </div>
            <div className="feature-card p-6 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Carácter Informativo
              </h3>
              <p className="text-base font-light text-black">
              Los documentos publicados no tienen validez legal sin autenticación oficial. Consulta con la universidad para obtener copias certificadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

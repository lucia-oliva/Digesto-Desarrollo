function About() {
  return (
    <div className="bg-base-100">
      {/* About Landing */}
      <div className="hero bg-base-200 min-h-screen -mt-18">
        <div className="hero-content flex-col md:flex-row gap-4 py-20">
          <div className="max-w-md">
            <h2 className="text-lg font-medium text-gray-500">Acerca de</h2>
            <h1 className="text-2xl mb-4 font-bold text-slate-800">
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
              src="https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Servidores"
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
                Gestión de Normativas
              </h3>
              <p className="text-base font-light text-black">
                Permite a los usuarios gestionar y actualizar las normativas de
                la institución de manera eficiente.
              </p>
            </div>
            <div className="feature-card p-6 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Revisión Rápida
              </h3>
              <p className="text-base font-light text-black">
                Facilita la revisión rápida de las normativas, asegurando que
                siempre estén actualizadas.
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
                Acceso Seguro
              </h3>
              <p className="text-base font-light text-black">
                Garantiza el acceso seguro a la información, protegiendo los
                datos sensibles de la institución.
              </p>
            </div>
            <div className="feature-card p-6 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Soporte Técnico
              </h3>
              <p className="text-base font-light text-black">
                Brinda soporte técnico continuo para resolver cualquier problema
                o duda que pueda surgir.
              </p>
            </div>
            <div className="feature-card p-6 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Actualizaciones Constantes
              </h3>
              <p className="text-base font-light text-black">
                Recibe actualizaciones constantes para mejorar las
                funcionalidades y la seguridad de la aplicación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

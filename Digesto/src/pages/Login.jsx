

function Login() {
  
  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('https://www.unlar.edu.ar/images/fotos-noticias/Enero2025/UNLaR.jpg')" }}>

      <div className="absolute inset-0 bg-gradient-to-b from-primary to-transparent"></div>
      <div className="w-full max-w-md p-8 bg-base-100 bg-opacity-80 rounded-3xl shadow-lg relative z-10">
        <h2 className="text-center text-4xl font-bold text-primary mb-6">
          Iniciar sesión
        </h2>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="mt-2 block w-full px-6 py-3 bg-base-200 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              placeholder="example@dominio.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="mt-2 block w-full px-6 py-3 bg-base-200 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-primary text-primary-content font-semibold rounded-xl hover:bg-primary-content hover:text-primary transition-all ease-in-out"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <a href="#" className="text-sm text-primary hover:after-line">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;

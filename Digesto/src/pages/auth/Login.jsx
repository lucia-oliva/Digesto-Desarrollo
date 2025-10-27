import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth";
import { Alert, Loading } from "../../components/ui/Ui";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ msg: null, isError: false });
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      setResponse({
        msg: "Por favor, complete todos los campos.",
        isError: true,
      });
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);
      setResponse({ msg: data.msg, isError: false });
      navigate("/admin");
    } catch (error) {
      const msg = error?.response?.data?.msg || "Error al iniciar sesión.";
      console.log(error);
      setForm({ email: "", password: "" });
      setResponse({ msg, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div
        className="md:w-3/5 w-full bg-primary text-primary-content flex flex-col justify-center items-center px-10 py-12 relative"
        style={{
          backgroundImage:
            "url('https://www.unlar.edu.ar/images/fotos-noticias/Enero2025/UNLaR.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 bg-black opacity-50

 z-0"
        ></div>
        <div className="p-10 text-center max-w-xl w-full relative z-10">
          <div className="mb-6">
            <div className="text-white flex justify-center font-bold text-3xl">
              <img src="src\assets\unlar-white.png" alt="Unlar logo" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ¡Hola, bienvenido!
          </h1>
        </div>
      </div>
      <div className="md:w-2/5 w-full bg-base-100 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-center text-3xl font-bold text-primary mb-6">
            Iniciar sesión
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@dominio.com"
                className="mt-2 block w-full px-4 py-3 bg-base-200 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="mt-2 block w-full px-4 py-3 bg-base-200 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-primary text-primary-content font-semibold rounded-xl hover:bg-primary-content hover:text-primary transition-all"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>

      {response.msg && (
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-center">
          <Alert
            message={response.msg}
            title="Login"
            error={response.isError}
          />
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default Login;

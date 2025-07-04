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
      const data = await login(email, password); // use context login
      setResponse({ msg: data.msg, isError: false });
      navigate("/admin");
    } catch (error) {
      const msg = error?.response?.data?.msg || "Error al iniciar sesión.";
      setForm({ email: "", password: "" });
      setResponse({ msg, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://www.unlar.edu.ar/images/fotos-noticias/Enero2025/UNLaR.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-transparent"></div>
      <div className="w-full max-w-md p-8 bg-base-100 bg-opacity-80 rounded-3xl shadow-lg relative z-10">
        <h2 className="text-center text-4xl font-bold text-primary mb-6">
          Iniciar sesión
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              className="mt-2 block w-full px-6 py-3 bg-base-200 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-primary"
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
              className="mt-2 block w-full px-6 py-3 bg-base-200 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-primary text-primary-content font-semibold rounded-xl hover:bg-primary-content hover:text-primary transition-all ease-in-out"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="flex flex-col justify-center mt-4">
          <a href="#" className="text-sm text-primary hover:after-line">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
      {response.msg && (
        <div className="absolute top-0 z-50 w-fit h-fit">
          <Alert
            message={response.msg}
            title="Login"
            error={response.isError}
          />
        </div>
      )}
      {loading && (
        <div className="absolute top-1/2 z-50 w-fit h-fit">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default Login;

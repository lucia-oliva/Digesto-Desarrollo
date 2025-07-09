import { useAuth } from "../../context/useAuth";

function Dashboard() {
  const { auth } = useAuth();
  const user = auth.user;

  if (auth.loading) {
    return <div className="text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen text-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Panel Principal</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de bienvenida */}
        <div className="bg-primary rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-[#66B2FF]">Bienvenido, {user.nombre}</h2>
          <p className="text-sm text-gray-300">
            Aquí podés administrar tus documentos, usuarios y más.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Usá el menú de la izquierda para navegar o los accesos rápidos.
          </p>
        </div>

        {/* Tarjeta con datos del usuario */}
        <div className="bg-[#7d95ad] rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary">Tus datos</h2>
          <ul className="space-y-2 text-sm text-white">
            <li><span className="font-bold text-black">Nombre:</span> {user.nombre}</li>
            <li><span className="font-bold text-black">Email:</span> {user.email}</li>
            <li><span className="font-bold text-black">Rol:</span> {user.Rol}</li>
          </ul>
        </div>
      </div>

      {/* Footer o sección adicional */}
      <div className="mt-10 text-center text-sm text-black">
        Sistema Digesto UNLaR • Dashboard
      </div>
    </div>
  );
}

export default Dashboard;

/* eslint-disable react/prop-types */
import { Alert } from "../../ui/Ui";

export function ContactForm({
  nombre,
  setNombre,
  email,
  setEmail,
  mensaje,
  setMensaje,
  isLoading,
  alertData,
  handleSubmit,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <input
        type="text"
        placeholder="Nombre"
        className="w-full p-2 border border-gray-300 rounded mb-2"
        required
        pattern="^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]{3,}$"
        title="El nombre debe tener al menos 3 caracteres y solo letras."
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo Electrónico"
        className="w-full p-2 border border-gray-300 rounded mb-2"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Mensaje"
        rows="4"
        className="w-full p-2 border border-gray-300 rounded mb-2 resize-none"
        required
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      ></textarea>
      <button
        type="submit"
        className="w-full bg-primary opacity-75 text-white p-2 rounded transition mt-2 hover:opacity-100 flex justify-center items-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-dots loading-md"></span>
        ) : (
          "Enviar"
        )}
      </button>

      {alertData && (
        <div className="mt-3 flex justify-center">
          <Alert
            title={alertData.title}
            message={alertData.message}
            error={alertData.error}
            duration={4000}
          />
        </div>
      )}
    </form>
  );
}

// ContactModal.jsx
import { useEffect, useRef, useState } from "react";
import { SiGmail } from "react-icons/si";
import { useLocation } from "react-router";

export default function ContactModal({ dependencia: dependenciaProp = "" }) {
  const modalRef = useRef(null);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nombreDependencia, setNombreDependencia] = useState("");

  const dependenciaEmails = {
    Exactas: "lucia222lr@gmail.com",
    Aplicadas: "lucia222lr@gmail.com",
    Sociales: "lucia222lr@gmail.com",
    Humanas: "lucia222lr@gmail.com",
    "C. Superior": "lucia222lr@gmail.com",
    Chepes: "lucia222lr@gmail.com",
    "Villa Union": "lucia222lr@gmail.com",
    Chamical: "lucia222lr@gmail.com",
    Aimogasta: "lucia222lr@gmail.com",
    Catuna: "lucia222lr@gmail.com",
  };

  useEffect(() => {
    // 1) Si viene por prop (desde filtros), úsala
    if (dependenciaProp && dependenciaProp.trim() !== "") {
      setIsVisible(true);
      setNombreDependencia(dependenciaProp.trim());
      return;
    }

    // 2) Fallback: leer de la URL (comportamiento anterior)
    const searchParams = new URLSearchParams(location.search);
    const depFromUrl = searchParams.get("dependencia") || "";
    const decoded = decodeURIComponent(depFromUrl);

    setIsVisible(Boolean(decoded));
    setNombreDependencia(decoded);
  }, [location.search, dependenciaProp]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = (event) => {
    if (modalRef.current && event.target === modalRef.current) {
      setIsModalOpen(false);
      setSuccess(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const destinatario =
      dependenciaEmails[nombreDependencia] || "default@unlar.edu.ar";

    const payload = { nombre, email, mensaje, destinatario };

    try {
      const res = await fetch("http://localhost:3000/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        setNombre("");
        setEmail("");
        setMensaje("");
        setTimeout(() => {
          setSuccess(false);
          setIsModalOpen(false);
        }, 3000);
      } else {
        alert("Hubo un error al enviar el mensaje.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div>
      <button
        className="fixed bottom-5 right-5 bg-primary text-white px-3 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        onClick={openModal}
      >
        <SiGmail className="text-2xl" />
      </button>

      <div
        ref={modalRef}
        className={`fixed inset-0 z-50 flex items-end justify-end transition-opacity duration-300 ${
          isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeModal}
      >
        <div
          className="bg-white p-5 rounded-lg shadow-lg w-80 border border-gray-300 m-5 mb-20 mr-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold mb-3">
              {nombreDependencia ? `Contactar con ${nombreDependencia}` : "Contacto"}
            </h3>
          </div>

          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded animate-fade-in">
              Mensaje enviado con éxito.
            </div>
          ) : (
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
                pattern="[A-Za-z\\s]{3,}"
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

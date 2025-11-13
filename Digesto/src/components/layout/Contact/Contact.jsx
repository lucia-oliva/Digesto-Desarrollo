/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { SiGmail } from "react-icons/si";
import { useLocation } from "react-router";
import { API_BASE } from "../../../api/axiosPrivate";
import { ContactForm } from "./ContactForm";
import { dependenciaEmails } from "./dependenciaEmails";

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
  const [alertData, setAlertData] = useState(null);

  useEffect(() => {
    if (dependenciaProp && dependenciaProp.trim() !== "") {
      setIsVisible(true);
      setNombreDependencia(dependenciaProp.trim());
      return;
    }

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
      setAlertData(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const destinatario =
      dependenciaEmails[nombreDependencia] || "default@unlar.edu.ar";

    const payload = { nombre, email, mensaje, destinatario };

    try {
      const res = await fetch(`${API_BASE}/contacto`, {
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
        setAlertData({
          title: "Error",
          message: "Hubo un error al enviar el mensaje.",
          error: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertData({
        title: "Error de conexion",
        message: "No se puede conectar con el servidor",
        error: true,
      });
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
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeModal}
      >
        <div
          className="bg-white p-5 rounded-lg shadow-lg w-80 border border-gray-300 m-5 mb-20 mr-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold mb-3">
              {nombreDependencia
                ? `Contactar con ${nombreDependencia}`
                : "Contacto"}
            </h3>
          </div>

          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded animate-fade-in">
              Mensaje enviado con éxito.
            </div>
          ) : (
            <ContactForm
              nombre={nombre}
              setNombre={setNombre}
              email={email}
              setEmail={setEmail}
              mensaje={mensaje}
              setMensaje={setMensaje}
              isLoading={isLoading}
              alertData={alertData}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

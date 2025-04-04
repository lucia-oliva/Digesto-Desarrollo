import { useEffect, useRef, useState } from "react";
import { SiGmail } from "react-icons/si";
import { useLocation } from "react-router-dom";

export default function ContactModal() {
    const modalRef = useRef(null);
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");

    const dependenciaEmails = {
      Exactas: "lucia222lr@gmail.com",
    };

    useEffect(() => {
        const validParams = [
            "dependencia=Aplicadas", "dependencia=Exactas", "dependencia=Salud",
            "dependencia=Sociales", "dependencia=Humanas", "dependencia=C.%20Superior",
            "dependencia=Chepes", "dependencia=Villa%20Union", "dependencia=Chamical",
            "dependencia=Aimogasta", "dependencia=Catuna"
        ];
        setIsVisible(validParams.some(param => location.search.includes(param)));
    }, [location]);

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    const closeModal = (event) => {
        if (modalRef.current && event.target === modalRef.current) {
            modalRef.current.close();
        }
    };

    const handleSubmit = async () => {
        const searchParams = new URLSearchParams(location.search);
        const dependencia = searchParams.get("dependencia");
        const destinatario = dependenciaEmails[dependencia] || "default@unlar.edu.ar";

        const payload = {
            nombre,
            email,
            mensaje,
            destinatario
        };

        try {
            const res = await fetch("http://localhost:3000/api/contacto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("Mensaje enviado con éxito.");
                setNombre("");
                setEmail("");
                setMensaje("");
                modalRef.current.close();
            } else {
                alert("Hubo un error al enviar el mensaje.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
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

        <dialog
          ref={modalRef}
          className="fixed bottom-5 right-5 bg-white p-5 rounded-lg shadow-lg w-80 border border-gray-300"
          onClick={closeModal}
        >
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold mb-3">Contacto</h3>
            </div>

            <input
              type="text"
              placeholder="Nombre"
              className="w-full p-2 border border-gray-300 rounded mb-2"
              required
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
              type="button"
              className="w-full bg-primary opacity-75 text-white p-2 rounded transition mt-2 hover:opacity-100"
              onClick={handleSubmit}
            >
              Enviar
            </button>
          </div>
        </dialog>
      </div>
    );
}

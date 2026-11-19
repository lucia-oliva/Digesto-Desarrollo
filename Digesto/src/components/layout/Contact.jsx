/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { SiGmail } from "react-icons/si";
import { useLocation } from "react-router";
import { Alert } from "../ui/Ui";
import api from "../../api/axiosPrivate";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_CALLBACK = "digestoTurnstileLoaded";
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();
const DEPENDENCY_LABELS = Object.freeze({
  1: "Aplicadas",
  2: "Exactas",
  3: "Salud",
  4: "Sociales",
  5: "Humanas",
  20: "C. Superior",
  22: "Chepes",
  23: "Catuna",
  24: "Aimogasta",
  25: "Chamical",
  26: "Villa Union",
});

let turnstileLoader;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileLoader) return turnstileLoader;

  turnstileLoader = new Promise((resolve, reject) => {
    window[TURNSTILE_CALLBACK] = () => resolve(window.turnstile);

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${TURNSTILE_CALLBACK}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      script.remove();
      reject(new Error("No se pudo cargar Cloudflare Turnstile."));
    };
    document.head.appendChild(script);
  }).catch((error) => {
    turnstileLoader = undefined;
    throw error;
  });

  return turnstileLoader;
}

export default function ContactModal({
  dependencia: dependenciaProp = "",
  dependenciaId = "",
}) {
  const modalRef = useRef(null);
  const captchaRef = useRef(null);
  const widgetIdRef = useRef(null);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nombreDependencia, setNombreDependencia] = useState("");
  const [selectedDependencyId, setSelectedDependencyId] = useState("");
  const [alertData, setAlertData] = useState(null);

  useEffect(() => {
    const normalizedPropId = String(dependenciaId || "").trim();

    if (dependenciaProp?.trim() && normalizedPropId) {
      setIsVisible(true);
      setNombreDependencia(dependenciaProp.trim());
      setSelectedDependencyId(normalizedPropId);
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const depFromUrl = (searchParams.get("dependencia") || "").trim();
    const dependencyLabel = DEPENDENCY_LABELS[depFromUrl] || "";

    setIsVisible(Boolean(dependencyLabel));
    setNombreDependencia(dependencyLabel);
    setSelectedDependencyId(dependencyLabel ? depFromUrl : "");
  }, [location.search, dependenciaProp, dependenciaId]);

  useEffect(() => {
    if (!isModalOpen || !TURNSTILE_SITE_KEY || !captchaRef.current) return;

    let active = true;

    loadTurnstile()
      .then((turnstile) => {
        if (!active || !captchaRef.current) return;

        widgetIdRef.current = turnstile.render(captchaRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: "contact",
          size: "flexible",
          callback: (token) => setCaptchaToken(token),
          "expired-callback": () => setCaptchaToken(""),
          "error-callback": () => setCaptchaToken(""),
        });
      })
      .catch(() => {
        if (active) {
          setAlertData({
            title: "Error de conexión",
            message: "No se pudo cargar la verificación anti-bot.",
            error: true,
          });
        }
      });

    return () => {
      active = false;
      setCaptchaToken("");

      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isModalOpen]);

  const openModal = () => {
    setAlertData(null);
    setIsModalOpen(true);
  };

  const closeModal = (event) => {
    if (modalRef.current && event.target === modalRef.current) {
      setIsModalOpen(false);
      setSuccess(false);
      setAlertData(null);
    }
  };

  const resetCaptcha = () => {
    setCaptchaToken("");

    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  const handleSubmit = async () => {
    if (!TURNSTILE_SITE_KEY || !captchaToken) {
      setAlertData({
        title: "Verificación requerida",
        message: "Complete la verificación anti-bot antes de enviar.",
        error: true,
      });
      return;
    }

    setIsLoading(true);
    setAlertData(null);

    const payload = {
      dependenciaId: selectedDependencyId,
      nombre,
      email,
      mensaje,
      captchaToken,
    };

    try {
      await api.post("/contacto", payload);

      setSuccess(true);
      setNombre("");
      setEmail("");
      setMensaje("");
      resetCaptcha();

      setTimeout(() => {
        setSuccess(false);
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      resetCaptcha();
      setAlertData({
        title: "Error de conexión",
        message:
          error?.response?.data?.msg ||
          "No se puede conectar con el servidor",
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
                maxLength="5000"
                className="w-full p-2 border border-gray-300 rounded mb-2 resize-none"
                required
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              ></textarea>
              <div ref={captchaRef} className="w-full my-2" />
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
          )}
        </div>
      </div>
    </div>
  );
}

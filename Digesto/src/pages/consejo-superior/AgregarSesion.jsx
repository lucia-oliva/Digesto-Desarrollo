import { useState } from "react";
import { useNavigate } from "react-router";
import { API_BASE } from "../../api/axiosPrivate";
function AgregarSesion() {
  const navigate = useNavigate();


  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!nombre || !fecha || !archivo) {
    setError("Todos los campos son obligatorios.");
    return;
  }

  setError("");
  setEnviando(true);

  try {
    // 1. Crear sesión
    const payload = {
      nombre_orden: nombre,
      fecha_sesion: fecha,
      orden_url: archivo.name,
    };

    const res = await fetch(`${API_BASE}/sesiones/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al guardar la sesión.");
    const data = await res.json();

    // 2. Subir archivo PDF con lógica especial
    console.log("entra",archivo, data.id_sesion)
    console.log(data);

    if (archivo && data?.id_sesion) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", archivo);
      formDataUpload.append("id_sesion", data.id_sesion);
      formDataUpload.append("fecha_sesion", fecha);
      formDataUpload.append("type", "consejo");

      console.log("DATOS SESIONEEEEEEEEEEEEEEEEEEES: ", formDataUpload);

      const uploadRes = await fetch(`${API_BASE}/file/upload/${data.id_sesion}`, {
        method: "POST",
        body: formDataUpload,
      });

      const uploadJson = await uploadRes.json();
      console.log("Resultado de subida de archivo:", uploadJson);
      navigate("/consejo-superior/sesiones");

      if (!uploadRes.ok) {
        throw new Error("Error al subir el archivo PDF");
      }
    }

    
  } catch (err) {
    setError("No se pudo guardar la sesión.");
    console.error(err);
  } finally {
    setEnviando(false);
  }
};


  return (
    <main className="min-h-[60vh] bg-base-100 py-10 px-4 sm:px-6 lg:px-8 pt-30">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Agregar Sesión del Consejo
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-2 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la sesión
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej.: Orden Marzo 2025"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 text-black focus:ring-primary"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Archivo PDF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subir PDF (Orden del día)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              className=" text-black file-input file-input-bordered file-input-primary w-full"
            />
            {archivo && (
              <p className="mt-1 text-xs text-gray-600">Seleccionado: {archivo.name}</p>
            )}
          </div>

          {/* Botón */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={enviando}
              className="btn btn-primary w-full sm:w-auto"
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AgregarSesion;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

function EditarSesion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sesion, setSesion] = useState(null);
  const [nombreActa, setNombreActa] = useState("");
  const [archivoActa, setArchivoActa] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSesion = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/sesiones/${id}`);
        const data = await res.json();
        setSesion(data);
      } catch (err) {
        setError("Error al obtener los datos de la sesión");
        console.error(err);
      }
    };

    fetchSesion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!archivoActa || !nombreActa) {
      setError("Faltan datos del acta");
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append("file", archivoActa);
    formDataUpload.append("type", "acta");
    formDataUpload.append("id_sesion", sesion.id_sesion);
    formDataUpload.append("fecha_sesion", sesion.fecha_sesion);
    formDataUpload.append("nombre_acta", nombreActa);

    try {
      const res = await fetch(`http://localhost:3000/api/file/upload/${id}`, {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Error al subir acta");

      alert("Acta subida correctamente");
      navigate("/consejo-superior/sesiones");
    } catch (err) {
      setError("Error al subir el acta");
      console.error(err);
    }
  };

  return (
    <main className="min-h-[60vh] bg-base-100 py-10 px-4 sm:px-6 lg:px-8">
     <div
        className="max-w-2xl mx-auto bg-white rounded-xl p-6 border"
        style={{
          boxShadow: "4px 4px 19px 5px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)"
        }}
      >
        <h1 className="text-xl text-black font-semibold mb-4">Editar Sesión</h1>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        {sesion ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-black">Nombre de la sesión</label>
              <input
                type="text"
                value={sesion.nombre_orden}
                disabled
                className="w-full input input-bordered text-black"
              />
            </div>

            <div>
              <label className="block  text-black">Fecha</label>
              <input
                type="date"
                value={sesion.fecha_sesion}
                disabled
                className="w-full input input-bordered text-black"
              />
            </div>

            <div>
              <p className="text-sm text-gray-800">
                PDF actual (orden): {sesion.orden_url}
              </p>
            </div>

            <div>
              <label className="block  text-black">Nombre del acta</label>
              <input
                type="text"
                value={nombreActa}
                onChange={(e) => setNombreActa(e.target.value)}
                className="w-full input input-bordered  text-black"
              />
            </div>

            <div>
              <label className="block text-black">Archivo PDF del acta</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setArchivoActa(e.target.files?.[0] || null)}
                className="file-input file-input-bordered file-input-primary w-full "
              />
            </div>

            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              Guardar
            </button>
          </form>
        ) : (
          <p>Cargando sesión...</p>
        )}
      </div>
    </main>
  );
}

export default EditarSesion;

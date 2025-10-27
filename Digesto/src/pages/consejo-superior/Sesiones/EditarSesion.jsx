import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import SesionForm from "../Sesiones/SesionForm";
import { API_BASE } from "../../../api/axiosPrivate";

export default function EditarSesion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sesion, setSesion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchSesion = async () => {
      try {
        const res = await fetch(`${API_BASE}/sesiones/${id}`);
        const data = await res.json();
        setSesion(data);
      } catch (err) {
        console.error(err);
        setGlobalError("Error al obtener los datos de la sesión.");
      } finally {
        setFetching(false);
      }
    };
    fetchSesion();
  }, [id]);

  const initialValues = useMemo(() => {
    if (!sesion) return { nombre: "", fecha: "", nombreActa: "", acta: null };
    return {
      nombre: sesion.nombre_orden ?? "",
      fecha: sesion.fecha_sesion ?? "",
      nombreActa: "",
      acta: null,
      _ordenActual: sesion.orden_url ?? "",
    };
  }, [sesion]);

  const fields = useMemo(() => {
    return [
      {
        key: "nombre",
        label: "Nombre de la sesión",
        type: "text",
        disabled: true,
        validate: () => "",
      },
      {
        key: "fecha",
        label: "Fecha",
        type: "date",
        disabled: true,
        validate: () => "",
      },
      {
        key: "ordenActualStatic",
        label: "",
        type: "static",
        renderStatic: (values) => (
          <p className="text-sm">
            <span className="text-gray-500">PDF actual (orden): </span>
            <span className="text-gray-800">{values._ordenActual || "—"}</span>
          </p>
        ),
      },
      {
        key: "nombreActa",
        label: "Nombre del acta",
        type: "text",
        placeholder: "Ej.: Acta del 02-04-2025",
        validate: (v) => (!String(v ?? "").trim() ? "Ingresá el nombre del acta." : ""),
      },
      {
        key: "acta",
        label: "Archivo PDF del acta",
        type: "fileDrop",
        accept: "application/pdf",
        help: "Formato PDF.",
        validate: (file) => {
          if (!file) return "Adjuntá el PDF del acta.";
          if (file.type !== "application/pdf") return "El archivo debe ser un PDF (.pdf).";
          return "";
        },
      },
    ];
  }, []);

  const sidebar = useMemo(
    () => [
      {
        title: "Requisitos",
        items: ["El acta debe ser PDF.", "Completar el nombre del acta."],
      },
      {
        title: "Sugerencias",
        items: ["Verificá que el PDF del acta abra bien antes de subirlo."],
      },
    ],
    []
  );

  const onSubmit = useCallback(
    async (values) => {
      if (!sesion) return;
      setGlobalError("");
      setLoading(true);
      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", values.acta);
        formDataUpload.append("type", "acta");
        formDataUpload.append("id_sesion", sesion.id_sesion);
        formDataUpload.append("fecha_sesion", sesion.fecha_sesion);
        formDataUpload.append("nombre_acta", values.nombreActa);

        const res = await fetch(`${API_BASE}/file/upload/${id}`, {
          method: "POST",
          body: formDataUpload,
        });

        if (!res.ok) throw new Error("Error al subir acta");

        // Éxito
        navigate("/consejo-superior/sesiones");
      } catch (err) {
        console.error(err);
        setGlobalError("Error al subir el acta.");
      } finally {
        setLoading(false);
      }
    },
    [id, sesion, navigate]
  );

  if (fetching) {
    return (
      <main className="min-h-[60vh] bg-base-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center text-gray-600">Cargando sesión…</div>
      </main>
    );
  }

  return (
    <SesionForm
      title="Editar Sesión"
      subtitle="Adjuntá el acta de la sesión."
      initialValues={initialValues}
      fields={fields}
      sidebar={sidebar}
      submitLabel="Guardar"
      onSubmit={onSubmit}
      onCancel={() => navigate(-1)}
      loading={loading}
      globalError={globalError}
    />
  );
}

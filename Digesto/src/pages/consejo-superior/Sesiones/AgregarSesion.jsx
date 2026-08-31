// src/pages/sesiones/AgregarSesion.jsx
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import SesionForm from "../Sesiones/SesionForm";
import api from "../../../api/axiosPrivate";

export default function AgregarSesion() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const initialValues = useMemo(
    () => ({ nombre: "", fecha: "", orden: null }),
    []
  );
  const fields = useMemo(
    () => [
      {
        key: "nombre",
        label: "Nombre de la sesión",
        type: "text",
        placeholder: "Ej.: Orden Marzo 2025",
        validate: (v) => (!String(v ?? "").trim() ? "Ingrese un nombre para la sesión." : ""),
      },
      {
        key: "fecha",
        label: "Fecha",
        type: "date",
        validate: (v) => (!v ? "Seleccione la fecha de la sesión." : ""),
      },
      {
        key: "orden",
        label: "Orden del día (PDF)",
        type: "fileDrop",
        accept: "application/pdf",
        help: "Formato PDF. Tamaño máximo 20 MB.",
        validate: (file) => {
          if (!file) return "Adjunte el PDF del orden del día.";
          if (file.type !== "application/pdf") return "El archivo debe ser un PDF (.pdf).";
          if (file.size > 20 * 1024 * 1024) return "El PDF no puede superar los 20 MB.";
          return "";
        },
      },
    ],
    []
  );

  const sidebar = useMemo(
    () => [
      {
        title: "Requisitos",
        items: ["Nombre claro y único.", "Fecha real de la sesión.", "Archivo en PDF, hasta 20 MB."],
      },
      {
        title: "Sugerencias",
        items: ["Revise que el PDF se abra correctamente.", "Mantenga una convención de nombres consistente."],
      },
    ],
    []
  );

  const onSubmit = useCallback(
    async (values) => {
      setGlobalError("");
      setLoading(true);
      try {
        const payload = {
          nombre_orden: String(values.nombre).trim(),
          fecha_sesion: values.fecha,
          orden_url: values.orden?.name ?? "",
        };

        const res = await api.post("/sesiones/create", payload);
        const data = res.data;
        if (values.orden && data?.id_sesion) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", values.orden);
          formDataUpload.append("id_sesion", data.id_sesion);
          formDataUpload.append("fecha_sesion", values.fecha);
          formDataUpload.append("type", "consejo");

          await api.post(
            `/file/upload/${data.id_sesion}`,
            formDataUpload,
          );
        }

        navigate("/consejo-superior/sesiones");
      } catch (err) {
        console.error(err);
        setGlobalError("No se pudo guardar la sesión. Intentá nuevamente.");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return (
    <SesionForm
      title="Agregar Sesión del Consejo"
      subtitle="Registre la sesión y adjunte el orden del día en PDF."
      initialValues={initialValues}
      fields={fields}
      sidebar={sidebar}
      submitLabel="Guardar sesión"
      onSubmit={onSubmit}
      onCancel={() => navigate(-1)}
      loading={loading}
      globalError={globalError}
    />
  );
}

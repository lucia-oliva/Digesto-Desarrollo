import { useState } from "react";

export function useFormNormativa() {
  const [formData, setFormData] = useState({
    tipo_normativa: "",
    numero: "",
    anio: "",
    titulo: "",
    resumen: "",
    fecha: "",
    dependencia: "",
    emisor: "",
    archivo_pdf: null,
    estado: "Publicado",
    cambia_normativa: "NO",
    normativa_modificada: [],
    palabras_clave: [],
  });

  const resetForm = () => {
    setFormData({
      tipo_normativa: "",
      numero: "",
      anio: "",
      titulo: "",
      resumen: "",
      fecha: "",
      dependencia: "",
      emisor: "",
      archivo_pdf: null,
      estado: "Publicado",
      cambia_normativa: "NO",
      normativa_modificada: [],
      palabras_clave: [],
    });
  };

  return {
    formData,
    setFormData,
    resetForm,
  };
}

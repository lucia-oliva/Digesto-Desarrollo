//mapeo campos para enviar datos
export const nombreRutaPorEntidad = {
  tag: "PalabraClave",
  normativa: "Normativa",
  usuario: "Usuario",
  dependencia: "Dependencia",
  // ... otras entidades
};

// Mapea los campos del formData antes de enviarlos al backend
export const mapCamposEditar = (entidad, formData) => {
  const nuevoData = { ...formData };

  const reglas = {
    palabraclave: {
      Tag: "nombre"
    },
    // Agregá aquí más entidades si necesitás
    // usuario: { email: "correo_electronico" },
    // dependencia: { nombre_dependencia: "nombre" }
  };

  if (reglas[entidad]) {
    const reemplazos = reglas[entidad];
    for (const clave in reemplazos) {
      if (nuevoData[clave]) {
        nuevoData[reemplazos[clave]] = nuevoData[clave];
        delete nuevoData[clave];
      }
    }
  }

  return nuevoData;
};

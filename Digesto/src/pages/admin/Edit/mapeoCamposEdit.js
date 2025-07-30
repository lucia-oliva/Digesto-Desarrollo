//mapeo campos para enviar datos
export const nombreRutaPorEntidad = {
  tag: "PalabraClave",
  normativa: "Normativa",
  usuarios: "Usuario",
  dependencia: "Dependencia",
  emisores: "Emisor"
};

export const mapCamposEditar = (entidad, formData) => {
  const nuevoData = { ...formData };

  const reglas = {
    palabraclave: {
      Tag: "nombre"
    },
    normativa: {
      emisor: "id_emisor",
      dependencia: "id_dependencia",
      tipo_normativa: "id_tipo_normativa",
      fecha: "fecha_normativa"
    }
  };

  if (reglas[entidad]) {
    const reemplazos = reglas[entidad];
    for (const clave in reemplazos) {
      if (nuevoData[clave] !== undefined) {
        const valor = nuevoData[clave];
        nuevoData[reemplazos[clave]] = ["emisor", "dependencia", "tipo_normativa"].includes(clave)
          ? Number(valor)
          : valor;
        delete nuevoData[clave];
      }
    }
  }

  return nuevoData;
};
